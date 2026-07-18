# API

# 1.1 Zugriff auf ERPNext APIs

Die ERPNext APIs können über eine feste URL-Struktur angesprochen werden.

Das allgemeine Schema lautet:

```
https://deine_erpnext_url/api/resource/DocType
```

Dabei wird `DocType` durch den jeweiligen ERPNext-Doctype ersetzt.

---

## 1.2 Beispiel

Wenn auf den Doctype `Employee` zugegriffen werden soll, lautet die URL:

```
https://deine_erpnext_url/api/resource/Employee
```

---

# 1.3 Verwendung in n8n

In n8n kann diese URL in einem **HTTP Request Node** verwendet werden.

Dort wird je nach Anwendungsfall eine passende HTTP-Methode ausgewählt:

```
GET     Daten abrufen

POST    Neue Daten erstellen

PUT     Bestehende Daten aktualisieren

DELETE  Daten löschen
```

---

# 1.4 Authentifizierung

Für den Zugriff auf die ERPNext API müssen gültige API-Credentials verwendet werden.

Diese werden in n8n als Credentials hinterlegt und anschließend im HTTP Request Node ausgewählt.

---

# 1.5 Ergebnis

Über dieses Schema können ERPNext-Daten direkt aus n8n heraus angesprochen und in Workflows weiterverarbeitet werden.

---

:::info
Teile dieser Seite wurden mit Unterstützung von KI erstellt.
:::