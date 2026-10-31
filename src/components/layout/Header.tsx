import React from 'react';
import { 
  ShoppingBag, 
  Stethoscope, 
  Sprout, 
  UtensilsCrossed, 
  Zap, 
  Store, 
  Layers, 
  CheckCircle2, 
  RotateCcw,
  Sliders,
  Code2,
  TrendingUp
} from 'lucide-react';
import { BusinessNiche, BusinessNicheConfig } from '../../types/business';
import { AppUser } from '../../types/user';

interface HeaderProps {
  currentNiche: BusinessNiche;
  nicheConfigs: Record<BusinessNiche, BusinessNicheConfig>;
  currentUser: AppUser;
  onSelectNiche: (niche: BusinessNiche) => void;
  onOpenDashboard: () => void;
  onOpenUsers: () => void;
  onOpenArchitecture: () => void;
  onOpenConfig: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentNiche,
  nicheConfigs,
  currentUser,
  onSelectNiche,
  onOpenDashboard,
  onOpenUsers,
  onOpenArchitecture,
  onOpenConfig,
  onResetData,
}) => {
  const activeConfig = nicheConfigs[currentNiche];

  const getNicheIcon = (niche: BusinessNiche, size = 18) => {
    switch (niche) {
      case 'retail':
        return <ShoppingBag size={size} />;
      case 'veterinary':
        return <Stethoscope size={size} />;
      case 'agriculture':
        return <Sprout size={size} />;
      case 'restaurant':
        return <UtensilsCrossed size={size} />;
      case 'kiosk':
        return <Zap size={size} />;
      default:
        return <Store size={size} />;
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Current Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-xl shadow-inner">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg text-white">ECHpro</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Universal POS
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">v2.0 Modular</span>
              </div>
              <p className="text-xs text-slate-400">
                Operando em modo: <span className="text-white font-medium">{activeConfig.name}</span>
              </p>
            </div>
          </div>

          {/* Mobile niche switcher dropdown trigger */}
          <div className="md:hidden">
            <select
              value={currentNiche}
              onChange={(e) => onSelectNiche(e.target.value as BusinessNiche)}
              className="bg-slate-800 text-xs text-white border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {Object.values(nicheConfigs).map((cfg) => (
                <option key={cfg.id} value={cfg.id}>
                  {cfg.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Niche Selector Pills (Desktop) */}
        <div className="hidden md:flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
          {(Object.values(nicheConfigs) as BusinessNicheConfig[]).map((cfg) => {
            const isSelected = cfg.id === currentNiche;
            return (
              <button
                key={cfg.id}
                onClick={() => onSelectNiche(cfg.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={cfg.tagline}
              >
                {getNicheIcon(cfg.id, 15)}
                <span>{cfg.name.split('&')[0].trim()}</span>
                {isSelected && <CheckCircle2 size={12} className="text-emerald-200" />}
              </button>
            );
          })}
        </div>

        {/* Actions / Utilities */}
        <div className="flex items-center justify-between md:justify-end gap-2 text-xs">
          {/* Active Operator Pill */}
          <button
            onClick={onOpenUsers}
            className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/80 px-2.5 py-1 rounded-xl border border-slate-700/80 text-left transition"
            title="Gestão de Utilizadores e Troca de Operador"
          >
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${currentUser.avatarColor} text-white font-bold flex items-center justify-center text-[10px]`}>
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="font-bold text-slate-200 block text-[11px] truncate max-w-[110px]">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[9px] font-semibold text-purple-300 block">
                {currentUser.role}
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/60 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Caixa Aberto</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
              title="Visualizar Dashboard de Vendas (Recharts)"
            >
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={onOpenConfig}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
              title="Ajustar Feature Flags do Nicho"
            >
              <Sliders size={14} className="text-amber-400" />
              <span className="hidden lg:inline">Módulos & Flags</span>
            </button>

            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 rounded-lg border border-indigo-700/60 font-medium transition"
              title="Ver Desenho da Base de Dados e Arquitetura"
            >
              <Code2 size={14} className="text-indigo-300" />
              <span>Arquitetura & SQL</span>
            </button>

            <button
              onClick={onResetData}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 rounded-lg border border-slate-700 transition"
              title="Restaurar Dados Padrão de Demonstração"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
