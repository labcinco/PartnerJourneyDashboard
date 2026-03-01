import KPICard from './KPICard';
import type { KPICardProps } from './KPICard';

interface SidebarProps {
    metrics: KPICardProps[];
}

export default function Sidebar({ metrics }: SidebarProps) {
    return (
        <aside className="w-full xl:w-[25%] bg-background-light dark:bg-background-dark/50 border-l border-slate-200 dark:border-slate-700 flex flex-col p-6 gap-6">
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Visão Geral da Jornada</h3>
            {metrics.map((metric, index) => (
                <KPICard key={index} {...metric} />
            ))}
        </aside>
    );
}
