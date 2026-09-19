import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Wrench, 
  Layers, 
  Users
} from 'lucide-react';
import { Locker } from '../types';

interface StatCardsProps {
  lockers: Locker[];
}

export const StatCards: React.FC<StatCardsProps> = ({ lockers }) => {
  const total = lockers.length;
  const disponiveis = lockers.filter((l) => l.status === 'DISPONIVEL').length;
  const ocupados = lockers.filter((l) => l.status === 'OCUPADO').length;
  const manutencao = lockers.filter((l) => l.status === 'MANUTENCAO').length;

  const percOcupacao = total > 0 ? Math.round((ocupados / total) * 100) : 0;
  const percDisponivel = total > 0 ? Math.round((disponiveis / total) * 100) : 0;

  // Breakdown by gender
  const masc = lockers.filter((l) => l.vestiario === 'MASCULINO');
  const mascTotal = masc.length;
  const mascOcupados = masc.filter((l) => l.status === 'OCUPADO').length;

  const fem = lockers.filter((l) => l.vestiario === 'FEMININO');
  const femTotal = fem.length;
  const femOcupados = fem.filter((l) => l.status === 'OCUPADO').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* Total Card */}
      <div 
        id="stat-card-total" 
        className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total de Armários
          </span>
          <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Layers className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-500 font-medium">
            100% ativos
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>🚹 Masc: <strong className="text-slate-800">{mascTotal}</strong></span>
          <span>🚺 Fem: <strong className="text-slate-800">{femTotal}</strong></span>
        </div>
      </div>

      {/* Disponíveis Card */}
      <div 
        id="stat-card-disponiveis" 
        className="bg-white rounded-xl p-4 border border-emerald-200/70 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
            Disponíveis
          </span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-emerald-700">{disponiveis}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {percDisponivel}% livres
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-emerald-50 flex items-center justify-between text-xs text-emerald-700">
          <span>Prontos para atribuição</span>
          <span>{total - ocupados - manutencao} un</span>
        </div>
      </div>

      {/* Ocupados Card */}
      <div 
        id="stat-card-ocupados" 
        className="bg-white rounded-xl p-4 border border-sky-200/70 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-sky-700 uppercase tracking-wider">
            Ocupados
          </span>
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
            <Lock className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-sky-800">{ocupados}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
            {percOcupacao}% ocupação
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-sky-50 flex items-center justify-between text-xs text-slate-600">
          <span>🚹 {mascOcupados}/{mascTotal}</span>
          <span>🚺 {femOcupados}/{femTotal}</span>
        </div>
      </div>

      {/* Manutenção / Ocorrências Card */}
      <div 
        id="stat-card-manutencao" 
        className="bg-white rounded-xl p-4 border border-amber-200/70 shadow-xs flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">
            Em Manutenção
          </span>
          <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <Wrench className="w-4 h-4" />
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-amber-800">{manutencao}</span>
          <span className="text-xs font-medium text-amber-700">
            {manutencao === 0 ? 'Tudo operacional' : 'Revisão ou chave'}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-amber-50 flex items-center justify-between text-xs text-amber-800">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Empresas ativas
          </span>
          <span className="font-semibold">
            {new Set(lockers.map((l) => l.currentAllocation?.companyName).filter(Boolean)).size}
          </span>
        </div>
      </div>
    </div>
  );
};
