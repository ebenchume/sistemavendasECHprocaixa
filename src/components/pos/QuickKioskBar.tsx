import React from 'react';
import { Zap, Check, ArrowRight } from 'lucide-react';
import { Product } from '../../types/inventory';
import { BusinessNicheConfig } from '../../types/business';

interface QuickKioskBarProps {
  products: Product[];
  config: BusinessNicheConfig;
  onQuickExpressSale: (product: Product) => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export const QuickKioskBar: React.FC<QuickKioskBarProps> = ({
  products,
  config,
  onQuickExpressSale,
  onAddToCart,
}) => {
  // Take first 5 kiosk products or top fast movers
  const quickItems = products.slice(0, 6);

  return (
    <div className="bg-indigo-950 text-white p-2.5 border-b border-indigo-900 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
            <Zap size={14} className="text-amber-400 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-tight text-white">
              Venda Expressa (2-Cliques)
            </span>
            <span className="text-[10px] text-indigo-300 ml-2 hidden sm:inline">
              Clique para finalizar em dinheiro instantaneamente ou adicione em lote
            </span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {quickItems.map((prod) => (
            <div
              key={prod.id}
              className="flex items-center bg-indigo-900/80 hover:bg-indigo-800 border border-indigo-700/60 rounded-lg p-1 text-xs whitespace-nowrap transition"
            >
              <button
                type="button"
                onClick={() => onAddToCart(prod, 1)}
                className="px-2 py-0.5 text-left text-white font-medium hover:text-indigo-200"
                title="Adicionar ao carrinho"
              >
                <span>{prod.name.length > 18 ? prod.name.substring(0, 18) + '...' : prod.name}</span>
                <span className="ml-1.5 font-bold text-amber-300">
                  {prod.salePrice} {config.currency}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onQuickExpressSale(prod)}
                className="ml-1 px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold flex items-center gap-0.5"
                title="Venda Instantânea em Dinheiro (1 Clique)"
              >
                <Zap size={10} />
                <span>Pagar</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
