export interface KPICardProps {
    title: string;
    icon: string;
    value: string;
    trend: {
        direction: 'up' | 'down';
        value: string;
    };
    subtitle?: string;
    progress?: number;
    colorScheme: 'blue' | 'green' | 'yellow' | 'red';
    isGradient?: boolean;
}

const colorMaps = {
    blue: {
        iconBg: 'bg-blue-50 dark:bg-blue-900/30',
        iconText: 'text-primary',
        progressBg: 'bg-blue-500',
    },
    green: {
        iconBg: 'bg-green-50 dark:bg-green-900/30',
        iconText: 'text-green-600',
        progressBg: 'bg-green-500',
    },
    yellow: {
        iconBg: 'bg-yellow-50 dark:bg-yellow-900/30',
        iconText: 'text-yellow-600',
        progressBg: 'bg-yellow-500',
    },
    red: {
        iconBg: 'bg-red-50 dark:bg-red-900/30',
        iconText: 'text-red-600',
        progressBg: 'bg-red-500',
    },
};

export default function KPICard({ title, icon, value, trend, subtitle, progress, colorScheme, isGradient }: KPICardProps) {
    if (isGradient) {
        return (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 shadow-lg text-white mt-auto">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-300 text-sm font-medium">{title}</p>
                    <span className="material-symbols-outlined text-slate-400">{icon}</span>
                </div>
                <p className="text-3xl font-bold mb-2">{value}</p>
                <div className="flex items-center gap-2 text-sm text-green-400">
                    <span className="material-symbols-outlined text-[16px]">
                        {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
                    </span>
                    <span>{trend.direction === 'up' ? '+' : '-'}{trend.value} vs mês anterior</span>
                </div>
            </div>
        );
    }

    const colors = colorMaps[colorScheme];

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm ${progress !== undefined ? 'relative overflow-hidden' : ''}`}>
            {progress !== undefined && progress === 100 && (
                <div className="absolute top-0 right-0 p-3 opacity-5">
                    <span className="material-symbols-outlined text-[80px]">check_circle</span>
                </div>
            )}
            <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
                <div className={`${colors.iconBg} p-1.5 rounded-md ${colors.iconText}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <p className="text-slate-900 dark:text-white text-3xl font-bold">{value}</p>
                <span className={`inline-flex items-baseline rounded-full px-2 py-0.5 text-xs font-medium ${trend.direction === 'up' && colorScheme !== 'red' && colorScheme !== 'yellow'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    <span className="material-symbols-outlined text-[14px] mr-0.5">
                        {trend.direction === 'up' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                    {trend.value}
                </span>
            </div>

            {progress !== undefined && (
                <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                    <div className={`${colors.progressBg} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {subtitle && (
                <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
            )}
        </div>
    );
}
