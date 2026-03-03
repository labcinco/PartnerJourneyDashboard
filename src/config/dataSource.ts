// Configuration for data source (Google Sheets)
// Choose either 'csv' for a public CSV URL or 'json' for an Apps Script endpoint returning JSON.
// If using the Apps Script endpoint, provide the API key (X-API-KEY header).

export const DATA_SOURCE = {
    // type: 'csv' | 'json'
    type: 'csv' as const,
    // Provide a sample CSV url so the project starts with valid mock data since tableData.ts was replaced
    url: import.meta.env.VITE_SHEETS_DATA_URL || 'https://docs.google.com/spreadsheets/d/1rlUp9z9Mf8ipI807U9lR489XAPeU2JrXi72KQJ5PEf0/export?format=csv',
    // If using JSON endpoint, set the API key here (optional)
    apiKey: ''
};
