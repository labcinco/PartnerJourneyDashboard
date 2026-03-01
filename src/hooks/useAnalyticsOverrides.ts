// useAnalyticsOverrides.ts
// Persists per-store analytics (access funnel) data imported from a CSV.
// Key: "analyticsOverride_<estabelecimento>"

import { useState, useCallback } from 'react';

export type StoreAnalytics = {
    sessoes: number;       // Page sessions / visits
    visualizacoes: number; // Item views
    sacola: number;        // Cart adds
    revisao: number;       // Checkout reviews
    concluidos: number;    // Completed orders
    imported_at: string;   // ISO timestamp
};

export const ANALYTICS_STORAGE_PREFIX = 'analyticsOverride_';

export function loadAllAnalyticsOverrides(): Record<string, StoreAnalytics> {
    const result: Record<string, StoreAnalytics> = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(ANALYTICS_STORAGE_PREFIX)) {
            try {
                const val = JSON.parse(localStorage.getItem(key)!);
                const name = key.replace(ANALYTICS_STORAGE_PREFIX, '');
                result[name] = val;
            } catch {
                // ignore corrupt entries
            }
        }
    }
    return result;
}

export function useAnalyticsOverrides() {
    const [analytics, setAnalytics] = useState<Record<string, StoreAnalytics>>(
        () => loadAllAnalyticsOverrides()
    );

    const saveAnalytics = useCallback(
        (estabelecimento: string, values: Omit<StoreAnalytics, 'imported_at'>) => {
            const entry: StoreAnalytics = {
                ...values,
                imported_at: new Date().toISOString(),
            };
            localStorage.setItem(
                `${ANALYTICS_STORAGE_PREFIX}${estabelecimento}`,
                JSON.stringify(entry)
            );
            setAnalytics(prev => ({ ...prev, [estabelecimento]: entry }));
        },
        []
    );

    const clearAnalytics = useCallback((estabelecimento: string) => {
        localStorage.removeItem(`${ANALYTICS_STORAGE_PREFIX}${estabelecimento}`);
        setAnalytics(prev => {
            const next = { ...prev };
            delete next[estabelecimento];
            return next;
        });
    }, []);

    /** Bulk import: save many stores at once (from CSV) */
    const bulkSaveAnalytics = useCallback(
        (rows: { estabelecimento: string; data: Omit<StoreAnalytics, 'imported_at'> }[]) => {
            const now = new Date().toISOString();
            const patch: Record<string, StoreAnalytics> = {};
            rows.forEach(({ estabelecimento, data }) => {
                const entry: StoreAnalytics = { ...data, imported_at: now };
                localStorage.setItem(
                    `${ANALYTICS_STORAGE_PREFIX}${estabelecimento}`,
                    JSON.stringify(entry)
                );
                patch[estabelecimento] = entry;
            });
            setAnalytics(prev => ({ ...prev, ...patch }));
        },
        []
    );

    return { analytics, saveAnalytics, clearAnalytics, bulkSaveAnalytics };
}
