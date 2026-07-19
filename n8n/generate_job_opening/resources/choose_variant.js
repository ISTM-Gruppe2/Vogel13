const data = $input.first().json.data;
const selected = data.selected_variant;

let description = '';
if (selected === 'Enterprise' || selected === '1') {
  description = data.variant_enterprise;
} else if (selected === 'Modern' || selected === '2') {
  description = data.variant_modern;
} else if (selected === 'Compact' || selected === '3') {
  description = data.variant_compact;
}

if (!description) {
  throw new Error('Keine Variante ausgewählt! selected_variant: ' + selected);
}

// Gehaltsrange berechnen: 20% unter/über expected_compensation, auf nächsten Tausender aufrunden
const comp = parseFloat(data.expected_compensation) || 0;
const lowerRaw = comp * 0.8;
const upperRaw = comp * 1.2;
const lower_range = Math.ceil(lowerRaw / 1000) * 1000;
const upper_range = Math.ceil(upperRaw / 1000) * 1000;

return [{
  json: {
    job_title: data.designation,
    designation: data.designation,
    company: data.company,
    department: data.department,
    description: description,
    custom_requirements_profil: data.requirements_profile,
    custom_job_requisition_id: data.stellengesuch,
    custom_angefordert_von: data.requested_by,
    closes_on: data.expected_by,
    location: data.location,
    employment_type: data.employment_type,
    lower_range: lower_range,
    upper_range: upper_range,
    stellengesuch_id: data.stellengesuch
  }
}];