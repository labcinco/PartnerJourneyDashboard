// MenuFunnel.tsx – "Análise do Cardápio" funnel section
// Receives funnel data (your store + competitor benchmark).
// Data is simulated; connect to GA4 for real results.

import { useState } from 'react';

export type FunnelStep = {
    label: string;
    description: string;
    icon: string;
    value: number;              // raw count for your store
    pctOfFirst: number;         // % relative to Visitas (your store)
    competitorPct: number;      // same % for competitor benchmark
    deltaVsCompetitor: number;  // positive = above competitor
};

interface MenuFunnelProps {
    steps: FunnelStep[];
    comparisonLabel?: string;
}

// Bar heights descending to represent the funnel cascade
const BAR_HEIGHTS = [85, 65, 45, 35, 25]; // % of container height

type ViewMode = 'concorrencia' | 'sua_loja';

export default function MenuFunnel({ steps, comparisonLabel = 'Concorrência' }: MenuFunnelProps) {
    const [mode, setMode] = useState<ViewMode>('concorrencia');

    // Delta on final conversion step vs competitor
    const convDelta = steps.length >= 2
        ? (steps[steps.length - 1].pctOfFirst - steps[steps.length - 1].competitorPct)
        : 0;
    const convBelowCompetitor = convDelta < 0;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            {/* ───── Header ───── */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className="material-symbols-outlined text-primary text-2xl">analytics</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Análise do Cardápio</h2>
                    {/* Simulated badge */}
                    <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 rounded-full px-2.5 py-1">
                        <span className="material-symbols-outlined text-[13px]">science</span>
                        Dados Simulados
                    </span>
                </div>

                {/* ── Mode toggle ── */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-full p-1">
                        <button
                            onClick={() => setMode('concorrencia')}
                            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${mode === 'concorrencia'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                }`}
                        >
                            {comparisonLabel}
                        </button>
                        <button
                            onClick={() => setMode('sua_loja')}
                            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${mode === 'sua_loja'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                }`}
                        >
                            Sua loja
                        </button>
                    </div>
                </div>

                {/* ── Summary banner – changes per mode ── */}
                {mode === 'concorrencia' ? (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-700 text-sm">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
                        <span className="text-slate-700 dark:text-slate-300">
                            No período analisado, a conversão do cardápio ficou{' '}
                            <span className={`font-bold inline-flex items-center gap-0.5 ${convBelowCompetitor ? 'text-red-500' : 'text-green-500'}`}>
                                <span className="material-symbols-outlined text-[16px]">
                                    {convBelowCompetitor ? 'arrow_drop_down' : 'arrow_drop_up'}
                                </span>
                                {Math.abs(convDelta).toFixed(2)}%{' '}
                                {convBelowCompetitor ? 'abaixo' : 'acima'}
                            </span>{' '}
                            em comparação com a concorrência.
                        </span>
                    </div>
                ) : (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800/30 text-sm">
                        <span className="material-symbols-outlined text-amber-500 text-[20px] mt-0.5">warning</span>
                        <span className="text-amber-800 dark:text-amber-300">
                            <strong>Atenção:</strong> Os dados abaixo são <strong>simulados</strong> com base nos pedidos confirmados do parceiro.
                            Para métricas reais de visitas, visualizações e sacola, conecte a integração com a{' '}
                            <span className="underline underline-offset-2 cursor-pointer">GA4 Data API</span>.
                        </span>
                    </div>
                )}
            </div>

            {/* ───── Funnel cards ───── */}
            <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {steps.map((step, i) => {
                        const barH = BAR_HEIGHTS[i] ?? 25;
                        const isPositive = step.deltaVsCompetitor >= 0;
                        const isConcorrencia = mode === 'concorrencia';

                        return (
                            <div
                                key={step.label}
                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col h-full hover:border-primary/40 transition-colors"
                            >
                                {/* Card header */}
                                <div className="p-4 flex-grow">
                                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[15px]">{step.icon}</span>
                                        {step.label}
                                    </h3>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                        {step.value.toLocaleString('pt-BR')}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{step.description}</p>

                                    {/* Badge: shows delta (concorrência) or "simulated" tag (sua loja) */}
                                    {isConcorrencia ? (
                                        <div
                                            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">
                                                {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                                            </span>
                                            {isPositive ? '+' : ''}{step.deltaVsCompetitor.toFixed(2)}% {isPositive ? 'acima' : 'abaixo'}
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                                            <span className="material-symbols-outlined text-[11px]">science</span>
                                            Estimado
                                        </div>
                                    )}
                                </div>

                                {/* Bar */}
                                <div className="relative h-28 w-full bg-slate-50 dark:bg-slate-900/50">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-primary flex flex-col items-center justify-end pb-3 transition-all duration-500"
                                        style={{ height: `${barH}%` }}
                                    >
                                        <span className="font-bold text-sm text-white">{step.pctOfFirst.toFixed(2)}%</span>
                                        {isConcorrencia && (
                                            <span className="text-[10px] text-white/80 text-center px-2 leading-tight">
                                                e {step.competitorPct.toFixed(2)}% do concorrente
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer note */}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                    {mode === 'concorrencia'
                        ? '* Comparação com lojas na mesma região, mesmo segmento e média de pedidos similar. Métricas simuladas; conecte a GA4 para dados reais.'
                        : '* Os números de Visitas, Sacola e Revisão são estimativas proporcionais calculadas a partir dos pedidos confirmados. Conecte a GA4 Data API para dados reais por loja.'}
                </p>
            </div>
        </div>
    );
}
