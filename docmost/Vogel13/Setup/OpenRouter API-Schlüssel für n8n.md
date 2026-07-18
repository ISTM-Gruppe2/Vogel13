# OpenRouter API-Schlüssel für n8n

# 1.1 Voraussetzungen

Bevor du startest, benötigst du:

- Ein OpenRouter-Konto
- Zugriff auf deine n8n-Instanz
- Eine funktionierende Internetverbindung
- Optional: Grundkenntnisse zu HTTP Requests und JSON

---

# 1.2 OpenRouter öffnen

Öffne die OpenRouter-Webseite:

[OpenRoter](https://openrouter.ai?)

Melde dich mit deinem Benutzerkonto an oder erstelle ein neues Konto.

---

# 1.3 API Keys öffnen

Gehe nach dem Login zu:

Keys

Oder direkt über:

[OpenRouter API Keys](https://openrouter.ai/keys)

Hier können neue API-Schlüssel erstellt und verwaltet werden.

---

# 1.4 API Key erstellen

Klicke auf:

Create Key

Vergib optional einen Namen für den Schlüssel, z. B.:

```
n8n-hr-automation
```

OpenRouter erstellt anschließend einen neuen API Key.

---

# 1.5 API Key kopieren

Nach dem Erstellen wird der API Key angezeigt.

Beispiel:

```
sk-or-v1-xxxxxxxxxxxxxxxx
```

Der Key sollte direkt sicher gespeichert werden.

---

# 1.6 Credentials in n8n anlegen

Öffne deine n8n-Instanz.

Gehe zu:

**Credentials → New Credential**

Suche nach:

**OpenRouter**

---

# 1.7 API-Key eintragen

Beispiel:

```
sk-or-v1-xxxxxxxxxxxxxxxx
```

---

# 1.8 HTTP Request Node erstellen

Füge in n8n einen neuen Node hinzu:

HTTP Request

Folgende Einstellungen verwenden:

Method:

```
POST
```

URL

```
https://openrouter.ai/api/v1/chat/completions
```

---

# 1.9 Body konfigurieren

Aktiviere:

```
Send Body
```

Wähle:

```
Body Content Type → JSON
```

Beispiel-Body:

```
{
  "model": "google/gemma-4-31b-it:free",
  "messages": [
    {
      "role": "system",
      "content": "Du bist ein HR-Assistent für ERPNext."
    },
    {
      "role": "user",
      "content": "Erstelle eine Stellenanzeige für einen DevOps Engineer."
    }
  ]
}
```

---

# 1.10 Kostenloses Kontingent verwenden

Damit ausschließlich kostenlose Modelle verwendet werden, muss der Modellname auf `:free` enden.

Beispiel:

```
google/gemma-4-31b-it:free
```

Weitere kostenlose Modelle:

- `deepseek/deepseek-chat-v3:free`
- `meta-llama/llama-3.3-70b-instruct:free`
- `google/gemma-3-27b-it:free`

Eine aktuelle Liste kostenloser Modelle:

[OpenRouter Free Models](https://openrouter.ai/models?fmt=cards&max_price=0)

---

# 1.11 Antwort der KI verwenden

Die Antwort des Modells befindet sich typischerweise unter:

```
choices[0].message.content
```

In n8n kann darauf mit einer Expression zugegriffen werden:

```
{{$json["choices"][0]["message"]["content"]}}
```

---

# 1.12 Ergebnis

OpenRouter ist nun erfolgreich mit n8n verbunden.

Damit können unter anderem folgende Prozesse automatisiert werden:

- Stellenanzeigen generieren
- Bewerbungen analysieren
- HR-Texte erstellen
- E-Mails automatisch formulieren
- ERPNext-Daten mit KI verarbeiten
- Dokumente zusammenfassen

---

:::info
Teile dieser Seite wurden mit Unterstützung von KI erstellt.
:::