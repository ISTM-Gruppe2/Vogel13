const stellengesuch = $('Stellengesuch laden').first().json.data;
const comp = parseFloat(stellengesuch.expected_compensation) || 0;
const lower_range = Math.ceil((comp * 0.8) / 1000) * 1000;
const upper_range = Math.ceil((comp * 1.2) / 1000) * 1000;

return [{
  json: {
    ...stellengesuch,
    salary_range: lower_range.toLocaleString('de-DE') + ' € – ' + upper_range.toLocaleString('de-DE') + ' €',
    lower_range: lower_range,
    upper_range: upper_range
  }
}];