import React from 'react';
import { 
  Building2, 
  Phone, 
  Calendar, 
  Clock, 
  FileText, 
  UserCheck, 
  Undo2, 
  MoreVertical, 
  CheckCircle2, 
  Lock, 
  Wrench, 
  Edit3, 
  Printer,
  History,
  Trash2
} from 'lucide-react';
import { Locker } from '../types';
import { formatDateBR } from '../utils/lockerUtils';

interface LockerCardProps {
  locker: Locker;
  onAssign: (locker: Locker) => void;
  onReturn: (locker: Locker) => void;
  onEdit: (locker: Locker) => void;
  onViewDetails: (locker: Locker) => void;
  onPrintReceipt: (locker: Locker) => void;
  onDelete: (lockerId: string) => void;
}

export const LockerCard: React.FC<LockerCardProps> = ({
  locker,
  onAssign,
  onReturn,
  onEdit,
  onViewDetails,
  onPrintReceipt,
  onDelete,
}) => {
  const isOccupied = locker.status === 'OCUPADO' && locker.currentAllocation;
  const isAvailable = locker.status === 'DISPONIVEL';
  const isMaintenance = locker.status === 'MANUTENCAO';
  const alloc = locker.currentAllocation;

  const isMale = locker.vestiario === 'MASCULINO';

  return (
    <div
      id={`locker-card-${locker.id}`}
      className={`relative rounded-xl border bg-white shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
        isOccupied
          ? 'border-sky-200/80 hover:border-sky-300'
          : isAvailable
          ? 'border-emerald-200/80 hover:border-emerald-300'
          : 'border-amber-200/80 hover:border-amber-300'
      }`}
    >
      {/* Top Accent Bar */}
      <div
        className={`h-1.5 w-full ${
          isOccupied
            ? 'bg-sky-500'
            : isAvailable
            ? 'bg-emerald-500'
            : 'bg-amber-500'
        }`}
      />

      <div className="p-4 flex-1 flex flex-col justify-between">
        {/* Header inside Card */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {/* Locker Number Badge */}
              <div className="flex items-center justify-center min-w-10 h-10 px-2 rounded-lg bg-slate-900 text-white font-mono font-bold text-base shadow-2xs">
                {locker.number}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isMale
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                    }`}
                  >
                    <span>{isMale ? '🚹' : '🚺'}</span>
                    {isMale ? 'Masc' : 'Fem'}
                  </span>

                  {locker.location && (
                    <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]" title={locker.location}>
                      {locker.location}
                    </span>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="mt-1 flex items-center gap-1">
                  {isAvailable && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Disponível
                    </span>
                  )}
                  {isOccupied && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800">
                      <Lock className="w-3.5 h-3.5 text-sky-600" />
                      Ocupado
                    </span>
                  )}
                  {isMaintenance && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800">
                      <Wrench className="w-3.5 h-3.5 text-amber-600" />
                      Em Manutenção
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Dropdown / Quick buttons */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onViewDetails(locker)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Histórico e detalhes"
              >
                <History className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onEdit(locker)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Editar armário"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id={`btn-delete-locker-${locker.id}`}
                onClick={() => onDelete(locker.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Excluir armário"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Occupancy / Allocation Details */}
          {isOccupied && alloc ? (
            <div className="space-y-2 py-2 border-t border-slate-100 text-xs">
              {/* Empresa */}
              <div className="flex items-start gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                    Empresa
                  </span>
                  <span className="font-semibold text-slate-900 truncate block text-xs" title={alloc.companyName}>
                    {alloc.companyName}
                  </span>
                </div>
              </div>

              {/* Colaborador / Titular */}
              <div className="flex items-start gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                    Colaborador
                  </span>
                  <span className="font-medium text-slate-800 truncate block" title={alloc.occupantName}>
                    {alloc.occupantName}
                  </span>
                </div>
              </div>

              {/* Contato */}
              {alloc.contact && (
                <div className="flex items-start gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                      Contato
                    </span>
                    <span className="text-slate-700 font-mono text-[11px] truncate block">
                      {alloc.contact}
                    </span>
                  </div>
                </div>
              )}

              {/* Datas: Entrega e Devolução */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed border-slate-200">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                    <Calendar className="w-3 h-3 text-emerald-600" />
                    Entrega:
                  </span>
                  <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">
                    {formatDateBR(alloc.deliveryDate)}
                  </span>
                </div>

                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3 text-sky-600" />
                    Devolução:
                  </span>
                  <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">
                    {alloc.expectedReturnDate ? formatDateBR(alloc.expectedReturnDate) : 'Em aberto'}
                  </span>
                </div>
              </div>

              {/* Observação */}
              {alloc.notes && (
                <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100/80 text-[11px] text-amber-900 mt-1">
                  <div className="flex items-center gap-1 font-semibold text-amber-800 text-[10px] mb-0.5">
                    <FileText className="w-3 h-3" />
                    Observação:
                  </div>
                  <p className="line-clamp-2 italic">
                    "{alloc.notes}"
                  </p>
                </div>
              )}
            </div>
          ) : isAvailable ? (
            <div className="py-4 border-t border-slate-100 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Armário Livre
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-[200px] mx-auto">
                Pronto para ser entregue a uma empresa ou colaborador.
              </p>

              {locker.notes && (
                <p className="text-[11px] text-slate-400 italic mt-2 line-clamp-1">
                  Obs: {locker.notes}
                </p>
              )}
            </div>
          ) : (
            <div className="py-4 border-t border-slate-100 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-600 mb-2">
                <Wrench className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-amber-900">
                Interditado para Reparo
              </p>
              <p className="text-[11px] text-amber-700/80 mt-0.5 line-clamp-2">
                {locker.notes || 'Manutenção programada ou troca de miolo.'}
              </p>
            </div>
          )}
        </div>

        {/* Card Action Footer */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
          {isAvailable && (
            <button
              type="button"
              id={`btn-assign-${locker.id}`}
              onClick={() => onAssign(locker)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Atribuir Armário
            </button>
          )}

          {isOccupied && (
            <>
              <button
                type="button"
                id={`btn-return-${locker.id}`}
                onClick={() => onReturn(locker)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors"
                title="Registrar devolução e liberar armário"
              >
                <Undo2 className="w-3.5 h-3.5 text-sky-700" />
                Devolver
              </button>

              <button
                type="button"
                id={`btn-receipt-${locker.id}`}
                onClick={() => onPrintReceipt(locker)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Imprimir Termo de Entrega / Responsabilidade"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {isMaintenance && (
            <button
              type="button"
              id={`btn-finish-maintenance-${locker.id}`}
              onClick={() => onEdit(locker)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Concluir Manutenção
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
