# Lebenslauf-Extraktion "Bewerber"

### Kurzbeschreibung

Als Recruiter möchte ich, dass das System neu eingehende Bewerbungen inklusive des hochgeladenen Lebenslaufs (PDF) automatisch erfasst, den Text extrahiert und mittels KI eine prägnante Zusammenfassung erstellt. Diese Informationen sollen direkt in die dafür vorgesehenen benutzerdefinierten Felder in der Bewerbermaske von ERPNext zurückgeschrieben werden. Dies dient dazu, den manuellen Sichtungsaufwand drastisch zu reduzieren, eine schnelle Vergleichbarkeit von Kandidaten zu ermöglichen und die Datenqualität im HRMS ohne zusätzlichen administrativen Aufwand für das HR-Team zu sichern.

### Zugehöriger Prozessschritt

- Receive Applications and Candidate Profiles
  - Receive .pdf Data

### **Input**

- Bewerberregestrierung aus dem ERPNext Webformular
- JSON Bewerberdatensatz (name, resume_attachment, email)
- PDF Datei des Lebenslauf
- Prompt: “"Du bist ein erfahrener HR-Assistent. Fasse den folgenden Lebenslauf kurz und prägnant in 4-5 Bulletpoints zusammen. Fokussiere dich auf: Relevante Berufserfahrung, Kernkompetenzen und höchste Ausbildung. Lebenslauf-Text: {{ \$json.text }}”

### Verarbeitung durch AI

Die AI analysiert den extrahierten Text der hochgeladenen PDF-Datei mithilfe eines Large Language Models. Über einen spezifischen Prompt agiert das Modell als erfahrener HR-Assistent, extrahiert strukturiert die relevanten Meilensteine und wandelt den Lebenslauf-Text in eine prägnante Zusammenfassung um. Die Verarbeitung erfolgt dabei automatisiert, sobald das Dokumentenereignis nach dem Einfügen einer neuen Bewerbung in ERPNext den n8n Webhook triggert.

### Output

Zusammenfassung Lebenslauf im JSON Format

### Risiken / Grenzen

- Format-Fehler oder fehlerhafter Text-Inhalt
- Halluzinationen der AI bei unübersichtlichen oder lückenhaften Lebenslauf Strukturen der Bewerber

%3CmxGraphModel%3E%3Croot%3E%3CmxCell%20id%3D%220%22%2F%3E%3CmxCell%20id%3D%221%22%20parent%3D%220%22%2F%3E%3CmxCell%20id%3D%222%22%20edge%3D%221%22%20parent%3D%221%22%20source%3D%223%22%20style%3D%22edgeStyle%3DorthogonalEdgeStyle%3Brounded%3D0%3BorthogonalLoop%3D1%3BjettySize%3Dauto%3Bhtml%3D1%3B%22%20target%3D%224%22%20value%3D%22%22%3E%3CmxGeometry%20relative%3D%221%22%20as%3D%22geometry%22%2F%3E%3C%2FmxCell%3E%3CmxCell%20id%3D%223%22%20parent%3D%221%22%20style%3D%22rounded%3D1%3BwhiteSpace%3Dwrap%3Bhtml%3D1%3B%22%20value%3D%22Receive%20Applications%26lt%3Bbr%26gt%3Band%20Candidate%20Profiles%22%20vertex%3D%221%22%3E%3CmxGeometry%20height%3D%2260%22%20width%3D%22120%22%20x%3D%22450%22%20y%3D%22460%22%20as%3D%22geometry%22%2F%3E%3C%2FmxCell%3E%3CmxCell%20id%3D%224%22%20parent%3D%221%22%20yle%3D%22whiteSpace%3Dwrap%3Bhtml%3D1%3Brounded%3D1%3BfillColor%3D%23dae8fc%3BstrokeColor%3D%236c8ebf%3B%22%20value%3D%22Review%20Candidates%26lt%3Bbr%26gt%3Band%20Shortlist%20Applicants%22%20vertex%3D%221%22%3E%3CmxGeometry%20height%3D%2260%22%20width%3D%22120%22%20x%3D%22450%22%20y%3D%22600%22%20as%3D%22geometry%22%2F%3E%3C%2FmxCell%3E%3C%2Froot%3E%3C%2FmxGraphModel%3E

%3CmxGraphModel%3E%3Croot%3E%3CmxCell%20id%3D%220%22%2F%3E%3CmxCell%20id%3D%221%22%20parent%3D%220%22%2F%3E%3CmxCell%20id%3D%222%22%20edge%3D%221%22%20parent%3D%221%22%20source%3D%223%22%20style%3D%22edgeStyle%3DorthogonalEdgeStyle%3Brounded%3D0%3BorthogonalLoop%3D1%3BjettySize%3Dauto%3Bhtml%3D1%3B%22%20target%3D%224%22%20value%3D%22%22%3E%3CmxGeometry%20relative%3D%221%22%20as%3D%22geometry%22%2F%3E%3C%2FmxCell%3E%3CmxCell%20id%3D%223%22%20parent%3D%221%22%20style%3D%22rounded%3D1%3BwhiteSpace%3Dwrap%3Bhtml%3D1%3B%22%20value%3D%22Receive%20Applications%26lt%3Bbr%26gt%3Band%20Candidate%20Profiles%22%20vertex%3D%221%22%3E%3CmxGeometry%20height%3D%2260%22%20width%3D%22120%22%20x%3D%22450%22%20y%3D%22460%22%20as%3D%22geometry%22%2F%3E%3C%2FmxCell%3E%3CmxCell%20id%3D%224%22%20parent%3D%221%22%20style%3D%22whiteSpace%3Dwrap%3Bhtml%3D1%3Brounded%3D1%3BfillColor%3D%23dae8fc%3BstrokeColor%3D%236c8ebf%3B%22%20value%3D%22Review%20Candidates%26lt%3Bbr%26gt%3Band%20Shortlist%20Applicants%22%20vertex%3D%221%22%3E%3CmxGeometry%20height%3D%2260%22%20width%3D%22120%22%20x%3D%22450%22%20y%3D%22600%22%20as%3D%22geometry%22%2F%3E%3C%2FmxCell%3E%3C%2Froot%3E%3C%2FmxGraphModel%3E