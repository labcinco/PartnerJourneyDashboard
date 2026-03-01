export type Priority = 'High' | 'Medium' | 'Low' | 'Alta' | 'Média' | 'Baixa';
export type Status = 'Healthy' | 'Attention' | 'Critical' | 'Saudável' | 'Atenção' | 'Crítico';

export function PriorityBadge({ priority }: { priority: Priority }) {
    const styles = {
        High: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 ring-purple-700/10',
        Alta: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 ring-purple-700/10',
        Medium: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-blue-700/10',
        Média: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-blue-700/10',
        Low: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-slate-500/10',
        Baixa: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-slate-500/10',
    };

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[priority]}`}>
            {priority}
        </span>
    );
}

export function StatusBadge({ status }: { status: Status }) {
    const styles = {
        Healthy: {
            bg: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-green-600/20',
            dot: 'bg-green-600',
        },
        Saudável: {
            bg: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-green-600/20',
            dot: 'bg-green-600',
        },
        Attention: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 ring-yellow-600/20',
            dot: 'bg-yellow-600',
        },
        Atenção: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 ring-yellow-600/20',
            dot: 'bg-yellow-600',
        },
        Critical: {
            bg: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-red-600/20',
            dot: 'bg-red-600',
        },
        Crítico: {
            bg: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-red-600/20',
            dot: 'bg-red-600',
        }
    };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status].bg}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${styles[status].dot}`}></span>
            {status}
        </span>
    );
}
