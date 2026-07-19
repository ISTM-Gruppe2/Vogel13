const erpResponse = $input.first().json;
const data = erpResponse.data || erpResponse;

return {
  json: {
    success: true,
    message: 'Job Offer erfolgreich erstellt',
    job_offer_id: data.name || 'Unbekannt',
    job_offer_url: data.name ? ('https://grp03.pia-web.ris.uni-due.de/app/job-offer/' + data.name) : '',
    status: data.status || 'Awaiting Response',
    offer_date: data.offer_date || '',
    generation_status: 'AI Generated',
    applicant: data.job_applicant || '',
    designation: data.designation || ''
  }
};
