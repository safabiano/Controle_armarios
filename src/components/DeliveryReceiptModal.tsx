import React from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  Lock, 
  Calendar, 
  Phone, 
  User, 
  FileText,
  Key
} from 'lucide-react';
import { Locker } from '../types';
import { formatDateBR } from '../utils/lockerUtils';

interface DeliveryReceiptModalProps {
  isOpen: boolean;
  locker: Locker | null;
  onClose: () => void;
}

export const DeliveryReceiptModal: React.FC<DeliveryReceiptModalProps> = ({
  isOpen,
  locker,
  onClose
}) => {
  if (!isOpen || !locker || !locker.currentAllocation) return null;

  const alloc = locker.currentAllocation;
  const isMale = locker.vestiario === 'MASCULINO';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar (Screen only) */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <span className="text-xs font-semibold text-slate-700">
            Visualização de Impressão • Termo de Entrega de Armário
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-trigger-print"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Content */}
        <div className="p-8 font-sans text-slate-800 space-y-6 print:p-0">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                Termo de Responsabilidade e Entrega de Armário
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Controle Patrimonial de Vestiários • Gestão de Armários da Empresa
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-base rounded-md">
                Armário {locker.number}
              </span>
              <span className="block text-[11px] font-semibold text-slate-600 mt-1">
                {isMale ? 'Vestiário Masculino' : 'Vestiário Feminino'}
              </span>
            </div>
          </div>

          {/* Identification Details Grid */}
          <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/50 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Empresa</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">
                {alloc.companyName}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Colaborador / Titular</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">
                {alloc.occupantName}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contato (Tel / Ramal)</span>
              <span className="font-mono text-slate-800 text-xs block mt-0.5">
                {alloc.contact || 'Não informado'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Identificação da Chave/Cadeado</span>
              <span className="font-semibold text-slate-800 text-xs block mt-0.5">
                {alloc.keyOrPadlockTag || `Chave nº ${locker.number}`}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Data de Entrega</span>
              <span className="font-bold text-slate-900 text-xs block mt-0.5">
                {formatDateBR(alloc.deliveryDate)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Data Prevista de Devolução</span>
              <span className="font-bold text-slate-900 text-xs block mt-0.5">
                {alloc.expectedReturnDate ? formatDateBR(alloc.expectedReturnDate) : 'Vigência do contrato de trabalho'}
              </span>
            </div>
          </div>

          {/* Observações */}
          {alloc.notes && (
            <div className="border border-slate-200 rounded-xl p-3 text-xs bg-white">
              <span className="font-bold text-slate-800 block text-[11px] uppercase mb-1">
                Observações Específicas:
              </span>
              <p className="text-slate-600">{alloc.notes}</p>
            </div>
          )}

          {/* Terms & Conditions Statement */}
          <div className="text-[11px] text-slate-600 space-y-2 leading-relaxed border-t border-slate-200 pt-4">
            <p className="font-semibold text-slate-800">
              Cláusulas e Normas de Utilização do Vestiário:
            </p>
            <p>
              1. O armário identificado acima é concedido exclusivamente para uso pessoal do colaborador durante a jornada de trabalho, destinado à guarda de uniformes, vestuário civil e calçados autorizados.
            </p>
            <p>
              2. É expressamente proibida a guarda de substâncias inflamáveis, perecíveis, ilícitas ou materiais de risco à segurança coletiva.
            </p>
            <p>
              3. O colaborador se compromete a zelar pelo bom estado de conservação do armário, fechadura e chave(s) sob sua custódia, responsabilizando-se pela reposição em caso de extravio culposo.
            </p>
            <p>
              4. Na rescisão contratual ou transferência de setor, o armário deverá ser integralmente desocupado, limpo e a chave devolvida ao setor competente na <strong>Data de Devolução</strong> estipulada.
            </p>
          </div>

          {/* Signatures Section */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-1">
              <div className="border-t border-slate-800 pt-2 font-semibold text-slate-900">
                {alloc.occupantName}
              </div>
              <span className="text-[10px] text-slate-500 block">
                Assinatura do Colaborador (Recebimento)
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                CPF / Matrícula: __________________
              </span>
            </div>

            <div className="space-y-1">
              <div className="border-t border-slate-800 pt-2 font-semibold text-slate-900">
                Responsável / Administração do Vestiário
              </div>
              <span className="text-[10px] text-slate-500 block">
                {alloc.companyName}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Data: {formatDateBR(alloc.deliveryDate)}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
