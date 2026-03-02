// Configuration for data source (Google Sheets)
// Choose either 'csv' for a public CSV URL or 'json' for an Apps Script endpoint returning JSON.
// If using the Apps Script endpoint, provide the API key (X-API-KEY header).

export const DATA_SOURCE = {
    // type: 'csv' | 'json'
    type: 'csv' as const,
    // Use spreadsheet URL from .env
    url: import.meta.env.VITE_SHEETS_URL || '',
    // If using JSON endpoint, set the API key here (optional)
    apiKey: ''
};
