import React, { useState, useEffect } from 'react';
import { 
  X, 
  Undo2, 
  Building2, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Locker } from '../types';
import { formatDateBR, getTodayDateString } from '../utils/lockerUtils';

interface ReturnLockerModalProps {
  isOpen: boolean;
  locker: Locker | null;
  onClose: () => void;
  onConfirmReturn: (lockerId: string, returnedDate: string, returnNotes: string) => void;
}

export const ReturnLockerModal: React.FC<ReturnLockerModalProps> = ({
  isOpen,
  locker,
  onClose,
  onConfirmReturn
}) => {
  const [returnedDate, setReturnedDate] = useState(getTodayDateString());
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    if (locker) {
      setReturnedDate(getTodayDateString());
      setReturnNotes('Chave devolvida e armário higienizado para o próximo colaborador.');
    }
  }, [locker]);

  if (!isOpen || !locker || !locker.currentAllocation) return null;

  const alloc = locker.currentAllocation;
  const isMale = locker.vestiario === 'MASCULINO';

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReturn(locker.id, returnedDate, returnNotes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              {locker.number}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Undo2 className="w-4 h-4 text-sky-600" />
                Registrar Devolução do Armário
              </h2>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                isMale 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {isMale ? '🚹 Vestiário Masculino' : '🚺 Vestiário Feminino'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          
          {/* Current Occupant Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Dados da Alocação Atual
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Empresa</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {alloc.companyName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Colaborador</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {alloc.occupantName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/60">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contato</span>
                <span className="text-slate-700 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {alloc.contact || 'Não informado'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Data de Entrega</span>
                <span className="text-slate-700 font-semibold flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formatDateBR(alloc.deliveryDate)}
                </span>
              </div>
            </div>

            {alloc.notes && (
              <div className="pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Obs da Entrega:</span> {alloc.notes}
              </div>
            )}
          </div>

          {/* Data de Devolução Efetiva */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              Data Efetiva de Devolução *
            </label>
            <input
              id="input-return-date"
              type="date"
              required
              value={returnedDate}
              onChange={(e) => setReturnedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-900/10 focus:border-sky-700"
            />
          </div>

          {/* Observações da Devolução */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Observações da Devolução
            </label>
            <textarea
              id="textarea-return-notes"
              rows={3}
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Estado de devolução das chaves, cadeado, limpeza do armário, eventuais avarias ou encerramento do contrato..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-900/10 focus:border-sky-700 resize-none"
            />
          </div>

          {/* Informative notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Ao confirmar a devolução, o armário <strong>{locker.number}</strong> passará imediatamente para o status <strong>Disponível</strong> e este registro será guardado no histórico de utilização.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-confirm-return"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Confirmar Devolução & Liberar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
