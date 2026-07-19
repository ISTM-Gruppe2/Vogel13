const weights = { "must-have": 10, "should-have": 3, "nice-to-have": 1};

return $input.all().map(item => {
  const applicant = item.json;
  let totalScore = 0;
  let totalWeight = 0;

  if (applicant.criteria_evaluation && Array.isArray(applicant.criteria_evaluation)) {
    applicant.criteria_evaluation.forEach(criterion => {
      const weight = weights[criterion.importance] || 0;
      const score = parseInt(criterion.req_score, 10) || 0;
      totalScore += score * weight;
      totalWeight += weight;
    });
  }

  const finalScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;

  const erpnextPayload = {
    stellenbezeichnung: applicant.jobs_title, 
    bewerberscore: Math.round(finalScore),
    email: applicant.applicant_email,
    vorname: applicant.applicant_first_name,
    nachname: applicant.applicant_last_name,
    zusammenfassung: applicant.evaluation_summary,
    criteria_breakdown: applicant.criteria_evaluation
      .map(crit => ({
        criterion: crit.req_description,
        importance: crit.importance,
        score: crit.req_score,
        evidence: crit.evidence_from_cv
      }))
      .sort((a, b) => {
        // Wichtigkeit anhand des weights sortieren
        const weightDiff = (weights[b.importance] || 0) - (weights[a.importance] || 0);
        if (weightDiff !== 0) return weightDiff;
        
        // Bei Gleichstand nach Punktzahl absteigend sortieren
        return (parseInt(b.score, 10) || 0) - (parseInt(a.score, 10) || 0);
      })
  };

  return { json: erpnextPayload };
});