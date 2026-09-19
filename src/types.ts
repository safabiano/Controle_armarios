export type VestiarioType = 'MASCULINO' | 'FEMININO';

export type LockerStatus = 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO';

export interface AllocationHistoryItem {
  id: string;
  companyName: string;         // Nome da empresa
  occupantName: string;        // Nome do colaborador / titular
  contact: string;             // Contato (telefone / celular / ramal)
  deliveryDate: string;        // Data de entrega (YYYY-MM-DD)
  expectedReturnDate?: string; // Data prevista de devolução
  returnedDate?: string;       // Data efetiva de devolução (quando devolvido)
  notes?: string;              // Campo observação
  lockerNumber: string;        // Número do armário no momento
  vestiario: VestiarioType;    // Masculino ou Feminino
  keyOrPadlockTag?: string;    // Identificação de chave/cadeado
  isActive: boolean;           // True se ainda estiver com o armário
}

export interface Locker {
  id: string;
  number: string;              // Número do armário (ex: "01", "A-12", "M-05")
  vestiario: VestiarioType;    // Vestiário Masculino ou Feminino
  status: LockerStatus;        // Disponível ou Ocupado ou Manutenção
  location?: string;           // Localização/Setor (ex: Corredor A, Parede Norte)
  notes?: string;              // Observações gerais do armário (estrutura, chave reserva, etc)
  currentAllocation?: AllocationHistoryItem | null;
  history: AllocationHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export type FilterStatus = 'TODOS' | 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO';
export type FilterVestiario = 'TODOS' | 'MASCULINO' | 'FEMININO';
export type ViewMode = 'GRID' | 'TABLE';
