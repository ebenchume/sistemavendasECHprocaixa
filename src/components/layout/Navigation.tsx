import React from 'react';
import { 
  CreditCard, 
  Package, 
  Users, 
  UtensilsCrossed, 
  Tv, 
  SlidersHorizontal, 
  FileCode2,
  AlertCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { BusinessNicheConfig } from '../../types/business';

export type ActiveTab = 'pos' | 'dashboard' | 'stock' | 'customers' | 'users' | 'tables' | 'kds' | 'config' | 'architecture';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  config: BusinessNicheConfig;
  cartCount: number;
  lowStockCount: number;
  activeTablesCount: number;
  kdsTicketsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  config,
  cartCount,
  lowStockCount,
  activeTablesCount,
  kdsTicketsCount,
}) => {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {/* 1. Frente de Caixa (POS) */}
          <button
            onClick={() => onTabChange('pos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'pos'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard size={17} className={activeTab === 'pos' ? 'text-emerald-400' : 'text-slate-500'} />
            <span>Frente de Caixa (POS)</span>
            {cartCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-emerald-500 text-white font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* 2. Dashboard Analytics (Recharts) */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp size={17} className={activeTab === 'dashboard' ? 'text-indigo-400' : 'text-indigo-600'} />
            <span>Dashboard & Gráficos</span>
          </button>

          {/* 3. Stock & Lotes */}
          <button
            onClick={() => onTabChange('stock')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'stock'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package size={17} className={activeTab === 'stock' ? 'text-emerald-400' : 'text-slate-500'} />
            <span>Stock & Lotes</span>
            {lowStockCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-xs font-bold" title="Produtos com stock baixo ou lotes a expirar">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* 4. Clientes & Fiado */}
          <button
            onClick={() => onTabChange('customers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'customers'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users size={17} className={activeTab === 'customers' ? 'text-emerald-400' : 'text-slate-500'} />
            <span>Clientes & Fiado</span>
          </button>

          {/* 5. Utilizadores & Permissões */}
          <button
            onClick={() => onTabChange('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck size={17} className={activeTab === 'users' ? 'text-purple-400' : 'text-purple-600'} />
            <span>Utilizadores & Perfis</span>
          </button>

          {/* 4. Mesas (Se restaurante ou flag ativa) */}
          {config.flags.enableTablesAndOrders && (
            <button
              onClick={() => onTabChange('tables')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'tables'
                  ? 'bg-rose-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-rose-900 hover:bg-rose-50'
              }`}
            >
              <UtensilsCrossed size={17} className={activeTab === 'tables' ? 'text-rose-300' : 'text-rose-600'} />
              <span>Mapa de Mesas</span>
              {activeTablesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-xs font-bold">
                  {activeTablesCount}
                </span>
              )}
            </button>
          )}

          {/* 5. KDS Cozinha (Se flag de KDS ativa) */}
          {config.flags.enableKitchenDisplay && (
            <button
              onClick={() => onTabChange('kds')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'kds'
                  ? 'bg-amber-900 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              <Tv size={17} className={activeTab === 'kds' ? 'text-amber-300' : 'text-amber-600'} />
              <span>KDS Cozinha</span>
              {kdsTicketsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse">
                  {kdsTicketsCount}
                </span>
              )}
            </button>
          )}

          {/* 6. Configurações de Nicho & Flags */}
          <button
            onClick={() => onTabChange('config')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'config'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal size={17} className={activeTab === 'config' ? 'text-emerald-400' : 'text-slate-500'} />
            <span>Nicho & Feature Flags</span>
          </button>

          {/* 7. Arquitetura & SQL */}
          <button
            onClick={() => onTabChange('architecture')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'architecture'
                ? 'bg-indigo-950 text-white shadow-xs font-semibold'
                : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50'
            }`}
          >
            <FileCode2 size={17} className={activeTab === 'architecture' ? 'text-indigo-300' : 'text-indigo-600'} />
            <span>Desenho Arquitetural & SQL</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
