// Code Node: Build Interview Round after Skill creation
// Reads context from format_interview (before HTTP overwrites it)
// Output: Single Interview Round object for ERPNext API

const context = $('format_interview').first().json;

const interviewRound = {
  doctype: 'Interview Round',
  round_name: context.round_name,
  interview_type: context.interview_type,
  job_opening: context.job_opening,
  expected_skill_set: context.all_skills.map((skill, i) => ({
    doctype: 'Expected Skill Set',
    skill: skill.skill_name,
    description: skill.description,
    idx: i + 1
  })),
  interviewers: context.interviewers,
  position: context.position,
  expected_average_rating: context.expected_average_rating,
  custom_job_requisition: context.custom_job_requisition
};

return [{ json: interviewRound }];