import React from 'react';
import { 
  Building2, 
  Phone, 
  Calendar, 
  FileText, 
  UserCheck, 
  Undo2, 
  Edit3, 
  Printer, 
  History,
  CheckCircle2,
  Lock,
  Wrench,
  Trash2
} from 'lucide-react';
import { Locker } from '../types';
import { formatDateBR } from '../utils/lockerUtils';

interface LockerTableViewProps {
  lockers: Locker[];
  onAssign: (locker: Locker) => void;
  onReturn: (locker: Locker) => void;
  onEdit: (locker: Locker) => void;
  onViewDetails: (locker: Locker) => void;
  onPrintReceipt: (locker: Locker) => void;
  onDelete: (lockerId: string) => void;
}

export const LockerTableView: React.FC<LockerTableViewProps> = ({
  lockers,
  onAssign,
  onReturn,
  onEdit,
  onViewDetails,
  onPrintReceipt,
  onDelete
}) => {
  if (lockers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        Nenhum armário encontrado com os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3.5">Armário</th>
              <th className="py-3 px-3.5">Vestiário</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5">Empresa</th>
              <th className="py-3 px-3.5">Colaborador</th>
              <th className="py-3 px-3.5">Contato</th>
              <th className="py-3 px-3.5">Data Entrega</th>
              <th className="py-3 px-3.5">Previsão Devolução</th>
              <th className="py-3 px-3.5">Observação</th>
              <th className="py-3 px-3.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lockers.map((locker) => {
              const isOccupied = locker.status === 'OCUPADO';
              const isAvailable = locker.status === 'DISPONIVEL';
              const isMaintenance = locker.status === 'MANUTENCAO';
              const alloc = locker.currentAllocation;
              const isMale = locker.vestiario === 'MASCULINO';

              return (
                <tr 
                  key={locker.id} 
                  id={`table-row-${locker.id}`}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Número */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md text-xs">
                      {locker.number}
                    </span>
                    {locker.location && (
                      <span className="block text-[10px] text-slate-400 mt-0.5 max-w-[130px] truncate">
                        {locker.location}
                      </span>
                    )}
                  </td>

                  {/* Vestiário */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isMale
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                      }`}
                    >
                      <span>{isMale ? '🚹' : '🚺'}</span>
                      {isMale ? 'Masculino' : 'Feminino'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    {isAvailable && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Disponível
                      </span>
                    )}
                    {isOccupied && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200/60">
                        <Lock className="w-3 h-3 text-sky-600" />
                        Ocupado
                      </span>
                    )}
                    {isMaintenance && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                        <Wrench className="w-3 h-3 text-amber-600" />
                        Manutenção
                      </span>
                    )}
                  </td>

                  {/* Empresa */}
                  <td className="py-3 px-3.5">
                    {alloc?.companyName ? (
                      <span className="font-semibold text-slate-900 block max-w-[150px] truncate" title={alloc.companyName}>
                        {alloc.companyName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">-</span>
                    )}
                  </td>

                  {/* Colaborador */}
                  <td className="py-3 px-3.5">
                    {alloc?.occupantName ? (
                      <span className="text-slate-800 font-medium block max-w-[140px] truncate" title={alloc.occupantName}>
                        {alloc.occupantName}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">-</span>
                    )}
                  </td>

                  {/* Contato */}
                  <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px] text-slate-600">
                    {alloc?.contact || <span className="text-slate-400 italic">-</span>}
                  </td>

                  {/* Data Entrega */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-700">
                    {alloc?.deliveryDate ? formatDateBR(alloc.deliveryDate) : '-'}
                  </td>

                  {/* Previsão Devolução */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-700">
                    {alloc?.expectedReturnDate ? formatDateBR(alloc.expectedReturnDate) : (isOccupied ? 'Em aberto' : '-')}
                  </td>

                  {/* Observação */}
                  <td className="py-3 px-3.5 max-w-[160px]">
                    <span 
                      className="text-slate-600 truncate block text-[11px]" 
                      title={alloc?.notes || locker.notes || ''}
                    >
                      {alloc?.notes || locker.notes || '-'}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 justify-end">
                      {isAvailable && (
                        <button
                          type="button"
                          onClick={() => onAssign(locker)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                          Atribuir
                        </button>
                      )}

                      {isOccupied && (
                        <>
                          <button
                            type="button"
                            onClick={() => onReturn(locker)}
                            className="px-2 py-1 rounded-md text-[11px] font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors"
                            title="Registrar devolução"
                          >
                            Devolver
                          </button>
                          <button
                            type="button"
                            onClick={() => onPrintReceipt(locker)}
                            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Comprovante de entrega"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewDetails(locker)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Histórico de uso"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(locker)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Editar armário"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(locker.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Excluir armário"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
