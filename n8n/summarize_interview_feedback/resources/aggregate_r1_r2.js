const r2 = $('aggregate_data_r2').first().json;

const r1Response = $('fetch_round1_data').first().json;
const r1Data = r1Response.data || r1Response;

const dsgvoConsent = r1Data.custom_dsgvo_scoring_zustimmung;
const datenschutzConsent = r1Data.custom_datenschutzhinweis_bewerber;

if (!dsgvoConsent || dsgvoConsent !== 1) {
  throw new Error('DSGVO Scoring-Zustimmung fehlt oder nicht erteilt (custom_dsgvo_scoring_zustimmung = ' + dsgvoConsent + '). Abbruch.');
}

if (!datenschutzConsent || datenschutzConsent !== 1) {
  throw new Error('Datenschutzhinweis-Zustimmung fehlt oder nicht erteilt (custom_datenschutzhinweis_bewerber = ' + datenschutzConsent + '). Abbruch.');
}

const r1SummaryRaw = r1Data.custom_interview_summary || '';
if (!r1SummaryRaw || r1SummaryRaw.trim() === '') {
  throw new Error('Keine Zusammenfassung aus Runde 1 vorhanden. Runde 1 wurde vermutlich nicht durchlaufen oder noch nicht zusammengefasst.');
}

const r1Passed = r1SummaryRaw.toLowerCase().includes('weiter zu runde 2');
if (!r1Passed) {
  throw new Error('Kandidat hat Runde 1 nicht bestanden. Fach- & Fit-Gespraech nicht zulaessig.');
}

const firstName = r1Data.custom_vorname || '';
const lastName = r1Data.applicant_name || '';
const applicantName = (firstName + ' ' + lastName).trim();

const r1Summary = r1SummaryRaw;
const r1Skills = r1Data.custom_skill_assessment || [];

const r1SkillsText = Array.isArray(r1Skills) && r1Skills.length > 0
  ? r1Skills.map(function(s) {
      const name = s.skill || 'Unbekannt';
      const rating = s.rating != null ? s.rating : '-';
      return '- ' + name + ': ' + rating;
    }).join('\n')
  : 'Keine Skill-Bewertungen aus Runde 1 vorhanden';

const cvSummary = r1Data.custom_zusammenfassung_cv || '';

const cvSkills = r1Data.custom_skills_und_technologien || [];
const cvSkillsText = Array.isArray(cvSkills) && cvSkills.length > 0
  ? cvSkills.map(function(s) {
      const tech = s.custom_cvskill_technologie || 'Unbekannt';
      const level = s.custom_cveinstufung || '-';
      return '- ' + tech + ': ' + level;
    }).join('\n')
  : 'Keine CV-Skills vorhanden';

const cvCareer = r1Data.custom_beruflicher_werdegang || [];
const cvCareerText = Array.isArray(cvCareer) && cvCareer.length > 0
  ? cvCareer.map(function(c) {
      const title = c.custom_cvjobtitel__position || 'Unbekannt';
      const company = c.custom_cvunternehmen || 'Unbekannt';
      const period = c.custom_cvzeitraum || '-';
      return '- ' + title + ' bei ' + company + ' (' + period + ')';
    }).join('\n')
  : 'Kein beruflicher Werdegang vorhanden';

const jobOpeningId = r1Data.job_title || '';

let jobDescription = '';
const jobOpeningNode = $('get_job_opening_r2');
if (jobOpeningNode) {
  const jobOpeningResponse = jobOpeningNode.first().json;
  const jd = jobOpeningResponse.data || jobOpeningResponse;
  if (jd && jd.doctype === 'Job Opening') {
    jobDescription = jd.description || jd.job_description || '';
  }
}

let interviewerName = '';
let interviewDate = '';
const interviewNode = $('get_interview_r2');
if (interviewNode) {
  const interviewResponse = interviewNode.first().json;
  const interviewData = interviewResponse.data || interviewResponse;
  if (interviewData && interviewData.doctype === 'Interview') {
    interviewDate = interviewData.scheduled_on || '';
    const details = interviewData.interview_details || [];
    if (details.length > 0) {
      interviewerName = details[0].interviewer || '';
    }
  }
}

const sections = r2.feedback_sections || {};
const feedbackStructuredR2 = sections.overall
  ? 'Gesamteindruck:\n' + sections.overall
    + (sections.strengths ? '\n\nStärken:\n' + sections.strengths : '')
    + (sections.weaknesses ? '\n\nSchwächen:\n' + sections.weaknesses : '')
    + (sections.culture ? '\n\nKultur:\n' + sections.culture : '')
    + (sections.logistics ? '\n\nLogistik:\n' + sections.logistics : '')
  : (r2.feedback || '');

const oldTechnicalSummary = r1Data.custom_summary_technical || '';
const oldTechnicalSkillAssessment = r1Data.custom_skill_assessment_technical || [];

return {
  json: {
    applicant_id: r2.applicant_id,
    applicant_name: applicantName,
    position: r2.position,
    round_name: r2.round_name,
    result: r2.result,
    average_rating_r2: r2.average_rating,
    skill_assessments_r2: r2.skill_assessments,
    feedback_r2: r2.feedback,
    feedback_sections_r2: r2.feedback_sections,
    feedback_structured_r2: feedbackStructuredR2,
    raw_skill_assessment_r2: r2.raw_skill_assessment,
    feedback_id_r2: r2.feedback_id,
    interview_id_r2: r2.interview_id,
    r1_summary: r1Summary,
    r1_skills_text: r1SkillsText,
    r1_raw_skills: r1Skills,
    r1_screening_feedback_id: r1Data.custom_screening_feedback || '',
    cv_summary: cvSummary,
    cv_skills: cvSkillsText,
    cv_career: cvCareerText,
    job_opening_id: jobOpeningId,
    job_description: jobDescription,
    interviewer_name: interviewerName,
    interview_date: interviewDate,
    old_summary_technical: oldTechnicalSummary,
    old_skill_assessment_technical: oldTechnicalSkillAssessment
  }
};
