import React from 'react';
import { 
  Search, 
  LayoutGrid, 
  List, 
  X,
  Filter
} from 'lucide-react';
import { FilterStatus, FilterVestiario, ViewMode } from '../types';

interface FilterBarProps {
  filterVestiario: FilterVestiario;
  onFilterVestiarioChange: (val: FilterVestiario) => void;
  filterStatus: FilterStatus;
  onFilterStatusChange: (val: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (val: ViewMode) => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterVestiario,
  onFilterVestiarioChange,
  filterStatus,
  onFilterStatusChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalFiltered
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 mb-6 shadow-xs space-y-3.5">
      
      {/* Top Row: Vestiário Tabs & View Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Vestiário Segmented Selector */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg max-w-fit">
          <button
            type="button"
            id="tab-vestiario-todos"
            onClick={() => onFilterVestiarioChange('TODOS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterVestiario === 'TODOS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos os Vestiários
          </button>
          <button
            type="button"
            id="tab-vestiario-masculino"
            onClick={() => onFilterVestiarioChange('MASCULINO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterVestiario === 'MASCULINO'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            <span>🚹</span>
            Vestiário Masculino
          </button>
          <button
            type="button"
            id="tab-vestiario-feminino"
            onClick={() => onFilterVestiarioChange('FEMININO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              filterVestiario === 'FEMININO'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <span>🚺</span>
            Vestiário Feminino
          </button>
        </div>

        {/* View Mode Toggle (Grid vs Table) */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-xs text-slate-500 mr-1 hidden sm:inline">
            Visualização:
          </span>
          <div className="inline-flex p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              id="btn-view-grid"
              onClick={() => onViewModeChange('GRID')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'GRID'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Visualização em Grade de Armários"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-view-table"
              onClick={() => onViewModeChange('TABLE')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'TABLE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Visualização em Tabela Detalhada"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-search-lockers"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por armário, empresa, contato, colaborador..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              id="btn-clear-search"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Status:
          </span>

          <button
            type="button"
            id="filter-status-todos"
            onClick={() => onFilterStatusChange('TODOS')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'TODOS'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>

          <button
            type="button"
            id="filter-status-disponivel"
            onClick={() => onFilterStatusChange('DISPONIVEL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'DISPONIVEL'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50'
            }`}
          >
            Disponíveis
          </button>

          <button
            type="button"
            id="filter-status-ocupado"
            onClick={() => onFilterStatusChange('OCUPADO')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'OCUPADO'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/50'
            }`}
          >
            Ocupados
          </button>

          <button
            type="button"
            id="filter-status-manutencao"
            onClick={() => onFilterStatusChange('MANUTENCAO')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'MANUTENCAO'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50'
            }`}
          >
            Manutenção
          </button>

          <span className="text-xs text-slate-500 ml-2 font-medium">
            ({totalFiltered} {totalFiltered === 1 ? 'armário' : 'armários'})
          </span>
        </div>

      </div>

    </div>
  );
};
