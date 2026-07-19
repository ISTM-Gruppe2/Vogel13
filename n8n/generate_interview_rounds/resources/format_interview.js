// Code Node: Format Interview Round for ERPNext
// Input: LLM Chain output (JSON string) + Webhook data
// Output: N items (one per skill), each carrying full context + all_skills

// Get LLM output from previous node
const llmOutput = $input.first().json.text;

const cleanedOutput = llmOutput
  .replace(/```json/g, '')
  .replace(/```/g, '')
  .trim();

let parsed;
try {
  parsed = JSON.parse(cleanedOutput);
} catch (error) {
  console.error('JSON Parse Error:', error.message);
  console.error('Raw LLM output:', llmOutput);
  throw new Error('Invalid JSON from LLM: ' + error.message);
}

if (!parsed.round_name || !parsed.interview_type || !parsed.expected_skill_set) {
  throw new Error('Missing required fields in LLM output');
}

const webhookItem = $('gen_job_interviews_webhook').first();
const webhookData = webhookItem.json.body;

if (!webhookData.custom_angefordert_von) {
  throw new Error('Interviewer is required but custom_angefordert_von is empty');
}

const allSkills = parsed.expected_skill_set.map((skill) => ({
  skill_name: skill.skill,
  description: skill.description
}));

// One item per skill, each with full context + all_skills for reconstruction
return parsed.expected_skill_set.map((skill, index) => ({
  json: {
    skill_name: skill.skill,
    description: skill.description,
    idx: index + 1,
    all_skills: allSkills,
    round_name: parsed.round_name,
    interview_type: parsed.interview_type,
    job_opening: webhookData.name,
    interviewers: [{ employee: webhookData.custom_angefordert_von }],
    position: parsed.position || 1,
    expected_average_rating: 0.0,
    custom_job_requisition: webhookData.custom_job_requisition_id
  }
}));