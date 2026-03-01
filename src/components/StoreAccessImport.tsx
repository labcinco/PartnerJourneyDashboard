// StoreAccessImport.tsx
// Drag-and-drop (or click) CSV importer for store access funnel data.
// Expected CSV columns (case-insensitive):
//   Estabelecimento, Sessoes, Visualizacoes, Sacola, Revisao, Concluidos
//
// Optional columns that are also recognised (both PT-BR accented and ASCII):
//   Sessões / Sessoes
//   Visualizações / Visualizacoes
//   Revisão / Revisao
//   Concluídos / Concluidos

import { useState, useRef, useCallback } from 'react';
import type { StoreAnalytics } from '../hooks/useAnalyticsOverrides';

// ─── types ────────────────────────────────────────────────────────────────────

type ParsedRow = {
    estabelecimento: string;
    data: Omit<StoreAnalytics, 'imported_at'>;
};

type ParseResult =
    | { ok: true; rows: ParsedRow[]; warnings: string[] }
    | { ok: false; error: string };

// ─── CSV parsing helpers ───────────────────────────────────────────────────────

// normalise header names to avoid accent / case issues
function normaliseHeader(h: string): string {
    return h
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // strip accents
        .replace(/[^a-z0-9]/g, '');        // strip non-alphanumeric
}

const HEADER_MAP: Record<string, keyof Omit<StoreAnalytics, 'imported_at'>> = {
    sessao: 'sessoes',
    sessoes: 'sessoes',
    sessions: 'sessoes',
    visitas: 'sessoes',
    visualizacao: 'visualizacoes',
    visualizacoes: 'visualizacoes',
    views: 'visualizacoes',
    sacola: 'sacola',
    cart: 'sacola',
    revisao: 'revisao',
    revisoes: 'revisao',
    checkout: 'revisao',
    concluido: 'concluidos',
    concluidos: 'concluidos',
    completos: 'concluidos',
    pedidos: 'concluidos',
    completed: 'concluidos',
    orders: 'concluidos',
};

function parseCSV(text: string): ParseResult {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return { ok: false, error: 'O arquivo está vazio ou possui apenas cabeçalho.' };

    const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const normHeaders = rawHeaders.map(normaliseHeader);

    // find the "estabelecimento" column
    const estIdx = normHeaders.findIndex(h => h.includes('estabelecimento') || h.includes('loja') || h.includes('store') || h.includes('nome'));
    if (estIdx === -1) return { ok: false, error: 'Coluna "Estabelecimento" não encontrada. Verifique o cabeçalho do CSV.' };

    // map remaining headers to analytics fields
    const fieldMap: Record<number, keyof Omit<StoreAnalytics, 'imported_at'>> = {};
    normHeaders.forEach((h, i) => {
        if (i === estIdx) return;
        const field = HEADER_MAP[h];
        if (field) fieldMap[i] = field;
    });

    const rows: ParsedRow[] = [];
    const warnings: string[] = [];

    lines.slice(1).forEach((line, idx) => {
        if (!line.trim()) return; // skip blank
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const est = cols[estIdx];
        if (!est) { warnings.push(`Linha ${idx + 2}: sem nome de estabelecimento — ignorada.`); return; }

        const data: Omit<StoreAnalytics, 'imported_at'> = {
            sessoes: 0,
            visualizacoes: 0,
            sacola: 0,
            revisao: 0,
            concluidos: 0,
        };

        Object.entries(fieldMap).forEach(([i, field]) => {
            const raw = cols[Number(i)];
            const val = parseInt(raw?.replace(/\D/g, '') || '0', 10);
            (data as any)[field] = isNaN(val) ? 0 : val;
        });

        rows.push({ estabelecimento: est, data });
    });

    if (rows.length === 0) return { ok: false, error: 'Nenhuma linha válida encontrada após o cabeçalho.' };
    return { ok: true, rows, warnings };
}

// ─── component ────────────────────────────────────────────────────────────────

interface StoreAccessImportProps {
    /** If provided, filters the rows to only include this single store */
    filterEstabelecimento?: string;
    onImport: (rows: ParsedRow[]) => void;
    /** Timestamp of existing import (if any), shown as "already imported" */
    lastImportedAt?: string;
    onClear?: () => void;
}

export default function StoreAccessImport({
    filterEstabelecimento,
    onImport,
    lastImportedAt,
    onClear,
}: StoreAccessImportProps) {
    const [dragging, setDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [warnings, setWarnings] = useState<string[]>([]);
    const [preview, setPreview] = useState<ParsedRow[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [pendingRows, setPendingRows] = useState<ParsedRow[] | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(
        (file: File) => {
            if (!file.name.endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'text/plain') {
                setStatus('error');
                setMessage('Apenas arquivos .csv são aceitos.');
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                const text = e.target?.result as string;
                const result = parseCSV(text);
                if (!result.ok) {
                    setStatus('error');
                    setMessage(result.error);
                    return;
                }

                let rows = result.rows;
                if (filterEstabelecimento) {
                    rows = rows.filter(
                        r => r.estabelecimento.toLowerCase() === filterEstabelecimento.toLowerCase()
                    );
                    if (rows.length === 0) {
                        setStatus('error');
                        setMessage(`Não foram encontradas linhas para "${filterEstabelecimento}" no arquivo.`);
                        return;
                    }
                }

                setPendingRows(rows);
                setPreview(rows);
                setWarnings(result.warnings);
                setShowPreview(true);
                setStatus('idle');
                setMessage('');
            };
            reader.readAsText(file, 'UTF-8');
        },
        [filterEstabelecimento]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
        },
        [processFile]
    );

    const handleConfirm = () => {
        if (!pendingRows) return;
        onImport(pendingRows);
        setStatus('success');
        setMessage(`${pendingRows.length} loja${pendingRows.length !== 1 ? 's' : ''} importada${pendingRows.length !== 1 ? 's' : ''} com sucesso.`);
        setShowPreview(false);
        setPendingRows(null);
    };

    return (
        <div className="space-y-4">
            {/* Already imported banner */}
            {lastImportedAt && status !== 'success' && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/30 text-sm">
                    <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Dados importados em:{' '}
                        <strong>{new Date(lastImportedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</strong>
                    </span>
                    {onClear && (
                        <button
                            onClick={onClear}
                            className="text-xs text-blue-500 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-[13px]">delete</span>
                            Remover
                        </button>
                    )}
                </div>
            )}

            {/* Drop-zone */}
            <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all select-none
                    ${dragging
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary/50 hover:bg-primary/5'
                    }`}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ''; }}
                />
                <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">upload_file</span>
                <div className="text-center">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Arraste um arquivo CSV aqui ou clique para selecionar
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Formato esperado: Estabelecimento, Sessoes, Visualizacoes, Sacola, Revisao, Concluidos
                    </p>
                </div>
                {/* CSV template download hint */}
                <a
                    href={`data:text/csv;charset=utf-8,Estabelecimento,Sessoes,Visualizacoes,Sacola,Revisao,Concluidos%0AExemplo da Loja,150,75,40,38,30`}
                    download="modelo_acessos.csv"
                    onClick={e => e.stopPropagation()}
                    className="text-xs text-primary underline underline-offset-2 hover:text-primary/80"
                >
                    Baixar modelo de CSV
                </a>
            </div>

            {/* Error / success messages */}
            {status === 'error' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg text-sm text-red-700 dark:text-red-400">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">error</span>
                    {message}
                </div>
            )}
            {status === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg text-sm text-green-700 dark:text-green-400">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    {message}
                </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Avisos de importação:</p>
                    <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-0.5">
                        {warnings.map((w, i) => <li key={i}>• {w}</li>)}
                    </ul>
                </div>
            )}

            {/* Preview table + confirm */}
            {showPreview && preview.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Preview — {preview.length} loja{preview.length !== 1 ? 's' : ''} encontrada{preview.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setShowPreview(false); setPendingRows(null); }}
                                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[13px]">check</span>
                                Confirmar importação
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    {['Estabelecimento', 'Sessões', 'Visualizações', 'Sacola', 'Revisão', 'Concluídos'].map(h => (
                                        <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {preview.slice(0, 10).map((row, i) => (
                                    <tr key={i} className="bg-white dark:bg-slate-900">
                                        <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">{row.estabelecimento}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.data.sessoes.toLocaleString('pt-BR')}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.data.visualizacoes.toLocaleString('pt-BR')}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.data.sacola.toLocaleString('pt-BR')}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.data.revisao.toLocaleString('pt-BR')}</td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.data.concluidos.toLocaleString('pt-BR')}</td>
                                    </tr>
                                ))}
                                {preview.length > 10 && (
                                    <tr className="bg-white dark:bg-slate-900">
                                        <td colSpan={6} className="px-3 py-2 text-slate-400 italic">
                                            + {preview.length - 10} linha{(preview.length - 10) !== 1 ? 's' : ''} não exibida{(preview.length - 10) !== 1 ? 's' : ''}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
