import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  Key, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Locker, AllocationHistoryItem } from '../types';
import { getTodayDateString } from '../utils/lockerUtils';

interface AssignLockerModalProps {
  isOpen: boolean;
  locker: Locker | null;
  onClose: () => void;
  onConfirm: (lockerId: string, allocation: AllocationHistoryItem) => void;
  existingCompanies: string[];
}

export const AssignLockerModal: React.FC<AssignLockerModalProps> = ({
  isOpen,
  locker,
  onClose,
  onConfirm,
  existingCompanies
}) => {
  const [companyName, setCompanyName] = useState('');
  const [occupantName, setOccupantName] = useState('');
  const [contact, setContact] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(getTodayDateString());
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [keyOrPadlockTag, setKeyOrPadlockTag] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (locker) {
      setCompanyName('');
      setOccupantName('');
      setContact('');
      setDeliveryDate(getTodayDateString());
      setExpectedReturnDate('');
      setKeyOrPadlockTag(`CH-${locker.number}`);
      setNotes('');
      setError('');
    }
  }, [locker]);

  if (!isOpen || !locker) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError('Por favor, informe o nome da empresa.');
      return;
    }
    if (!occupantName.trim()) {
      setError('Por favor, informe o nome do colaborador/titular.');
      return;
    }
    if (!deliveryDate) {
      setError('Por favor, selecione a data de entrega.');
      return;
    }

    const newAllocation: AllocationHistoryItem = {
      id: `alloc-${Date.now()}`,
      companyName: companyName.trim(),
      occupantName: occupantName.trim(),
      contact: contact.trim(),
      deliveryDate,
      expectedReturnDate: expectedReturnDate ? expectedReturnDate : undefined,
      keyOrPadlockTag: keyOrPadlockTag.trim() || undefined,
      notes: notes.trim() || undefined,
      lockerNumber: locker.number,
      vestiario: locker.vestiario,
      isActive: true,
    };

    onConfirm(locker.id, newAllocation);
    onClose();
  };

  const isMale = locker.vestiario === 'MASCULINO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm">
              {locker.number}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Atribuir Armário {locker.number}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nome da Empresa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Nome da Empresa *
            </label>
            <input
              id="input-company-name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: PetroSul Engenharia, Alpha Logística..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              list="companies-list"
            />
            {existingCompanies.length > 0 && (
              <datalist id="companies-list">
                {existingCompanies.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            )}
          </div>

          {/* Nome do Colaborador & Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Nome do Colaborador / Titular *
              </label>
              <input
                id="input-occupant-name"
                type="text"
                required
                value={occupantName}
                onChange={(e) => setOccupantName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Contato (Tel / WhatsApp / Ramal)
              </label>
              <input
                id="input-contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="(11) 99999-8888 ou Ramal 104"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
            </div>
          </div>

          {/* Datas: Entrega e Previsão de Devolução */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Data de Entrega *
              </label>
              <input
                id="input-delivery-date"
                type="date"
                required
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                Data Prevista de Devolução
              </label>
              <input
                id="input-expected-return-date"
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Deixe em branco se for indeterminado
              </span>
            </div>
          </div>

          {/* Tag de Chave ou Cadeado */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-500" />
              Identificação da Chave / Cadeado
            </label>
            <input
              id="input-key-tag"
              type="text"
              value={keyOrPadlockTag}
              onChange={(e) => setKeyOrPadlockTag(e.target.value)}
              placeholder="Ex: Chave nº 12 ou Cadeado Segredo 4 dígitos"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>

          {/* Campo Observação */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Campo Observação
            </label>
            <textarea
              id="textarea-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre a entrega, autorizações especiais, estado de conservação do armário, número de cópias de chave entregues..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 resize-none"
            />
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
              id="btn-confirm-assignment"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Confirmar Entrega
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
