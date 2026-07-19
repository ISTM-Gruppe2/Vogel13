const payload = $json.body || $json;

const roundName = payload.interview_round || '';
const isFach = roundName.toLowerCase().includes('fach-');

if (!isFach) {
  throw new Error('Kein Fach- & Fit-Gespraech (Runde 2). Abbruch. Runde: ' + roundName);
}

const skills = payload.skill_assessment || [];
const averageRating = skills.length > 0
  ? parseFloat((skills.reduce((sum, s) => sum + (s.rating || 0), 0) / skills.length).toFixed(2))
  : 0;

const skillsText = skills.length > 0
  ? skills.map(function(s) {
      const name = s.skill || 'Unbekannt';
      const rating = s.rating != null ? s.rating : '-';
      return '- ' + name + ': ' + rating;
    }).join('\n')
  : 'Keine Skill-Bewertungen vorhanden';

function parseFeedbackSections(text) {
  const result = { overall: '', strengths: '', weaknesses: '', culture: '', logistics: '', other: '' };
  if (!text) return result;
  const lines = text.split('\n');
  let currentSection = 'overall';
  for (const line of lines) {
    const lower = line.trim().toLowerCase();
    if (lower.startsWith('gesamteindruck')) { currentSection = 'overall'; result.overall += line.trim() + '\n'; continue; }
    if (lower.startsWith('starken') || lower.startsWith('staerken')) { currentSection = 'strengths'; result.strengths += line.trim() + '\n'; continue; }
    if (lower.startsWith('schwachen') || lower.startsWith('schwaechen')) { currentSection = 'weaknesses'; result.weaknesses += line.trim() + '\n'; continue; }
    if (lower.startsWith('kultur')) { currentSection = 'culture'; result.culture += line.trim() + '\n'; continue; }
    if (lower.startsWith('logistik')) { currentSection = 'logistics'; result.logistics += line.trim() + '\n'; continue; }
    if (currentSection === 'overall') result.overall += line + '\n';
    else if (currentSection === 'strengths') result.strengths += line + '\n';
    else if (currentSection === 'weaknesses') result.weaknesses += line + '\n';
    else if (currentSection === 'culture') result.culture += line + '\n';
    else if (currentSection === 'logistics') result.logistics += line + '\n';
    else result.other += line + '\n';
  }
  return {
    overall: result.overall.trim(),
    strengths: result.strengths.trim(),
    weaknesses: result.weaknesses.trim(),
    culture: result.culture.trim(),
    logistics: result.logistics.trim(),
    other: result.other.trim()
  };
}

const sections = parseFeedbackSections(payload.feedback || '');

return {
  json: {
    applicant_id: payload.job_applicant || 'Unbekannt',
    position: payload.position || 'Unbekannt',
    round_name: roundName || 'Fach- & Fit-Gespraech',
    result: payload.result || 'Unbekannt',
    average_rating: averageRating,
    skill_assessments: skillsText,
    feedback: payload.feedback || '',
    feedback_sections: sections,
    raw_skill_assessment: skills,
    interview_id: payload.interview || '',
    feedback_id: payload.name || ''
  }
};
