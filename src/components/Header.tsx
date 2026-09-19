import React, { useRef } from 'react';
import { 
  Building2, 
  Plus, 
  Download, 
  RotateCcw, 
  Upload,
  Lock
} from 'lucide-react';
import { Locker } from '../types';
import { exportLockersToCSV } from '../utils/lockerUtils';

interface HeaderProps {
  lockers: Locker[];
  onAddNewLocker: () => void;
  onResetData: () => void;
  onImportData: (lockers: Locker[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lockers,
  onAddNewLocker,
  onResetData,
  onImportData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lockers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_armarios_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportData(json);
          alert('Dados de armários restaurados com sucesso!');
        } else {
          alert('Arquivo inválido: o formato esperado é uma lista de armários.');
        }
      } catch (err) {
        alert('Erro ao processar arquivo JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Controle de Armários
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                  Vestiários
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Gestão de vestiário masculino & feminino • Entregas, empresas e devoluções
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              id="btn-export-csv"
              onClick={() => exportLockersToCSV(lockers)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Exportar planilha completa em formato CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Exportar CSV
            </button>

            <button
              type="button"
              id="btn-backup-json"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Baixar backup dos dados em JSON"
            >
              Backup
            </button>

            <label
              htmlFor="upload-backup-file"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Restaurar backup"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              Restaurar
              <input
                id="upload-backup-file"
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              id="btn-reset-data"
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
              title="Reiniciar com dados de exemplo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              id="btn-add-new-locker"
              onClick={onAddNewLocker}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Armário
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
