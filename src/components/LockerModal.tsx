import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Locker, LockerStatus, VestiarioType } from '../types';

interface LockerModalProps {
  isOpen: boolean;
  lockerToEdit: Locker | null;
  onClose: () => void;
  onSave: (lockerData: Partial<Locker>) => void;
  onDelete?: (lockerId: string) => void;
}

export const LockerModal: React.FC<LockerModalProps> = ({
  isOpen,
  lockerToEdit,
  onClose,
  onSave,
  onDelete
}) => {
  const [number, setNumber] = useState('');
  const [vestiario, setVestiario] = useState<VestiarioType>('MASCULINO');
  const [status, setStatus] = useState<LockerStatus>('DISPONIVEL');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const isEditing = !!lockerToEdit;

  useEffect(() => {
    if (lockerToEdit) {
      setNumber(lockerToEdit.number);
      setVestiario(lockerToEdit.vestiario);
      setStatus(lockerToEdit.status);
      setLocation(lockerToEdit.location || '');
      setNotes(lockerToEdit.notes || '');
      setError('');
    } else {
      setNumber('');
      setVestiario('MASCULINO');
      setStatus('DISPONIVEL');
      setLocation('Ala Central');
      setNotes('');
      setError('');
    }
  }, [lockerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) {
      setError('Por favor, informe o número ou identificador do armário.');
      return;
    }

    onSave({
      number: number.trim(),
      vestiario,
      status,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `Editar Armário ${lockerToEdit.number}` : 'Cadastrar Novo Armário'}
              </h2>
              <p className="text-xs text-slate-500">
                Informações físicas e vestiário correspondente
              </p>
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

          {/* Número do Armário */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Número do Armário *
            </label>
            <input
              id="input-locker-number"
              type="text"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Ex: 01, M-10, F-04, 205..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 font-mono font-semibold"
            />
          </div>

          {/* Vestiário (Masculino vs Feminino) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vestiário *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-select-vestiario-masc"
                onClick={() => setVestiario('MASCULINO')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  vestiario === 'MASCULINO'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🚹</span>
                Masculino
              </button>

              <button
                type="button"
                id="btn-select-vestiario-fem"
                onClick={() => setVestiario('FEMININO')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  vestiario === 'FEMININO'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>🚺</span>
                Feminino
              </button>
            </div>
          </div>

          {/* Status (se for novo ou se estiver editando) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status Inicial / Atual
            </label>
            <select
              id="select-locker-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as LockerStatus)}
              disabled={isEditing && lockerToEdit.status === 'OCUPADO'}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
            >
              <option value="DISPONIVEL">Disponível</option>
              <option value="OCUPADO">Ocupado (Atribuído)</option>
              <option value="MANUTENCAO">Em Manutenção / Interditado</option>
            </select>
            {isEditing && lockerToEdit.status === 'OCUPADO' && (
              <span className="text-[10px] text-slate-400 mt-1 block">
                Para liberar um armário ocupado, utilize a ação "Devolver".
              </span>
            )}
          </div>

          {/* Localização / Setor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Localização / Setor
            </label>
            <input
              id="input-locker-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Ala Norte - Bloco A, Corredor 2..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>

          {/* Observações do Armário */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Observações do Armário
            </label>
            <textarea
              id="textarea-locker-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Chave mestra na recepção, prateleira interna dupla, fechadura nova..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            {isEditing && onDelete && (
              <button
                type="button"
                id="btn-modal-delete-locker"
                onClick={() => {
                  onDelete(lockerToEdit.id);
                  onClose();
                }}
                className="mr-auto inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir Armário
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-save-locker"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Armário'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
