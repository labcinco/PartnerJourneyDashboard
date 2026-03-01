import { PriorityBadge, StatusBadge } from './StatusBadge';
import type { Priority, Status } from './StatusBadge';

export interface Partner {
    id: string;
    name: string;
    initials: string;
    brandColorClass: string;
    city: string;
    priority: Priority;
    activeDays: number;
    totalDays: number;
    totalGMV: string;
    salesPerDay: string;
    orders: number;
    status: Status;
}

interface PartnerTableProps {
    partners: Partner[];
    totalResults: number;
    currentPage: number;
}

export default function PartnerTable({ partners, totalResults, currentPage }: PartnerTableProps) {
    return (
        <div className="flex-1 overflow-x-auto p-6 flex flex-col">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nome do Parceiro</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Cidade</th>
                                <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prioridade</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dias Ativos</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">GMV Total</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Vendas/Dia</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden xl:table-cell">Pedidos</th>
                                <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Edit</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                            {partners.map((partner) => (
                                <tr key={partner.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary sm:pl-6">
                                        <a href="#" className="hover:underline flex items-center gap-2">
                                            <div className={`size-8 rounded flex items-center justify-center font-bold text-xs ${partner.brandColorClass}`}>
                                                {partner.initials}
                                            </div>
                                            {partner.name}
                                        </a>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">{partner.city}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                        <PriorityBadge priority={partner.priority} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-right">
                                        {partner.activeDays} / {partner.totalDays}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900 dark:text-slate-200 font-medium text-right hidden md:table-cell">
                                        {partner.totalGMV}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-right hidden lg:table-cell">
                                        {partner.salesPerDay}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-right hidden xl:table-cell">
                                        {partner.orders}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                        <StatusBadge status={partner.status} />
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t mt-4 border-slate-200 dark:border-slate-700 px-4 py-3 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-700 dark:text-slate-400">
                            Mostrando <span className="font-medium">{(currentPage - 1) * partners.length + 1}</span> a <span className="font-medium">{currentPage * partners.length}</span> de <span className="font-medium">{totalResults}</span> resultados
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0">
                                <span className="sr-only">Anterior</span>
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </a>
                            <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">1</a>
                            <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0">2</a>
                            <a href="#" className="relative hidden items-center px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-300 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a>
                            <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 focus:z-20 focus:outline-offset-0">
                                <span className="sr-only">Próximo</span>
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
