const payload = $json.body || $json;

const applicantId = payload.email_id;

if (!applicantId) {
  throw new Error('Keine job_applicant oder job_applicant_id im Webhook-Payload gefunden. Keys: ' + Object.keys(payload).join(', '));
}

return {
  json: { applicant_id: applicantId }
};
