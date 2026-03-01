import { DATA_SOURCE } from '../config/dataSource';
import { GA4_CONFIG } from '../config/ga4Config';

export default function SettingsView() {
    const isGoogleSheetsConfigured = DATA_SOURCE.url && DATA_SOURCE.url !== 'YOUR_PUBLIC_CSV_OR_JSON_ENDPOINT' && !DATA_SOURCE.url.includes('docs.google.com/spreadsheets/d/e/2PACX-.../pub');
    const isGA4Configured = GA4_CONFIG.enabled && GA4_CONFIG.propertyId && GA4_CONFIG.propertyId !== 'YOUR_GA4_PROPERTY_ID';

    return (
        <div className="p-8 max-w-4xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Configurações & Integrações</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Consulte o status das suas conexões com fontes de dados e veja instruções de como configurá-las corretamente no código fonte.
            </p>

            <div className="space-y-8">
                {/* Integração: Google Sheets */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined">table_chart</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Google Sheets (Daily Sync)</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Sincronize a base de clientes do Onboarding via CSV ou Apps Script JSON.</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isGoogleSheetsConfigured ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            <span className={`size-2 rounded-full ${isGoogleSheetsConfigured ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                            {isGoogleSheetsConfigured ? 'Ativo' : 'Não Configurado'}
                        </span>
                    </div>
                    <div className="p-6">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Como Configurar</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                            <li>Publique sua planilha do Google Sheets para a web no formato <strong>CSV</strong> (Arquivo &gt; Compartilhar &gt; Publicar na Web).</li>
                            <li>Copie a URL pública gerada.</li>
                            <li>Abra o arquivo <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-pink-600">src/config/dataSource.ts</code> no seu editor de código.</li>
                            <li>Substitua a propriedade <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-pink-600">url</code> pela sua nova URL do Google Sheets.</li>
                        </ol>
                        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono text-slate-800 dark:text-slate-300">
                            export const DATA_SOURCE = {'{'}<br />
                            &nbsp;&nbsp;type: 'csv',<br />
                            &nbsp;&nbsp;url: '<strong>{DATA_SOURCE.url}</strong>',<br />
                            {'}'};
                        </div>
                    </div>
                </div>

                {/* Integração: Google Analytics 4 */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Google Analytics 4 (GA4)</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Puxe métricas de tráfego (Sessions, Views) via GA4 Data API.</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isGA4Configured ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            <span className={`size-2 rounded-full ${isGA4Configured ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                            {isGA4Configured ? 'Ativo' : 'Não Configurado'}
                        </span>
                    </div>
                    <div className="p-6">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Como Configurar</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                            <li>Crie uma <strong>Service Account</strong> no Google Cloud e conceda a permissão "Analytics Data API Viewer" para o seu GA4.</li>
                            <li>Gere um token JWT (Bearer Token) através da sua chave JSON da Service Account.</li>
                            <li>Abra o arquivo <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-pink-600">src/config/ga4Config.ts</code>.</li>
                            <li>Preencha as opções com seu <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-pink-600">propertyId</code> e seu token gerado (<code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-pink-600">apiKey</code>).</li>
                            <li>Garanta que os eventos do seu GA4 estão enviando a Custom Dimension <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-pink-600">partner_id</code> ou configure corretamente o mapeamento de slugs.</li>
                        </ol>
                        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono text-slate-800 dark:text-slate-300">
                            export const GA4_CONFIG = {'{'}<br />
                            &nbsp;&nbsp;enabled: true,<br />
                            &nbsp;&nbsp;propertyId: '<strong>{GA4_CONFIG.propertyId}</strong>',<br />
                            &nbsp;&nbsp;identifierMode: '{GA4_CONFIG.identifierMode}',<br />
                            {'}'};
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
