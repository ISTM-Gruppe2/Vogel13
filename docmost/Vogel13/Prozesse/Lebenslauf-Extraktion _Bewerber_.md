# Lebenslauf-Extraktion "Bewerber"

# Zielsetzung

Die Zielsetzung des Lebenslauf-Extraktions-Workflows besteht darin, den Lebenslauf eines Bewerbers im PDF-Format vollautomatisiert durch den kombinierten Einsatz von n8n und KI (LLM) in Echtzeit zu analysieren und die relevanten Informationen strukturiert in die vordefinierten Felder der ERPnext-Stammdaten des dazugehörigen Bewerbers zu übertragen.

# Prozessdiagramm des Lebenslauf-Extraktion Workflow

![](files/019e424b-6700-7368-b5c4-cfe30bb62510/UML_Lebenslauf_Extrahierung.PNG)

[Lebenslauf_Extrahierung_UML.drawio](files/019e424d-2224-7476-b14a-3f8c0d0b9eed/Lebenslauf_Extrahierung_UML.drawio)

(Felder müssen ggf. noch angepasst werden)

# Implementierung des Lebenslauf-Extraktions-Workflows

## Schritt 1: ERPNext - Benutzerdefinierte Felder & Webhook einrichten

Damit Bewerber ihren Lebenslauf im PDF-Format hochladen können und diese Daten automatisch an n8n übergeben werden, müssen zunächst die passenden Felder sowie ein Webhook im ERPNext Desk eingerichtet werden.

### **1.1 Benutzerdefinierte Felder anlegen**

1. Navigiere zu “Formulare anpassen”
2. Wähle als Formulartyp "Bewerber” (Job Applicant) aus
3. Entsprechende Felder/Tabs wie “Lebenslauf hochladen”, "Skills", "Berufsjahre" etc. hinzufügen und den gewünschten Feldtyp auswählen![](files/019e45f1-109f-7723-9bcf-c1e4ec21d586/image.png)
  - Beispiel: "Zusammenfassung Lebenslauf"
    - Label: Zusammenfassung Lebenslauf
    - Feldtyp: Text
    - Name: custom_zusammenfassung_lebenslauf (automatisch generiert!)
4. Änderungen speichern

### 1.2 Webformular anpassen (um Lebensläufe hochzuladen)

1. Der DocType "Job Applicant" wird dupliziert (da der Standard Job Applicat nicht verändert werden kann)![](files/019e456b-03ad-712c-b4fe-1e3b89013e86/image.png)
2. Unter Web-Formularfelder wurde die Zeile "Lebenslauf" hinzugefügt

![](files/019e456c-3f9f-77a8-a7bc-847aaa07d898/image.png)![](files/019e456c-55a7-73cf-af09-b5fb4583af8b/image.png)

3. Unter dem Tab "Anpassung" wurde Folgendes hinzugefügt
  - Erfolgsmeldung, nachdem sich der Bewerber beworben hat![](files/019e456c-d465-715b-91e4-a2efc3600461/image.png)
  - Client-Skript hinzugefügt, man erhält eine Mitteilung im Browser wenn das hochgheladen Dokument kein .pdf Format ist.

```
			frappe.web_form.on('resume_attachment', (field, value) => {
			    if (value && !value.toLowerCase().endsWith('.pdf')) {
			        //Benachrichtigung im Browser
			        frappe.msgprint({
			        title: __('Ungültiges Dateiformat'),
					message: __('Bitte nur PDF-Dateien hochladen!')});
						// löscht das Feld wieder
						frappe.web_form.set_value('resume_attachment', null);
						}
				});
				
			frappe.web_form.on('resume_link', (field, value) => {
			    if (!frappe.utils.is_url(value)) {
			    frappe.msgprint(__('Resume link not valid'));
			    }
});
```

### 1.3 Neuen Webhook "Lebenslauf-Extraktion Bewerber" anlegen

1. Suche nach "Webhook" und erstelle einen neuen
2. Wähle als DocType "Bewerber” (Job Applicant) aus
3. Dokumentenereignis aktivieren und auf "nach_einfügen" einstellen
4. Füge bei Webhook Anfrage-URL die URL aus deiner n8n Webhook-Node ein (siehe Schritt 2)
5. Anfragemethode auf "POST" umstellen
6. Struktur auf "JSON" einstellen
7. Gib unter Webhook-Daten (JSON-Anforderungshauptteil) folgenden Code ein:

```
{
  "name": "{{ doc.name }}",
  "resume_attachment": "{{ doc.resume_attachment }}",
  "applicant_name": "{{ doc.applicant_name }}"
}
```

8. Klicke auf Speichern

## Schritt 2: n8n Workflow aufsetzen

### 2.1 Workflow erstellen & Webhook Node hinzufügen

1. Erstelle einen neuen Workflow in n8n
2. Füge einen Webhook Node hinzu![](files/019e45f9-1fbf-770f-ada4-2acc74a6eb0e/image.png)
3. Kopiere die Test URL des Webhooks und füge sie in den in Schritt 1.2 erstellten ERPNext-Webhook ein

### 2.2 HTTP Request Node - Datei herunterladen (PDF)

1. Füge einen HTTP Request Node hinzu
2. Fülle die folgenden Felder wie folgt aus: Methode, URL, Credentials,Options![](files/019e45fd-5445-720b-a45c-1a9dca2b13a2/image.png)
3. Füge die Response Option hinzu![](files/019e45fd-95a4-716b-96ed-a9e2dabde799/image.png)

### 2.3 Text aus PDF extrahieren (Extract From File Node)

1. Füge den Extracvt From File Node an den HTTP Request Node an

![](files/019e45ff-aa2a-77d5-b478-8d94b250316d/image.png)

### 2.4 Basic LLM Chain einbinden

1. Füge die Basic LLM Chain Node an den Extract from File an
2. Source for Prompt: Define below
3. Definiere ein Prompt
  1. _Beispiel Prompt:_ "Du bist ein erfahrener HR-Assistent. Fasse den folgenden Lebenslauf kurz und prägnant in 4-5 Bulletpoints zusammen. Fokussiere dich auf: Relevante Berufserfahrung, Kernkompetenzen und höchste Ausbildung. Lebenslauf-Text: {{ \$json.text }}
4. Füge als Model “OpenRouter Chat Model” an & wähle ein geeignetes Model (free) aus![](files/019e4602-43bc-72d4-8fdf-ae2137394fa1/image.png)

### 2.5 HTTP Request Upload PDF Informationen

1. Füge einen weiteren HTTP Request Node an den Basic LLM Chain an
2. Fülle die folgenden Felder wie folgt aus:![](files/019e4604-831b-73ff-9658-630212f6ff06/image.png)
3. Erstelle ein neues Body Field unter “Body Parameters”![](files/019e4605-8603-70e8-b9ce-0822a07f28bf/image.png)

### Gesamter n8n Workflow

![](files/019e424b-9972-77dd-9d64-3bf85662c9f5/CV_Parsing_Bewerber_Screenshot.PNG)

```
{
  "name": "CV Parsing Bewerber",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "f991c02f-dc8c-4d6c-b9c4-2d5fe7091574",
        "responseMode": "lastNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [
        0,
        0
      ],
      "id": "ff9989b0-7ced-4489-bbe7-ad5c379cc37e",
      "name": "Webhook",
      "webhookId": "f991c02f-dc8c-4d6c-b9c4-2d5fe7091574"
    },
    {
      "parameters": {
        "operation": "pdf",
        "options": {}
      },
      "type": "n8n-nodes-base.extractFromFile",
      "typeVersion": 1.1,
      "position": [
        416,
        0
      ],
      "id": "75f8da77-8a0e-4fce-8f6a-76932441992c",
      "name": "Extract from File"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "=\"Du bist ein erfahrener HR-Assistent. Fasse den folgenden Lebenslauf kurz und prägnant in 4-5 Bulletpoints zusammen. Fokussiere dich auf: Relevante Berufserfahrung, Kernkompetenzen und höchste Ausbildung.  Lebenslauf-Text:  {{ $json.text }}",
        "batching": {}
      },
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.9,
      "position": [
        640,
        0
      ],
      "id": "a59dbca8-e404-4a23-b767-3c8289aef411",
      "name": "Basic LLM Chain"
    },
    {
      "parameters": {
        "model": "nvidia/nemotron-3-nano-30b-a3b:free",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenRouter",
      "typeVersion": 1,
      "position": [
        720,
        176
      ],
      "id": "960eb7c0-a681-427f-ae0b-50f1ca5894e2",
      "name": "OpenRouter Chat Model",
      "credentials": {
        "openRouterApi": {
          "id": "gV4gmtpeDlI3iWe0",
          "name": "OpenRouter account 2"
        }
      }
    },
    {
      "parameters": {
        "url": "=https://grp03.pia-web.ris.uni-due.de/api/method/frappe.core.doctype.file.file.download_file?file_url={{ $json.body.resume_attachment }}",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "erpNextApi",
        "options": {
          "response": {
            "response": {
              "responseFormat": "file"
            }
          }
        }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [
        208,
        0
      ],
      "id": "c472d639-adbf-4a80-aded-f16f127e4ea4",
      "name": "HTTP Request-GET PDF",
      "credentials": {
        "erpNextApi": {
          "id": "a1ERsZQlr0iW7WEq",
          "name": "ERPNext account 2"
        }
      }
    },
    {
      "parameters": {
        "method": "PUT",
        "url": "=https://grp03.pia-web.ris.uni-due.de/api/resource/Job Applicant/{{ $('Webhook').item.json.body.name }}",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "erpNextApi",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "custom_zusammenfassung_cv",
              "value": "={{ $json.text }}"
            }
          ]
        },
        "options": {}
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [
        992,
        0
      ],
      "id": "2e3873ed-85db-491c-be86-8c2435f22b99",
      "name": "HTTP Request-Upload Infos",
      "credentials": {
        "erpNextApi": {
          "id": "a1ERsZQlr0iW7WEq",
          "name": "ERPNext account 2"
        }
      }
    }
  ],
  "pinData": {},
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "HTTP Request-GET PDF",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenRouter Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "Basic LLM Chain",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Extract from File": {
      "main": [
        [
          {
            "node": "Basic LLM Chain",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Basic LLM Chain": {
      "main": [
        [
          {
            "node": "HTTP Request-Upload Infos",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "HTTP Request-GET PDF": {
      "main": [
        [
          {
            "node": "Extract from File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1",
    "binaryMode": "separate"
  },
  "versionId": "bd6015ca-1284-40a0-af6c-297438c242fe",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "feecff4ee87d901fec92a8285b12c2e797199ea12276c3a54db9cf374027adae"
  },
  "id": "fwjJ7JHxvtx9BBtb",
  "tags": []
}
```

## Schritt 3: Testen und Live schaltung

1. Schalte den n8n Webhook auf Listen for test event
2. Reiche über das ERPNext Webformular "Stellenanzeigen" https://grp03.pia-web.ris.uni-due.de/jobs eine Testbewerbung inklusive Lebenslauf als PDF ein
3. Überprüfe in n8n, ob die Daten alle durchlaufen:
  - n8n-Webhook Node empfängt Daten
  - Datei wird geladen
  - Text extrahiert
  - LLM fasst Lebenslauf zusammen
  - In ERPNext werden die Daten übertragen & aktualisiert
4. Wenn alles funktioniert, klicke in n8n oben rechts auf Active, um den Workflow live zu schalten
  1. **WICHTIG**! Test URL muss auf die Production URL umgeändert werden (in n8n und im ERPnext Desk unter Webhook siehe Schritt 1 und 2)