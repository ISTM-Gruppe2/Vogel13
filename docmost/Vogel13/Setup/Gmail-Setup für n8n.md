# Gmail-Setup für n8n

# 1.1 Voraussetzungen

Bevor du startest, benötigst du:

- Ein Google-/Gmail-Konto
- Zugriff auf deine n8n-Instanz
- Administratorrechte für Google Cloud

---

#   
1.2 Google Cloud Projekt erstellen

- Öffne die [Google Cloud Console](https://console.cloud.google.com?)
- Melde dich mit deinem Gmail-Konto an.
- Klicke oben auf **Projekt auswählen** → **Neues Projekt**.
- Vergib einen Projektnamen (z. B. `n8n-gmail`) und erstelle das Projekt.

---

# 1.3 Gmail API aktivieren

- Öffne im linken Menü:

:::info
**APIs & Dienste → Bibliothek**
:::

- Suche nach **Gmail API**
- Öffne die API und klicke auf **Aktivieren**

---

# 1.4.1 OAuth-Zustimmungsbildschirm konfigurieren

- Gehe zu:

:::info
**APIs & Dienste → OAuth-Zustimmungsbildschirm**
:::

- Wähle:

:::info
**Nutzertyp:** `Extern`
:::

- Klicke auf **Erstellen**

---

# 1.4.2 Grundinformationen ausfüllen

Fülle mindestens folgende Felder aus:

- App-Name
- Support-E-Mail
- Entwickler-E-Mail

Danach speichern und fortfahren.  
<br/>

---

# 1.5 OAuth Client erstellen

- Gehe zu:

:::info
**APIs & Dienste → Anmeldedaten**
:::

- Klicke auf:

:::info
**\+ Anmeldedaten erstellen → OAuth-Client-ID**
:::

- Wähle als Anwendungstyp:

:::info
**Webanwendung**
:::

- Vergib einen Namen für den Client.

---

# 1.6 Redirect-URL für n8n eintragen

Unter **Autorisierte Weiterleitungs-URIs** folgende URL eintragen:

```
Beispiel: https://dein-n8n-name/n8n/rest/oauth2-credential/callback
```

- Danach den OAuth-Client erstellen.

---

# 1.7 OAuth-App veröffentlichen

Nach dem Erstellen des Clients:

- Öffne erneut den **OAuth-Zustimmungsbildschirm**
- Gehe zu **Zielgruppe**
- Stelle die App auf:

:::info
**Produktiv/Veröffentlicht**
:::

:::danger
**Ohne Veröffentlichung kann es später zu OAuth-Fehlern oder eingeschränktem Zugriff kommen.**
:::

---

# 1.8 Client-ID und Secret kopieren

Nach Erstellung des OAuth-Clients erhältst du:

- Client-ID
- Client-Secret

Diese Daten werden in n8n benötigt.

---

# 1.9 Gmail Credentials in n8n anlegen

- Öffne deine n8n-Instanz
- Gehe zu:

:::info
**Credentials → New Credential**
:::

- Suche nach:

:::info
**Gmail OAuth2 API**
:::

- Trage dort ein:
  - Client-ID
  - Client-Secret
- Klicke auf:

:::info
**Sign in with Google**
:::

- Melde dich mit deinem Gmail-Konto an und bestätige die Berechtigungen.

---

# 2.1 Gmail in Nodes verwenden

Die erstellten Credentials können jetzt in Gmail-Nodes verwendet werden, z. B.:

- Gmail Trigger
- Send Email
- Read Email
- Search Messages

Einfach im jeweiligen Node unter **Credentials** die angelegten Gmail-Credentials auswählen.

---

:::info
Teile dieser Seite wurden mit Unterstützung von KI erstellt.
:::