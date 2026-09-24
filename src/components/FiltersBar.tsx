import React from 'react';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';
import { DateCategory, SortOption, StatusFilter } from '../types/date';
import { CATEGORY_LIST } from '../utils/categories';

interface FiltersBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  selectedCategory: DateCategory | 'all';
  setSelectedCategory: (category: DateCategory | 'all') => void;
  sortOption: SortOption;
  setSortOption: (sort: SortOption) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  counts,
}) => {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || selectedCategory !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedCategory('all');
  };

  return (
    <div className="bg-[#0e172e] rounded-2xl p-4 border border-slate-800/90 shadow-md shadow-black/20 mb-6 space-y-3.5">
      
      {/* Top Row: Search Input & Status Buttons & Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por plan, notas o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm bg-[#080e1c] hover:bg-[#0a1224] focus:bg-[#0b1428] border border-slate-700/80 rounded-xl outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all text-white placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200 absolute right-2.5 top-1/2 -translate-y-1/2"
              title="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Segmented Controls */}
        <div className="flex items-center p-1 bg-[#080e1c]/90 rounded-xl border border-slate-800 self-start sm:self-auto w-full sm:w-auto overflow-x-auto backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#a2dbfc]/20 text-[#a2dbfc] border border-[#a2dbfc]/40 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Todas</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#a2dbfc]/20 text-[#a2dbfc] rounded-full font-bold">
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-[#a2dbfc]/25 text-[#a2dbfc] border border-[#a2dbfc]/50 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Pendientes</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#a2dbfc]/20 text-[#a2dbfc] rounded-full font-bold">
              {counts.pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-[#a2dbfc]/25 text-[#a2dbfc] border border-[#a2dbfc]/50 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Completadas</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#a2dbfc]/20 text-[#a2dbfc] rounded-full font-bold">
              {counts.completed}
            </span>
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#a2dbfc] absolute left-3 pointer-events-none" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="pl-8 pr-7 py-2 text-xs font-semibold bg-[#080e1c] hover:bg-[#0a1224] border border-slate-700/80 rounded-xl outline-none focus:ring-2 focus:ring-[#a2dbfc]/40 text-slate-200 cursor-pointer appearance-none"
            >
              <option value="date_asc">Fecha: Próximas primero</option>
              <option value="date_desc">Fecha: Más lejanas primero</option>
              <option value="budget_asc">Presupuesto: Menor a mayor</option>
              <option value="budget_desc">Presupuesto: Mayor a menor</option>
              <option value="created_desc">Recién agregadas</option>
            </select>
          </div>
        </div>

      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
        <div className="flex items-center gap-1 text-xs text-slate-400 pr-1 shrink-0">
          <Filter className="w-3 h-3 text-[#a2dbfc]" />
          <span className="hidden sm:inline">Categoría:</span>
        </div>

        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#a2dbfc] text-[#061428] font-bold shadow-sm shadow-[#a2dbfc]/20 border border-[#a2dbfc]'
              : 'bg-[#a2dbfc]/10 text-slate-300 hover:bg-[#a2dbfc]/20 hover:text-white border border-slate-700/60'
          }`}
        >
          ✨ Todas
        </button>

        {CATEGORY_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#a2dbfc] text-[#061428] font-bold shadow-sm shadow-[#a2dbfc]/20 border border-[#a2dbfc]'
                  : 'bg-[#a2dbfc]/10 text-slate-300 hover:bg-[#a2dbfc]/20 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="px-2.5 py-1 text-xs text-[#a2dbfc] hover:underline font-bold underline-offset-2 shrink-0 ml-auto cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

    </div>
  );
};
