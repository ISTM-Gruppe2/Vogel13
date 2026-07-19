const httpResponse = $input.first().json;
const applicant = httpResponse.data || httpResponse;

const firstName = applicant.custom_vorname || '';
const lastName = applicant.applicant_name || '';
const fullName = (firstName + ' ' + lastName).trim();

const interviewSummary = applicant.custom_interview_summary || '';
const technicalSummary = applicant.custom_summary_technical || '';
const cvSummary = applicant.custom_zusammenfassung_cv || '';

const combinedInterviewNotes = [
  '=== SCREENING-FEEDBACK ===',
  interviewSummary,
  '',
  '=== FACHLICHES-FEEDBACK ===',
  technicalSummary
].join('\n');

const careerEntries = (applicant.custom_beruflicher_werdegang || []).map(function(e, i) {
  return '- ' + (e.custom_cvunternehmen || '') + ' | ' + (e.custom_cvjobtitel__position || '') + ' | ' + (e.custom_cvzeitraum || '');
}).join('\n');

return {
  json: {
    applicant_id: applicant.name,
    applicant_name: fullName,
    applicant_email: applicant.email_id,
    designation: applicant.designation || '',
    job_title: applicant.job_title || '',
    applicant_first_name: applicant.custom_vorname || '',
    applicant_last_name: applicant.applicant_name || '',
    applicant_street: applicant.custom_straße || '',
    applicant_city: applicant.custom_stadt || '',
    applicant_plz: applicant.custom_postleitzahl || '',
    applicant_country: applicant.country || '',
    applicant_nationality: applicant.custom_staatsangehörigkeit || '',
    applicant_phone: applicant.phone_number || '',
    applicant_dob: applicant.custom_geburtsdatum || '',
    applicant_education: applicant.custom_höchster_bildungsabschluss || '',
    applicant_experience_years: applicant.custom_gesamtberufsjahre || 0,
    salary_lower: applicant.lower_range || 0,
    salary_upper: applicant.upper_range || 0,
    currency: applicant.currency || 'EUR',
    interview_summaries: combinedInterviewNotes,
    cv_summary: cvSummary,
    career_history: careerEntries
  }
};
