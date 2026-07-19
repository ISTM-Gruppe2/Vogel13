const llmOutput = $input.first().json.output || $input.first().json.text || $input.first().json.content;

if (!llmOutput) {
  throw new Error('Kein LLM Output. Felder: ' + Object.keys($input.first().json).join(', '));
}

const cleaned = llmOutput.replace(/```json/g, '').replace(/```/g, '').trim();

const aggr = $('aggregate_data_r2').first();
const combined = $('aggregate_r1_r2').first();
const jobApplicantId = aggr.json.applicant_id;
const rawSkills = aggr.json.raw_skill_assessment || [];
const result = aggr.json.result || '';
const feedbackId = aggr.json.feedback_id || '';
const interviewId = aggr.json.interview_id || '';

const interviewDate = combined ? combined.json.interview_date : '';
const interviewerName = combined ? combined.json.interviewer_name : '';
const processedDate = new Date().toISOString().split('T')[0];

let header = '=== Finale Interview-Bewertung ===\n';
header += 'Interview-ID: ' + (interviewId || feedbackId) + '\n';
if (interviewDate) header += 'Interview-Datum: ' + interviewDate + '\n';
header += 'Erstellt am: ' + processedDate + '\n';
if (interviewerName) header += 'Interviewer: ' + interviewerName + '\n';
header += '----------------------------------------\n\n';

const isCleared = result.toLowerCase() === 'cleared';

let output = header + cleaned;
output += '\n\n---\n';
output += 'Abschluss Fach- & Fit-Gespraech (Runde 2): ';
output += isCleared ? 'Einstellung empfohlen.' : 'Keine Einstellungsempfehlung.';

const skillAssessmentTable = rawSkills.map(function(s) {
  return {
    skill: s.skill || 'Unbekannt',
    rating: s.rating != null ? s.rating : 0
  };
});

const updatePayload = {
  custom_summary_technical: output,
  custom_skill_assessment_technical: skillAssessmentTable,
  custom_hard_and_softskills_feedback: feedbackId
};

if (combined && combined.json.old_summary_technical && combined.json.old_summary_technical.trim() !== '') {
  updatePayload.custom_summary_technical_history = JSON.stringify([
    {
      version: combined.json.feedback_id_r2 || 'unknown',
      date: processedDate,
      summary: combined.json.old_summary_technical,
      skills: combined.json.old_skill_assessment_technical || []
    }
  ]);
}

return {
  json: {
    job_applicant_id: jobApplicantId,
    update_payload: updatePayload
  }
};
