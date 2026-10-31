import React, { useState } from 'react';
import { 
  Tv, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { KitchenTicket } from '../../types/pos';
import { BusinessNicheConfig } from '../../types/business';

interface KDSScreenProps {
  tickets: KitchenTicket[];
  config: BusinessNicheConfig;
  onUpdateTicketStatus: (ticketId: string, status: KitchenTicket['status']) => void;
  onToggleItemDone: (ticketId: string, itemIdx: number) => void;
}

export const KDSScreen: React.FC<KDSScreenProps> = ({
  tickets,
  config,
  onUpdateTicketStatus,
  onToggleItemDone,
}) => {
  const [selectedStation, setSelectedStation] = useState<string>('ALL');

  const stations = ['ALL', 'Grelha', 'Fornos', 'Bar'];

  const filteredTickets = tickets.filter(
    (t) => selectedStation === 'ALL' || t.station === selectedStation
  );

  const getStatusBadge = (status: KitchenTicket['status']) => {
    switch (status) {
      case 'NOVO':
        return <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">NOVO PEDIDO</span>;
      case 'EM_PREPARO':
        return <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">EM PREPARO</span>;
      case 'PRONTO':
        return <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold">PRONTO P/ SERVIR</span>;
      case 'ENTREGUE':
        return <span className="bg-slate-400 text-white px-2 py-0.5 rounded text-[10px] font-bold">ENTREGUE</span>;
    }
  };

  const getNextStatus = (current: KitchenTicket['status']): KitchenTicket['status'] => {
    switch (current) {
      case 'NOVO':
        return 'EM_PREPARO';
      case 'EM_PREPARO':
        return 'PRONTO';
      case 'PRONTO':
        return 'ENTREGUE';
      case 'ENTREGUE':
        return 'ENTREGUE';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <Tv size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold">KDS - Kitchen Display System (Ecrã da Cozinha)</h2>
            <p className="text-xs text-slate-400">
              Controlo de produção e pedidos em tempo real por praça / estação de trabalho.
            </p>
          </div>
        </div>

        {/* Station Filters */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <span className="text-slate-400 px-2 text-[10px] uppercase">Estação:</span>
          {stations.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStation(st)}
              className={`px-3 py-1 rounded-lg transition ${
                selectedStation === st
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'Todas as Praças' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTickets.map((ticket) => {
          const isFinished = ticket.status === 'ENTREGUE';

          return (
            <div
              key={ticket.id}
              className={`rounded-2xl border-2 flex flex-col justify-between overflow-hidden shadow-xs transition ${
                ticket.status === 'NOVO'
                  ? 'border-rose-400 bg-white'
                  : ticket.status === 'EM_PREPARO'
                  ? 'border-amber-400 bg-white'
                  : ticket.status === 'PRONTO'
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              {/* Ticket Header */}
              <div className="p-3.5 bg-slate-900 text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-amber-400">
                    {ticket.tableNumber || 'Balcão Express'}
                  </span>
                  {getStatusBadge(ticket.status)}
                </div>

                <div className="flex justify-between text-xs text-slate-400">
                  <span>Senha: {ticket.orderNumber}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {ticket.openedAt}
                  </span>
                </div>
              </div>

              {/* Ticket Items Checklist */}
              <div className="p-4 space-y-2 flex-1">
                {ticket.station && (
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block">
                    Praça: {ticket.station}
                  </span>
                )}

                <div className="space-y-2 pt-1">
                  {ticket.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onToggleItemDone(ticket.id, idx)}
                      className={`p-2 rounded-xl border text-xs cursor-pointer select-none transition flex items-start gap-2 ${
                        item.completed
                          ? 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                          : 'bg-white border-slate-200 text-slate-900 hover:border-amber-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-bold text-sm leading-tight">{item.name}</div>
                        {item.notes && (
                          <div className="text-[11px] text-rose-600 italic mt-0.5 font-medium">
                            ⚠️ {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advance Status Button */}
              {!isFinished && (
                <div className="p-3 bg-slate-50 border-t border-slate-200">
                  <button
                    onClick={() => onUpdateTicketStatus(ticket.id, getNextStatus(ticket.status))}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Avançar Estado ({getNextStatus(ticket.status)})</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
