const llmOutput = $input.first().json.output || $input.first().json.text || $input.first().json.content;

if (!llmOutput) {
  throw new Error('Kein LLM Output. Felder: ' + Object.keys($input.first().json).join(', '));
}

const cleaned = llmOutput.replace(/```json/g, '').replace(/```/g, '').trim();

const aggr = $('aggregate_data').first();
const enrich = $('enrich_data').first();
const jobApplicantId = aggr.json.applicant_id;
const rawSkills = aggr.json.raw_skill_assessment || [];
const result = aggr.json.result || '';
const feedbackId = aggr.json.feedback_id || '';
const interviewId = aggr.json.interview_id || '';

const interviewDate = enrich ? enrich.json.interview_date : '';
const interviewerName = enrich ? enrich.json.interviewer_name : '';
const processedDate = new Date().toISOString().split('T')[0];

let header = '=== Interview-Feedback Zusammenfassung ===\n';
header += 'Interview-ID: ' + (interviewId || feedbackId) + '\n';
if (interviewDate) header += 'Interview-Datum: ' + interviewDate + '\n';
header += 'Erstellt am: ' + processedDate + '\n';
if (interviewerName) header += 'Interviewer: ' + interviewerName + '\n';
header += '----------------------------------------\n\n';

const isCleared = result.toLowerCase() === 'cleared';

let output = header + cleaned;
output += '\n\n---\n';
output += 'Ergebnis Screening-Interview (Runde 1): ';
output += isCleared ? 'Weiter zu Runde 2.' : 'Kein Weiterkommen.';

const skillAssessmentTable = rawSkills.map(function(s) {
  return {
    skill: s.skill || 'Unbekannt',
    rating: s.rating != null ? s.rating : 0
  };
});

const updatePayload = {
  custom_interview_summary: output,
  custom_skill_assessment: skillAssessmentTable,
  custom_screening_feedback: feedbackId
};

if (enrich && enrich.json.old_summary && enrich.json.old_summary.trim() !== '') {
  updatePayload.custom_interview_summary_history = JSON.stringify([
    {
      version: enrich.json.old_screening_feedback_id || 'unknown',
      date: processedDate,
      summary: enrich.json.old_summary,
      skills: enrich.json.old_skill_assessment || []
    }
  ]);
}

return {
  json: {
    job_applicant_id: jobApplicantId,
    update_payload: updatePayload
  }
};
