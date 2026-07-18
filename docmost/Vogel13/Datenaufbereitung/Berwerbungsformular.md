# Berwerbungsformular

Für den Bewerbungsprozess sollte ein Webformular bereitgestellt werden, das besser auf unsere Anforderungen zugeschnitten ist als das Standardformular. Das standardmäßig vorhandene **Job Application Web Form** war für unseren Anwendungsfall nicht ausreichend, da benötigte Felder, Struktur und Layout nicht in der gewünschten Form abgebildet werden konnten.

Zur Erstellung eines angepassten Bewerbungsformulars wurde im System unter **Webseite > Web-Formular** ein neues Webformular angelegt. In unserem Fall wurde das bestehende **Job-Application-Formular** als Vorlage genutzt bzw. inhaltlich übernommen, damit bereits vorhandene Felder und Voreinstellungen nicht vollständig neu aufgebaut werden mussten.

Anschließend wurden weitere benötigte Felder manuell ergänzt. Diese wurden über die Feldtabelle innerhalb des Webformulars hinzugefügt und konfiguriert. Dabei wurde nicht nur der **Feldinhalt**, sondern auch das **Layout des Formulars** angepasst, damit die Eingabemaske für Bewerbende übersichtlich und strukturiert aufgebaut ist.

![](files/019e5fce-fdf8-757e-9715-ecc786f11f76/grafik.png)

## Einsatz bei offenen Stellen

Damit das neu erstellte Webformular bei einer konkreten Stelle verwendet wird, muss der im Webformular definierte **Pfad bzw. die Route** in der jeweiligen **offenen Stelle** im Feld **Job Application Route** hinterlegt werden. Dadurch wird beim Klick auf die Bewerbungs-Schaltfläche auf der Website nicht das Standardformular, sondern direkt das angepasste Webformular geöffnet.

![](files/019e5fbb-1828-73be-88b5-20fcac43610f/grafik.png)![](files/019e5fbb-af16-7054-8991-7101c1d3c462/grafik.png)

## Startseite - Navigationspunkt "Karriere"

Um Bewerbern und externen Gästen den Zugriff auf das Karriereportal zu ermöglichen, ohne vorherige Authentifizierung am System erforderlich zu sein, wurde die Top-Navigationsleiste der Startseite angepasst. Die Konfiguration erfolgt im Desk unter den **Webseiten-Einstellungen**. Hierbei wurde im Bereich „Navigationsleiste“ unter den Kopfleistensymbolen ein neuer Eintrag für die Karriereseite mit der entsprechenden URL hinterlegt. Dadurch wird sichergestellt, dass die Stellenausschreibungen sowie das Bewerbungsformular auch im uneingeloggten Zustand direkt über die Hauptseite zugänglich und einsehbar sind.

![](files/019e693f-d650-721e-8d57-9f9f36ce8c2c/image.png)![](files/019e693f-faa2-735f-b9af-05e260b2988e/image.png)

Für bereits angemeldete Benutzer wurde dieselbe Verknüpfung über die **Portaleinstellungen** im Bereich „Benutzerdefinierte Sidebar Menu“ für alle Rollen in die linke Seitenleiste eingebunden. Dadurch ist die Jobseite aus jeder Ansicht heraus durchgängig erreichbar.

![](files/019e6952-1979-707a-b396-300243239cf1/image.png)![](files/019e6952-8fd1-7736-8cc2-ed2fdcf3836e/image.png)