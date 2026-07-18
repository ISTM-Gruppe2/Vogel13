# Bewerberstatusänderungen: KI-Mail-Assistent & Automatisierte Bewerbungsgespräch generierung

### Kurzbeschreibung

Als Recruiter möchte ich, dass das System auf manuelle Statusänderungen in der Bewerbermaske je nach ausgewähltem Status automatisiert und mithilfe von KI reagiert. Dadurch soll der administrative Aufwand minimiert werden und eine effektivere und effizientere Bearbeitung des gesamten Recruiting-Prozesses unterstützt werden. Dies dient zum einen für eine lückenlose und zeitnahe Kommunikation mit den Bewerbern sowie zur Entlastung des HR-Teams bei repetitiven Aufgaben, wie dem Verfassen von E-Mails oder der Datenpflege, bis hin zur vollautomatisierten Koordination und Terminierung von Bewerbungsgesprächen. Im Folgenden wurden 8 Statuswerte für den Bewerber definiert, die jeweils verschiedene Funktionen und Workflows auslösen sollen:

1. Status: Abgelehnt
2. Status: Akzeptiert
3. Status: Angehalten
4. Status: Angefordert
5. Status: Keine Rückmeldung
6. Status: Bewerber zurückgezogen
7. Status: Einladung versendet
8. Status: Interview geplant

### Zugehöriger Prozessschritt

- Review Candidates and Shortlist Applicants
  - Candidate Status
    - Update
    - Hold
    - Request
    - Reject
    - Withdrawn
    - Response
    - Accepted
- Schedule Interview
  - Candidate Status
    - Invitation sent
    - Interview scheduled

### **Input**

- Bewerber aus ERPNext / HRMS
- Statusänderung unter "Status"
- JSON Bewerberdaten (Name, Email, Offene Stelle, Position, Status)
- Bewerbungsgespräch aus ERPNext / HRMS
- JSON gebuchte Bewerbungsgespräche (Interview-Runde, Bewerber, Offene Stelle, Position, Status, Datum, Von - Bis Zeit)

### Verarbeitung durch AI

Die AI analysiert die Informationen aus den vorhandenen JSON-Bewerberdaten, den bereits gebuchten Bewerbungsgesprächen sowie den spezifischen Prompts, um automatisch personalisierte E-Mails sowie Terminbestätigungen zu erzeugen und zu versenden, wodurch das System flexibel auf den jeweils ausgewählten Bewerberstatus reagiert. Dieser Workflow steuert auch die automatisierte Erstellung von Bewerbungsgesprächen, bei der ein neu gebuchter Termin mit den bereits vorhandenen Terminen verglichen wird, um Überschneidungen algorithmisch zu prüfen, damit diese nicht zeitgleich stattfinden.

### Output

Je nach Statusänderung wird ein spezifischer Output generiert und verarbeitet:

- **Status: Abgelehnt**
  - KI-verfasste E-Mail wird erstellt und versendet (Absagemail).
- **Status: Angehalten**
  - Aktualisierter Bewerber-Score wird im System hinterlegt und eine Wiedervorlage generiert.
- **Status: Angefordert**
  - Auflistung fehlender Dokumente wird extrahiert.
  - KI-verfasste E-Mail wird erstellt und versendet (Nachforderung).
- **Status: Keine Rückmeldung**
  - Letzter Eintrag des Bewerbers wird geprüft.
  - KI-verfasste E-Mail wird erstellt und versendet (Absagemail nach Fristablauf).
- **Status: Bewerber zurückgezogen**
  - KI-verfasste E-Mail wird erstellt und versendet (Bestätigung des Rückzugs).
- **Status: Einladung versendet**
  - Bereitstellung des dynamischen Kalender-Links zur Terminauswahl.
  - KI-verfasste E-Mail wird erstellt und versendet (Einladungsschreiben).
- **Status: Interview geplant**
  - Algorithmusgeprüfte Erstellung eines neuen Bewerbungsgesprächs im ERPNext (ohne Terminkonflikte).
  - KI-verfasste E-Mail wird erstellt und versendet (Bestätigungsmail mit Termindetails).

### Risiken / Grenzen

- Halluzinationen & Kontextverlust bei E-Mail erstellung
- Synchronisations Lücken bei Terminen
- Teils fehlende Überwachung durch den Menschen