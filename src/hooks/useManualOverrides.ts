// useManualOverrides.ts
// Persists per-store manual week order overrides in localStorage.
// Key: "manualOverrides_<estabelecimento>"
// Value: { week_1, week_2, week_3, week_4, updated_at }

import { useState, useCallback } from 'react';

export type WeekOverride = {
    week_1: number;
    week_2: number;
    week_3: number;
    week_4: number;
    updated_at: string; // ISO timestamp
};

const storageKey = (estabelecimento: string) =>
    `manualOverride_${estabelecimento}`;

/**
 * Read all stored overrides at once (keyed by estabelecimento name).
 * Called on App load to seed state.
 */
export function loadAllOverrides(): Record<string, WeekOverride> {
    const result: Record<string, WeekOverride> = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('manualOverride_')) {
            try {
                const val = JSON.parse(localStorage.getItem(key)!);
                const name = key.replace('manualOverride_', '');
                result[name] = val;
            } catch {
                // ignore corrupt entries
            }
        }
    }
    return result;
}

/**
 * Hook that exposes the full overrides map + save/clear helpers.
 * The component passes the entire overrides map to App so it can
 * re-enrich data on every save.
 */
export function useManualOverrides() {
    const [overrides, setOverrides] = useState<Record<string, WeekOverride>>(
        () => loadAllOverrides()
    );

    const saveOverride = useCallback(
        (estabelecimento: string, values: Omit<WeekOverride, 'updated_at'>) => {
            const entry: WeekOverride = {
                ...values,
                updated_at: new Date().toISOString(),
            };
            localStorage.setItem(storageKey(estabelecimento), JSON.stringify(entry));
            setOverrides(prev => ({ ...prev, [estabelecimento]: entry }));
        },
        []
    );

    const clearOverride = useCallback((estabelecimento: string) => {
        localStorage.removeItem(storageKey(estabelecimento));
        setOverrides(prev => {
            const next = { ...prev };
            delete next[estabelecimento];
            return next;
        });
    }, []);

    return { overrides, saveOverride, clearOverride };
}
