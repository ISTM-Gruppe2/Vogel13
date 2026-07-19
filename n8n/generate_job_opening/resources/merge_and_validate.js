const allowedCategories = [
  "technical_skill", "frameworks", "methodology",
  "experience", "education", "language",
  "soft_skill", "domain_knowledge", "leadership",
  "cultural_fit", "logistics"
];

// Requirements JSON
const reqRaw = $('Requirements extrahieren').first().json.text;
const reqCleaned = reqRaw.replace(/```json/g, '').replace(/```/g, '').trim();
const requirementsProfile = JSON.parse(reqCleaned);

// Validierung & Normalisierung
for (const req of requirementsProfile.requirements) {
  if (!allowedCategories.includes(req.category)) {
    req.category = "technical_skill";
  }
  if (req.category === "soft_skill" && req.importance === "must-have") {
    req.importance = "should-have";
  }
  if (req.importance === "must-have") req.weight = 10;
  if (req.importance === "should-have") req.weight = 7;
  if (req.importance === "nice-to-have") req.weight = 3;
}

// Beschreibungstexte aus den 3 Varianten
const enterprise = $('Variante Enterprise').first().json.text || '';
const modern = $('Variante Modern').first().json.text || '';
const compact = $('Variante Compact').first().json.text || '';

// Stellengesuch-Daten
const stellengesuch = $('Gehaltsrange berechnen').first().json;

return [{
  json: {
    stellengesuch_id: stellengesuch.name,
    designation: stellengesuch.designation,
    company: stellengesuch.company,
    department: stellengesuch.requested_by_dept,
    requested_by: stellengesuch.requested_by,
    expected_by: stellengesuch.expected_by,
    location: stellengesuch.custom_location || '',
    employment_type: stellengesuch.custom_employment_type || '',
    expected_compensation: stellengesuch.expected_compensation,
    variant_enterprise: enterprise.trim(),
    variant_modern: modern.trim(),
    variant_compact: compact.trim(),
    requirements_profile: requirementsProfile,
    requirements_profile_json: JSON.stringify(requirementsProfile),
    status: "Draft"
  }
}];