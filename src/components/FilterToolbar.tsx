interface FilterToolbarProps {
    dateFilter: string;
    setDateFilter: (date: string) => void;
    cityFilter: string;
    setCityFilter: (city: string) => void;
    cities: string[];
}

export default function FilterToolbar({ dateFilter, setDateFilter, cityFilter, setCityFilter, cities }: FilterToolbarProps) {
    const filters = [
        { label: 'Gestor da Carteira', icon: 'person' },
        { label: 'Nível de Prioridade', icon: 'flag' },
    ];

    return (
        <div className="px-6 py-4 flex gap-3 items-center border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-4">Filtros</span>

            {/* Custom City Filter */}
            <div className="relative flex shrink-0 items-center h-9 justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mr-2">Cidade:</span>
                <select
                    className="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none cursor-pointer w-32 appearance-none"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                >
                    <option value="">Todas</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[18px]">keyboard_arrow_down</span>
            </div>

            {/* Custom Date Filter */}
            <div className="relative flex shrink-0 items-center h-9 justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium mr-2">Data de Ativação</span>
                <input
                    type="date"
                    className="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                    value={dateFilter ? dateFilter.split('/').reverse().join('-') : ''}
                    onChange={(e) => {
                        const dateVal = e.target.value; // YYYY-MM-DD
                        if (!dateVal) {
                            setDateFilter('');
                            return;
                        }
                        const [year, month, day] = dateVal.split('-');
                        setDateFilter(`${day}/${month}/${year}`);
                    }}
                />
            </div>

            {filters.map((filter) => (
                <button key={filter.label} className="group flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{filter.label}</span>
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">{filter.icon}</span>
                </button>
            ))}

            <div className="ml-auto flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                </button>
            </div>
        </div>
    );
}
