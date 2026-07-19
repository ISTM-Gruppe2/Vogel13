const llmOutput = $input.first().json.output || $input.first().json.text || $input.first().json.content;

if (!llmOutput) {
  throw new Error('Kein LLM Output erhalten. Verfugbare Felder: ' + Object.keys($input.first().json).join(', '));
}

const cleaned = llmOutput
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();

let parsed;
try {
  parsed = JSON.parse(cleaned);
} catch (error) {
  console.error('JSON Parse Error:', error.message);
  console.error('Raw LLM output:', llmOutput.substring(0, 500));
  throw new Error('Invalid JSON from LLM: ' + error.message);
}

if (!parsed.offer_terms || !Array.isArray(parsed.offer_terms)) {
  throw new Error('LLM output missing offer_terms array');
}

const applicant = $('aggregate_applicant_data').first().json;

const today = new Date();
const offerDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

const sourceTracking = {};
const offerTerms = parsed.offer_terms.map(function(term, i) {
  const source = term.source || 'ai';
  sourceTracking[term.offer_term] = source;
  return {
    offer_term: term.offer_term,
    value: String(term.value || '').trim()
  };
});

const jobOffer = {
  doctype: 'Job Offer',
  job_applicant: applicant.applicant_id,
  applicant_name: applicant.applicant_name || applicant.applicant_last_name,
  applicant_email: applicant.applicant_email,
  status: 'Awaiting Response',
  offer_date: offerDate,
  designation: applicant.designation,
  company: 'Universität Duisburg-Essen Consulting',
  job_offer_term_template: 'Standard',
  select_terms: 'ihk-standard',
  custom_generation_status: 'AI Generated',
  custom_source_tracking: JSON.stringify(sourceTracking),
  offer_terms: offerTerms
};

return {
  json: jobOffer
};
