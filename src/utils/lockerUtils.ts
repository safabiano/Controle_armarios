import { Locker, AllocationHistoryItem } from '../types';
import { INITIAL_LOCKERS } from '../data/initialLockers';

const STORAGE_KEY = 'vestiario_lockers_control_v1';

export function loadLockersFromStorage(): Locker[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Falha ao carregar armários do armazenamento local:', err);
  }
  // Se não existir, salva e retorna os dados iniciais
  saveLockersToStorage(INITIAL_LOCKERS);
  return INITIAL_LOCKERS;
}

export function saveLockersToStorage(lockers: Locker[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lockers));
  } catch (err) {
    console.error('Falha ao salvar armários no armazenamento local:', err);
  }
}

export function formatDateBR(dateString?: string | null): string {
  if (!dateString) return '-';
  // Check if string is in YYYY-MM-DD format
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateString;
}

export function getTodayDateString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function exportLockersToCSV(lockers: Locker[]): void {
  const headers = [
    'Número do Armário',
    'Vestiário',
    'Status',
    'Empresa',
    'Colaborador/Responsável',
    'Contato',
    'Data de Entrega',
    'Data de Devolução / Previsão',
    'Devolução Efetiva',
    'Tag / Chave',
    'Localização',
    'Observações'
  ];

  const rows = lockers.map((l) => {
    const cur = l.currentAllocation;
    const cleanStr = (val?: string) => `"${(val || '').replace(/"/g, '""')}"`;

    return [
      cleanStr(l.number),
      cleanStr(l.vestiario),
      cleanStr(l.status),
      cleanStr(cur?.companyName || ''),
      cleanStr(cur?.occupantName || ''),
      cleanStr(cur?.contact || ''),
      cleanStr(cur?.deliveryDate ? formatDateBR(cur.deliveryDate) : ''),
      cleanStr(cur?.expectedReturnDate ? formatDateBR(cur.expectedReturnDate) : ''),
      cleanStr(cur?.returnedDate ? formatDateBR(cur.returnedDate) : ''),
      cleanStr(cur?.keyOrPadlockTag || ''),
      cleanStr(l.location || ''),
      cleanStr(cur?.notes || l.notes || '')
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `controle_armarios_vestiario_${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
