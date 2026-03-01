// Configuration for data source (Google Sheets)
// Choose either 'csv' for a public CSV URL or 'json' for an Apps Script endpoint returning JSON.
// If using the Apps Script endpoint, provide the API key (X-API-KEY header).

export const DATA_SOURCE = {
    // type: 'csv' | 'json'
    type: 'csv' as const,
    // Example public CSV URL (published Google Sheet)
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv',
    // If using JSON endpoint, set the API key here (optional)
    apiKey: ''
};
