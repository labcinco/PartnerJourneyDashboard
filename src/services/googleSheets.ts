/**
 * Versão compatível com o navegador.
 * Nota: Para uso direto no frontend, recomendamos usar uma API Key ou um Proxy (Apps Script).
 */
export async function getSheetData(range = "NOVOS!A6:Z100") {
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!spreadsheetId || !apiKey) {
        throw new Error("Configurações da API do Google ausentes no .env");
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Erro ao buscar dados da planilha");
    }

    const data = await response.json();
    return data.values; // Retorna array de arrays [[headers], [row1], ...]
}
