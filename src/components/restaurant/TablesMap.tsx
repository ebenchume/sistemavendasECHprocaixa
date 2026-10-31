import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Users, 
  Clock, 
  DollarSign, 
  Check, 
  Receipt, 
  Divide, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import { RestaurantTable, CartItem } from '../../types/pos';
import { BusinessNicheConfig } from '../../types/business';

interface TablesMapProps {
  tables: RestaurantTable[];
  config: BusinessNicheConfig;
  onSelectTableForPOS: (table: RestaurantTable) => void;
  onUpdateTableStatus: (tableId: string, status: RestaurantTable['status']) => void;
  onReleaseTable: (tableId: string) => void;
}

export const TablesMap: React.FC<TablesMapProps> = ({
  tables,
  config,
  onSelectTableForPOS,
  onUpdateTableStatus,
  onReleaseTable,
}) => {
  const [splitModalTable, setSplitModalTable] = useState<RestaurantTable | null>(null);
  const [splitPeopleCount, setSplitPeopleCount] = useState<number>(2);

  const getStatusColor = (status: RestaurantTable['status']) => {
    switch (status) {
      case 'LIVRE':
        return 'border-emerald-500 bg-emerald-50 text-emerald-900';
      case 'OCUPADA':
        return 'border-rose-500 bg-rose-50 text-rose-900';
      case 'CONTA_SOLICITADA':
        return 'border-amber-500 bg-amber-50 text-amber-900 animate-pulse';
      case 'RESERVADA':
        return 'border-purple-500 bg-purple-50 text-purple-900';
      default:
        return 'border-slate-200 bg-white text-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
              RESTAURAÇÃO & BARES
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Mapa Visual de Mesas & Comandas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de salão em tempo real, pedidos por comanda, taxa de serviço de 10% e divisão de conta.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Livre
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Ocupada
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Conta Solicitada
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Reservada
          </span>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => {
          const tableTotal = table.items.reduce((sum, item) => sum + item.total, 0);
          const serviceFee = tableTotal * 0.10;
          const grandTotal = tableTotal + serviceFee;

          return (
            <div
              key={table.id}
              className={`border-2 rounded-2xl p-4 shadow-xs transition flex flex-col justify-between ${getStatusColor(
                table.status
              )}`}
            >
              {/* Table Top */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-lg">{table.tableNumber}</h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                    {table.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 mb-3">
                  <p className="flex items-center gap-1 text-slate-700">
                    <Users size={13} /> Capacidade: {table.capacity} lugares {table.customerCount ? `(${table.customerCount} ocupantes)` : ''}
                  </p>
                  {table.activeComandaNumber && (
                    <p className="font-mono font-bold text-slate-800">
                      Comanda: {table.activeComandaNumber}
                    </p>
                  )}
                  {table.waiterName && (
                    <p className="text-[11px] text-slate-600">Garçom: {table.waiterName}</p>
                  )}
                  {table.openedAt && (
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock size={11} /> Aberta às {table.openedAt}
                    </p>
                  )}
                </div>

                {/* Items Summary */}
                {table.items.length > 0 && (
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 mb-3">
                    <div className="font-bold text-slate-800 text-[11px] border-b border-slate-100 pb-1 flex justify-between">
                      <span>Consumo ({table.items.length} itens)</span>
                      <span>Total: {grandTotal.toLocaleString()} {config.currency}</span>
                    </div>
                    <div className="space-y-0.5 max-h-24 overflow-y-auto">
                      {table.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[10px]">
                          <span>{it.quantity}x {it.name.length > 18 ? it.name.substring(0, 18) + '...' : it.name}</span>
                          <span className="font-mono font-semibold">{it.total} {config.currency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5 justify-end">
                {table.status === 'LIVRE' ? (
                  <button
                    onClick={() => onSelectTableForPOS(table)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Plus size={14} /> Abrir Mesa / Lançar Itens
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectTableForPOS(table)}
                      className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                    >
                      Ver / Lançar no POS
                    </button>

                    <button
                      onClick={() => setSplitModalTable(table)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition flex items-center gap-1"
                      title="Divisão de Conta por Pessoas"
                    >
                      <Divide size={13} />
                      Dividir Conta
                    </button>

                    {table.status === 'OCUPADA' && (
                      <button
                        onClick={() => onUpdateTableStatus(table.id, 'CONTA_SOLICITADA')}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition"
                        title="Pedir Conta"
                      >
                        Conta
                      </button>
                    )}

                    <button
                      onClick={() => onReleaseTable(table.id)}
                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition"
                      title="Libertar Mesa"
                    >
                      Libertar
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bill Splitting Modal */}
      {splitModalTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-rose-600">Divisão de Conta</span>
                <h3 className="font-bold text-base text-slate-900">{splitModalTable.name}</h3>
              </div>
              <button onClick={() => setSplitModalTable(null)} className="text-slate-400 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            {(() => {
              const subtotal = splitModalTable.items.reduce((sum, item) => sum + item.total, 0);
              const fee = subtotal * 0.10;
              const total = subtotal + fee;
              const perPerson = Math.ceil((total / splitPeopleCount) * 100) / 100;

              return (
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Consumido:</span>
                      <span className="font-mono font-bold">{subtotal.toLocaleString()} {config.currency}</span>
                    </div>
                    <div className="flex justify-between text-rose-700">
                      <span>Taxa de Serviço (10%):</span>
                      <span className="font-mono font-bold">+{fee.toLocaleString()} {config.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black border-t border-slate-200 pt-1 text-slate-900">
                      <span>TOTAL DA MESA:</span>
                      <span>{total.toLocaleString()} {config.currency}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dividir entre quantas pessoas?
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSplitPeopleCount((p) => Math.max(1, p - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-lg flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-xl">{splitPeopleCount} pessoas</span>
                      <button
                        type="button"
                        onClick={() => setSplitPeopleCount((p) => p + 1)}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-lg flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                      Valor por Pessoa:
                    </span>
                    <span className="text-2xl font-black text-emerald-700">
                      {perPerson.toLocaleString()} {config.currency}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setSplitModalTable(null)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
