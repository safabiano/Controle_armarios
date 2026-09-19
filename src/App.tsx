import React, { useState, useEffect, useMemo } from 'react';
import { Locker, FilterStatus, FilterVestiario, ViewMode, AllocationHistoryItem } from './types';
import { loadLockersFromStorage, saveLockersToStorage } from './utils/lockerUtils';
import { INITIAL_LOCKERS } from './data/initialLockers';
import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { FilterBar } from './components/FilterBar';
import { LockerCard } from './components/LockerCard';
import { LockerTableView } from './components/LockerTableView';
import { AssignLockerModal } from './components/AssignLockerModal';
import { ReturnLockerModal } from './components/ReturnLockerModal';
import { LockerModal } from './components/LockerModal';
import { LockerDetailsModal } from './components/LockerDetailsModal';
import { DeliveryReceiptModal } from './components/DeliveryReceiptModal';
import { Plus, ShieldCheck } from 'lucide-react';

export default function App() {
  const [lockers, setLockers] = useState<Locker[]>(() => loadLockersFromStorage());
  const [filterVestiario, setFilterVestiario] = useState<FilterVestiario>('TODOS');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');

  // Modal states
  const [assignModalLocker, setAssignModalLocker] = useState<Locker | null>(null);
  const [returnModalLocker, setReturnModalLocker] = useState<Locker | null>(null);
  const [editModalLocker, setEditModalLocker] = useState<Locker | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [detailsModalLocker, setDetailsModalLocker] = useState<Locker | null>(null);
  const [receiptModalLocker, setReceiptModalLocker] = useState<Locker | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveLockersToStorage(lockers);
  }, [lockers]);

  // Existing companies list for autocomplete in assignment form
  const existingCompanies = useMemo(() => {
    const set = new Set<string>();
    lockers.forEach((l) => {
      if (l.currentAllocation?.companyName) set.add(l.currentAllocation.companyName);
      l.history?.forEach((h) => {
        if (h.companyName) set.add(h.companyName);
      });
    });
    return Array.from(set).sort();
  }, [lockers]);

  // Filtering logic
  const filteredLockers = useMemo(() => {
    return lockers.filter((l) => {
      // Vestiário filter
      if (filterVestiario !== 'TODOS' && l.vestiario !== filterVestiario) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'TODOS' && l.status !== filterStatus) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const num = String(l.number).toLowerCase();
        const comp = (l.currentAllocation?.companyName || '').toLowerCase();
        const occ = (l.currentAllocation?.occupantName || '').toLowerCase();
        const contact = (l.currentAllocation?.contact || '').toLowerCase();
        const notes = (l.currentAllocation?.notes || l.notes || '').toLowerCase();
        const loc = (l.location || '').toLowerCase();

        return (
          num.includes(query) ||
          comp.includes(query) ||
          occ.includes(query) ||
          contact.includes(query) ||
          notes.includes(query) ||
          loc.includes(query)
        );
      }

      return true;
    });
  }, [lockers, filterVestiario, filterStatus, searchQuery]);

  // Action handlers
  const handleAssignConfirm = (lockerId: string, allocation: AllocationHistoryItem) => {
    setLockers((prev) =>
      prev.map((l) => {
        if (l.id === lockerId) {
          return {
            ...l,
            status: 'OCUPADO',
            currentAllocation: allocation,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    );
  };

  const handleReturnConfirm = (lockerId: string, returnedDate: string, returnNotes: string) => {
    setLockers((prev) =>
      prev.map((l) => {
        if (l.id === lockerId && l.currentAllocation) {
          const finishedAlloc: AllocationHistoryItem = {
            ...l.currentAllocation,
            returnedDate,
            notes: returnNotes ? `${l.currentAllocation.notes ? l.currentAllocation.notes + ' | ' : ''}Devolução: ${returnNotes}` : l.currentAllocation.notes,
            isActive: false,
          };

          return {
            ...l,
            status: 'DISPONIVEL',
            currentAllocation: null,
            history: [finishedAlloc, ...(l.history || [])],
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      })
    );
  };

  const handleSaveLocker = (data: Partial<Locker>) => {
    if (editModalLocker) {
      // Edit existing
      setLockers((prev) =>
        prev.map((l) => {
          if (l.id === editModalLocker.id) {
            return {
              ...l,
              ...data,
              updatedAt: new Date().toISOString(),
            };
          }
          return l;
        })
      );
    } else {
      // Create new
      const newLocker: Locker = {
        id: `locker-${Date.now()}`,
        number: data.number || '00',
        vestiario: data.vestiario || 'MASCULINO',
        status: data.status || 'DISPONIVEL',
        location: data.location,
        notes: data.notes,
        currentAllocation: null,
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLockers((prev) => [newLocker, ...prev]);
    }
  };

  const handleDeleteLocker = (lockerId: string) => {
    const l = lockers.find((item) => item.id === lockerId);
    if (!l) return;
    if (l.status === 'OCUPADO') {
      alert('Não é possível excluir um armário ocupado. Registre a devolução antes de excluir.');
      return;
    }
    if (window.confirm(`Tem certeza de que deseja excluir o armário ${l.number}?`)) {
      setLockers((prev) => prev.filter((item) => item.id !== lockerId));
    }
  };

  const handleResetData = () => {
    if (window.confirm('Deseja reiniciar a base com os armários e cadastros de exemplo originais?')) {
      setLockers(INITIAL_LOCKERS);
    }
  };

  const handleImportData = (imported: Locker[]) => {
    setLockers(imported);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Navigation / App Header */}
      <Header
        lockers={lockers}
        onAddNewLocker={() => {
          setEditModalLocker(null);
          setIsCreateModalOpen(true);
        }}
        onResetData={handleResetData}
        onImportData={handleImportData}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Statistics Dashboard */}
        <StatCards lockers={lockers} />

        {/* Filter and Search Bar */}
        <FilterBar
          filterVestiario={filterVestiario}
          onFilterVestiarioChange={setFilterVestiario}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFiltered={filteredLockers.length}
        />

        {/* Lockers Render: Grid View vs Table View */}
        {filteredLockers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Nenhum armário encontrado
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Nenhum armário corresponde aos filtros de vestiário, status ou termo de pesquisa pesquisado.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFilterVestiario('TODOS');
                  setFilterStatus('TODOS');
                  setSearchQuery('');
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditModalLocker(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Cadastrar Armário
              </button>
            </div>
          </div>
        ) : viewMode === 'GRID' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredLockers.map((locker) => (
              <LockerCard
                key={locker.id}
                locker={locker}
                onAssign={(l) => setAssignModalLocker(l)}
                onReturn={(l) => setReturnModalLocker(l)}
                onEdit={(l) => {
                  setEditModalLocker(l);
                  setIsCreateModalOpen(true);
                }}
                onViewDetails={(l) => setDetailsModalLocker(l)}
                onPrintReceipt={(l) => setReceiptModalLocker(l)}
                onDelete={handleDeleteLocker}
              />
            ))}
          </div>
        ) : (
          <LockerTableView
            lockers={filteredLockers}
            onAssign={(l) => setAssignModalLocker(l)}
            onReturn={(l) => setReturnModalLocker(l)}
            onEdit={(l) => {
              setEditModalLocker(l);
              setIsCreateModalOpen(true);
            }}
            onViewDetails={(l) => setDetailsModalLocker(l)}
            onPrintReceipt={(l) => setReceiptModalLocker(l)}
            onDelete={handleDeleteLocker}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>
            Sistema de Cadastro e Controle de Armários de Vestiário • Masculino & Feminino
          </p>
          <div className="flex items-center gap-4">
            <span>Armazenamento local persistido</span>
            <span>•</span>
            <span>Relatórios em CSV</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Assign Modal */}
      <AssignLockerModal
        isOpen={!!assignModalLocker}
        locker={assignModalLocker}
        onClose={() => setAssignModalLocker(null)}
        onConfirm={handleAssignConfirm}
        existingCompanies={existingCompanies}
      />

      {/* 2. Return Modal */}
      <ReturnLockerModal
        isOpen={!!returnModalLocker}
        locker={returnModalLocker}
        onClose={() => setReturnModalLocker(null)}
        onConfirmReturn={handleReturnConfirm}
      />

      {/* 3. Create or Edit Locker Modal */}
      <LockerModal
        isOpen={isCreateModalOpen}
        lockerToEdit={editModalLocker}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditModalLocker(null);
        }}
        onSave={handleSaveLocker}
      />

      {/* 4. Locker Details & History Modal */}
      <LockerDetailsModal
        isOpen={!!detailsModalLocker}
        locker={detailsModalLocker}
        onClose={() => setDetailsModalLocker(null)}
        onAssign={(l) => setAssignModalLocker(l)}
        onReturn={(l) => setReturnModalLocker(l)}
        onPrintReceipt={(l) => setReceiptModalLocker(l)}
      />

      {/* 5. Delivery Receipt / Termo Modal (Printable) */}
      <DeliveryReceiptModal
        isOpen={!!receiptModalLocker}
        locker={receiptModalLocker}
        onClose={() => setReceiptModalLocker(null)}
      />

    </div>
  );
}
