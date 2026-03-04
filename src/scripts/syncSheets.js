import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from project root
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

async function syncSheets() {
    console.log("Iniciando sincronização de dados (Service Account)...");
    try {
        const client = await auth.getClient();
        // @ts-ignore
        const sheets = google.sheets({ version: "v4", auth: client });

        // Fallback to VITE_GOOGLE_SHEET_ID if GOOGLE_SHEET_ID missing
        const spreadsheetId = process.env.GOOGLE_SHEET_ID || process.env.VITE_GOOGLE_SHEET_ID;

        if (!spreadsheetId) {
            throw new Error("ID da planilha não encontrado em .env.local");
        }

        // Fetch data from 'NOVOS!A6:Z'
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "NOVOS!A6:Z100",
        });

        const values = response.data.values;
        if (!values || values.length === 0) {
            console.log("Nenhum dado retornado da planilha.");
            return;
        }

        // Map by columns (ignoring F)
        // A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7, I:8, J:9
        const mappedData = values.map(row => ({
            cidade: row[0] || "",
            id: row[1] || "",
            estabelecimento: row[2] || "",
            status: row[3] || "ativo",
            lancamento: row[4] || "",
            week_1: row[6] || 0,
            week_2: row[7] || 0,
            week_3: row[8] || 0,
            week_4: row[9] || 0
        })).filter(r => r.estabelecimento);

        const outputPath = path.resolve(__dirname, "../../public/remoteData.json");

        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(mappedData, null, 2));
        console.log(`✅ ${mappedData.length} parceiros salvos em public/remoteData.json`);
    } catch (err) {
        console.error("❌ Falha ao sincronizar dados:", err);
        process.exit(1);
    }
}

syncSheets();
