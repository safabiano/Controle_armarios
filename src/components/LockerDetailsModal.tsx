import React from 'react';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  History, 
  Key, 
  CheckCircle2, 
  Lock, 
  Wrench,
  Printer,
  Clock,
  MapPin,
  Trash2
} from 'lucide-react';
import { Locker } from '../types';
import { formatDateBR } from '../utils/lockerUtils';

interface LockerDetailsModalProps {
  isOpen: boolean;
  locker: Locker | null;
  onClose: () => void;
  onAssign: (locker: Locker) => void;
  onReturn: (locker: Locker) => void;
  onPrintReceipt: (locker: Locker) => void;
  onDelete?: (lockerId: string) => void;
}

export const LockerDetailsModal: React.FC<LockerDetailsModalProps> = ({
  isOpen,
  locker,
  onClose,
  onAssign,
  onReturn,
  onPrintReceipt,
  onDelete
}) => {
  if (!isOpen || !locker) return null;

  const isMale = locker.vestiario === 'MASCULINO';
  const isOccupied = locker.status === 'OCUPADO';
  const isAvailable = locker.status === 'DISPONIVEL';
  const isMaintenance = locker.status === 'MANUTENCAO';
  const current = locker.currentAllocation;
  const historyList = locker.history || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-lg shadow-xs">
              {locker.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Armário {locker.number}
                </h2>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isMale 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {isMale ? '🚹 Vestiário Masculino' : '🚺 Vestiário Feminino'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                {locker.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {locker.location}
                  </span>
                )}
                <span>•</span>
                <span>
                  Status: 
                  <strong className={`ml-1 ${
                    isOccupied ? 'text-sky-700' : isAvailable ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {isOccupied ? 'Ocupado' : isAvailable ? 'Disponível' : 'Em Manutenção'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isOccupied && (
              <button
                type="button"
                onClick={() => onPrintReceipt(locker)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors mr-1"
                title="Imprimir termo de entrega"
              >
                <Printer className="w-3.5 h-3.5" />
                Termo
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Current Occupancy Card */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Ocupação Atual
            </h3>

            {isOccupied && current ? (
              <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Nome da Empresa
                    </span>
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-4 h-4 text-sky-600" />
                      {current.companyName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Colaborador / Titular
                    </span>
                    <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <User className="w-4 h-4 text-slate-500" />
                      {current.occupantName}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-sky-100">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Contato
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-700 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {current.contact || 'Não cadastrado'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Data de Entrega
                    </span>
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {formatDateBR(current.deliveryDate)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Previsão de Devolução
                    </span>
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      {current.expectedReturnDate ? formatDateBR(current.expectedReturnDate) : 'Em aberto'}
                    </span>
                  </div>
                </div>

                {current.keyOrPadlockTag && (
                  <div className="pt-2 border-t border-sky-100 flex items-center gap-1.5 text-xs text-slate-700">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    <span>Identificação da Chave/Cadeado: <strong>{current.keyOrPadlockTag}</strong></span>
                  </div>
                )}

                {current.notes && (
                  <div className="pt-2 border-t border-sky-100 bg-white/70 p-2.5 rounded-lg text-xs text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-0.5">Campo Observação:</span>
                    <p className="italic">{current.notes}</p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onReturn(locker);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-700 hover:bg-sky-800 text-white transition-colors"
                  >
                    Registrar Devolução Deste Armário
                  </button>
                </div>
              </div>
            ) : isAvailable ? (
              <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Armário Disponível
                  </div>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Nenhuma empresa ou colaborador alocado neste momento.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAssign(locker);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  Atribuir Armário
                </button>
              </div>
            ) : (
              <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <Wrench className="w-4 h-4 text-amber-600" />
                  Armário em Manutenção
                </div>
                <p className="text-xs text-amber-700 mt-0.5">
                  {locker.notes || 'Interditado temporariamente para manutenção.'}
                </p>
              </div>
            )}
          </div>

          {/* Dados Físicos / Observações Gerais do Armário */}
          {locker.notes && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Observações do Armário
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                {locker.notes}
              </div>
            </div>
          )}

          {/* Histórico de Entregas & Devoluções Passadas */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-500" />
              Histórico de Devoluções Anteriores ({historyList.length})
            </h3>

            {historyList.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400">
                Nenhuma devolução anterior registrada para este armário.
              </div>
            ) : (
              <div className="space-y-2.5">
                {historyList.map((hist) => (
                  <div 
                    key={hist.id} 
                    className="bg-white border border-slate-200 rounded-xl p-3 text-xs shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {hist.companyName} • {hist.occupantName}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        Devolvido
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-slate-500 text-[11px]">
                      <span>Contato: <strong className="text-slate-700">{hist.contact || '-'}</strong></span>
                      <span>Entrega: <strong className="text-slate-700">{formatDateBR(hist.deliveryDate)}</strong></span>
                      <span>Devolução: <strong className="text-slate-700">{formatDateBR(hist.returnedDate)}</strong></span>
                    </div>

                    {hist.notes && (
                      <p className="text-slate-600 bg-slate-50 p-2 rounded-lg text-[11px] italic">
                        "{hist.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          {onDelete ? (
            <button
              type="button"
              id="btn-details-delete-locker"
              onClick={() => {
                onDelete(locker.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir Armário
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
