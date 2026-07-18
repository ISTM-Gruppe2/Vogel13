# ERPNext API-Schlüssel für n8n

# 1.1 Voraussetzungen

Bevor du startest, benötigst du:

```
Zugriff auf deine ERPNext-Instanz

Zugriff auf deine n8n-Instanz

Ein ERPNext-Benutzerkonto mit den benötigten Berechtigungen
```

# 1.2 In ERPNext anmelden

```
Öffne deine ERPNext-Instanz

Melde dich mit dem Benutzerkonto an, das später für die API-Verbindung verwendet werden soll
```

# 1.3 Benutzerprofil öffnen

```
Gehe in ERPNext zur Benutzerverwaltung:
```

Users and Permissions → User

```
Öffne den Benutzer, für den der API-Schlüssel erstellt werden soll
```

# 1.4 API-Zugriff öffnen

```
Scrolle im Benutzerprofil zum Bereich:
```

API Access

```
Dort können API-Zugangsdaten für den Benutzer erstellt werden
```

# 1.5 API Key und API Secret erstellen

```
Klicke im Bereich API Access auf:
```

Generate Keys

```
ERPNext erstellt anschließend:

    API Key

    API Secret
```

Das API Secret wird nur einmal vollständig angezeigt und sollte direkt sicher gespeichert werden.

# 1.6 API Key und Secret kopieren

Nach dem Erstellen erhältst du folgende Daten:

```
API Key

API Secret
```

Diese Daten werden in n8n benötigt.

# 1.7 Credentials in n8n anlegen

```
Öffne deine n8n-Instanz

Gehe zu:
```

Credentials → New Credential

```
Suche nach:
```

HTTP Header Auth

# 1.8 Authorization Header eintragen

Trage in den Credentials folgende Werte ein:

```
Header Name:
```

Authorization

```
Header Value:
```

token API_KEY:API_SECRET

Beispiel:

```
token 1234567890abcdef:abcdef1234567890
```

API_KEY und API_SECRET müssen durch die echten Werte aus ERPNext ersetzt werden.

# 1.9 ERPNext API in n8n verwenden

Die erstellten Credentials können jetzt in HTTP Request Nodes verwendet werden.

Beispiel-URL:

```
https://deine-erpnext-instanz.de/api/resource/Employee
```

Im HTTP Request Node:

```
Methode auswählen, z. B. GET oder POST

ERPNext-URL eintragen

Unter Credentials die angelegten HTTP Header Auth Credentials auswählen
```

# 2.1 Beispiel: Mitarbeiterdaten abrufen

Ein einfacher GET-Request kann genutzt werden, um Mitarbeiterdaten aus ERPNext abzurufen:

```
GET https://deine-erpnext-instanz.de/api/resource/Employee
```

Damit kann n8n auf ERPNext-Daten zugreifen und diese in Workflows weiterverarbeiten.

# 2.2 Ergebnis

ERPNext ist nun mit n8n verbunden.

Damit können unter anderem folgende Prozesse automatisiert werden:

```
Mitarbeiterdaten abrufen

Bewerber automatisch anlegen

Abwesenheiten synchronisieren

HR-Daten weiterverarbeiten

ERPNext mit anderen Systemen verbinden
```

:::info
Teile dieser Seite wurden mit Unterstützung von KI erstellt.
:::