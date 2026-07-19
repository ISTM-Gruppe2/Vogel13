const aggr = $('aggregate_data').first().json;

const applicantResponse = $('get_applicant_name').first().json;
const applicantData = applicantResponse.data || applicantResponse;

const dsgvoConsent = applicantData.custom_dsgvo_scoring_zustimmung;
const datenschutzConsent = applicantData.custom_datenschutzhinweis_bewerber;

if (!dsgvoConsent || dsgvoConsent !== 1) {
  throw new Error('DSGVO Scoring-Zustimmung fehlt oder nicht erteilt (custom_dsgvo_scoring_zustimmung = ' + dsgvoConsent + '). Abbruch.');
}

if (!datenschutzConsent || datenschutzConsent !== 1) {
  throw new Error('Datenschutzhinweis-Zustimmung fehlt oder nicht erteilt (custom_datenschutzhinweis_bewerber = ' + datenschutzConsent + '). Abbruch.');
}

let jobOpeningData = null;
const jobOpeningNode = $('get_job_opening');
if (jobOpeningNode) {
  const jobOpeningResponse = jobOpeningNode.first().json;
  jobOpeningData = jobOpeningResponse.data || jobOpeningResponse;
  if (jobOpeningData && jobOpeningData.doctype !== 'Job Opening') {
    jobOpeningData = null;
  }
}

const firstName = applicantData.custom_vorname || '';
const lastName = applicantData.applicant_name || '';
const applicantName = (firstName + ' ' + lastName).trim();

const jobOpeningId = applicantData.job_title || '';

const cvSummary = applicantData.custom_zusammenfassung_cv || '';

const cvSkills = applicantData.custom_skills_und_technologien || [];
const cvSkillsText = Array.isArray(cvSkills) && cvSkills.length > 0
  ? cvSkills.map(function(s) {
      const tech = s.custom_cvskill_technologie || 'Unbekannt';
      const level = s.custom_cveinstufung || '-';
      return '- ' + tech + ': ' + level;
    }).join('\n')
  : 'Keine CV-Skills vorhanden';

const cvCareer = applicantData.custom_beruflicher_werdegang || [];
const cvCareerText = Array.isArray(cvCareer) && cvCareer.length > 0
  ? cvCareer.map(function(c) {
      const title = c.custom_cvjobtitel__position || 'Unbekannt';
      const company = c.custom_cvunternehmen || 'Unbekannt';
      const period = c.custom_cvzeitraum || '-';
      return '- ' + title + ' bei ' + company + ' (' + period + ')';
    }).join('\n')
  : 'Kein beruflicher Werdegang vorhanden';

const sections = aggr.feedback_sections || {};
const feedbackStructured = sections.overall
  ? 'Gesamteindruck:\n' + sections.overall
    + (sections.strengths ? '\n\nStärken:\n' + sections.strengths : '')
    + (sections.weaknesses ? '\n\nSchwächen:\n' + sections.weaknesses : '')
    + (sections.culture ? '\n\nKultur:\n' + sections.culture : '')
    + (sections.logistics ? '\n\nLogistik:\n' + sections.logistics : '')
  : (aggr.feedback || '');

const oldSummary = applicantData.custom_interview_summary || '';
const oldSkillAssessment = applicantData.custom_skill_assessment || [];
const oldScreeningFeedbackId = applicantData.custom_screening_feedback || '';

const jobDescription = jobOpeningData
  ? (jobOpeningData.description || jobOpeningData.job_description || '')
  : '';

let interviewerName = '';
let interviewDate = '';
const interviewNode = $('get_interview');
if (interviewNode) {
  const interviewResponse = interviewNode.first().json;
  const interviewData = interviewResponse.data || interviewResponse;
  if (interviewData && interviewData.doctype !== 'Interview') {
    interviewerName = '';
    interviewDate = '';
  } else {
    interviewDate = interviewData.scheduled_on || '';
    const details = interviewData.interview_details || [];
    if (details.length > 0) {
      interviewerName = details[0].interviewer || '';
    }
  }
}

return {
  json: {
    applicant_id: aggr.applicant_id,
    applicant_name: applicantName,
    position: aggr.position,
    round_name: aggr.round_name,
    result: aggr.result,
    average_rating: aggr.average_rating,
    skill_assessments: aggr.skill_assessments,
    feedback: aggr.feedback,
    feedback_sections: aggr.feedback_sections,
    feedback_structured: feedbackStructured,
    raw_skill_assessment: aggr.raw_skill_assessment,
    interview_id: aggr.interview_id,
    feedback_id: aggr.feedback_id,
    job_opening_id: jobOpeningId,
    job_description: jobDescription,
    cv_summary: cvSummary,
    cv_skills: cvSkillsText,
    cv_career: cvCareerText,
    interviewer_name: interviewerName,
    interview_date: interviewDate,
    old_summary: oldSummary,
    old_skill_assessment: oldSkillAssessment,
    old_screening_feedback_id: oldScreeningFeedbackId
  }
};
