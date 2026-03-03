import { useState, useEffect, useCallback } from 'react';
import { type PerformanceRow } from '../components/PerformanceTable';
import { fetchGoogleSheetsData, saveToCache, loadFromCache, type SyncResult } from '../utils/dataSync';

interface UseDataSyncOptions {
    url: string;
    apiKey?: string;
    autoRefreshIntervalMs?: number; // fallback interval, e.g., 60 * 60 * 1000 for 1 hour
}

export function useDataSync({ url, apiKey, autoRefreshIntervalMs = 3600000 }: UseDataSyncOptions) {
    const [data, setData] = useState<PerformanceRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [isUsingCache, setIsUsingCache] = useState(false);

    const performSync = useCallback(async () => {
        if (!url) {
            setError("Data source URL is missing.");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setIsUsingCache(false);

            const fetchedData = await fetchGoogleSheetsData(url, apiKey);

            const syncResult: SyncResult = {
                data: fetchedData,
                lastSyncTime: new Date(),
            };

            setData(syncResult.data);
            setLastSyncTime(syncResult.lastSyncTime);
            saveToCache(syncResult);

        } catch (err: any) {
            console.error("Data sync failed:", err);
            setError(err.message || "Failed to synchronize data.");

            // Load from cache on failure if available and not already loaded
            const cached = loadFromCache();
            if (cached) {
                setData(cached.data);
                setLastSyncTime(cached.lastSyncTime);
                setIsUsingCache(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [url, apiKey]);

    // Initial load
    useEffect(() => {
        performSync();
    }, [performSync]);

    // Setup interval for fallback refresh
    useEffect(() => {
        if (!autoRefreshIntervalMs) return;
        const intervalId = setInterval(() => {
            performSync();
        }, autoRefreshIntervalMs);

        return () => clearInterval(intervalId);
    }, [performSync, autoRefreshIntervalMs]);

    // Setup scheduled daily refresh at 08:05 AM America/Sao_Paulo
    useEffect(() => {
        const scheduleNextRefresh = () => {
            // Create a date object for the current time
            const now = new Date();

            // Calculate target time: 08:05:00 today in local time
            // The user specified America/Sao_Paulo, assuming the browser is in this timezone or similar
            const target = new Date(now);
            target.setHours(8, 5, 0, 0);

            // If it's already past 08:05 today, schedule for tomorrow
            if (now.getTime() > target.getTime()) {
                target.setDate(target.getDate() + 1);
            }

            const msUntilTarget = target.getTime() - now.getTime();

            return setTimeout(() => {
                performSync();
                // After executing, set up the next one
                scheduleNextRefresh();
            }, msUntilTarget);
        };

        const timeoutId = scheduleNextRefresh();

        return () => clearTimeout(timeoutId);
    }, [performSync]);

    return {
        data,
        isLoading,
        error,
        lastSyncTime,
        isUsingCache,
        refreshData: () => performSync()
    };
}
