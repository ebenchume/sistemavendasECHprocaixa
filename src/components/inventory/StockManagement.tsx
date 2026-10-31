import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Tag, 
  Search, 
  ArrowUpDown, 
  Layers, 
  Check, 
  Calendar, 
  Clock, 
  Building2,
  Sprout,
  Stethoscope
} from 'lucide-react';
import { Product, ProductLot, UnitOfMeasure } from '../../types/inventory';
import { BusinessNicheConfig } from '../../types/business';

interface StockManagementProps {
  products: Product[];
  lots: ProductLot[];
  config: BusinessNicheConfig;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onAddProduct: (product: Product) => void;
  onAddLot: (lot: ProductLot) => void;
}

export const StockManagement: React.FC<StockManagementProps> = ({
  products,
  lots,
  config,
  onUpdateProductStock,
  onAddProduct,
  onAddLot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'lots'>('products');
  
  // Stock adjustment modal state
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Contagem Física de Inventário');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLow = filterLowStock ? p.currentStock <= p.minimumStock : true;
    return matchesSearch && matchesLow;
  });

  const lowStockCount = products.filter((p) => p.currentStock <= p.minimumStock).length;

  const handleOpenAdjustment = (prod: Product) => {
    setAdjustingProduct(prod);
    setNewStockValue(prod.currentStock);
  };

  const handleConfirmAdjustment = () => {
    if (!adjustingProduct) return;
    onUpdateProductStock(adjustingProduct.id, newStockValue);
    setAdjustingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner & Module Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              MÓDULO 2
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Gestão de Stock Avançada & Rastreabilidade
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Controlo multi-unidade, alertas de stock mínimo e rastreio de lotes com datas de validade.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Itens</span>
            <span className="text-lg font-black text-slate-800">{products.length}</span>
          </div>

          <div className="bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-rose-600 block">Stock Crítico</span>
            <span className="text-lg font-black text-rose-700">{lowStockCount}</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Lotes Ativos</span>
            <span className="text-lg font-black text-amber-800">{lots.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Artigos e Multi-Unidades ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('lots')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'lots'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Lotes & Validades ({lots.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Filtrar por código ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-56"
            />
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => setFilterLowStock(!filterLowStock)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
                filterLowStock
                  ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle size={13} className={filterLowStock ? 'text-rose-600' : 'text-slate-400'} />
              <span>Apenas Stock Baixo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'products' ? (
        /* Products Table */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Código / Barcode</th>
                  <th className="py-3 px-4">Descrição do Artigo</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Multi-Unidades</th>
                  <th className="py-3 px-4 text-right">P. Custo</th>
                  <th className="py-3 px-4 text-right">P. Venda</th>
                  <th className="py-3 px-4 text-center">Stock Atual</th>
                  <th className="py-3 px-4 text-center">Stock Mín.</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => {
                  const isLow = prod.currentStock <= prod.minimumStock;
                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-900">{prod.code}</div>
                        {prod.barcode && (
                          <div className="text-[10px] text-slate-400">{prod.barcode}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{prod.name}</div>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {prod.nicheSpecific?.isAgrochemical && (
                            <span className="text-[9px] bg-amber-50 text-amber-800 font-medium px-1.5 py-0.2 rounded border border-amber-200">
                              Defensivo: {prod.nicheSpecific.activeIngredient} ({prod.nicheSpecific.toxicologicalClass})
                            </span>
                          )}
                          {prod.nicheSpecific?.variants && (
                            <span className="text-[9px] bg-purple-50 text-purple-700 font-medium px-1.5 py-0.2 rounded border border-purple-200">
                              {prod.nicheSpecific.variants.length} variantes
                            </span>
                          )}
                          {prod.nicheSpecific?.isVeterinaryMedicine && (
                            <span className="text-[9px] bg-cyan-50 text-cyan-800 font-medium px-1.5 py-0.2 rounded border border-cyan-200">
                              Uso Veterinário
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">{prod.category}</td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                            {prod.baseUnit} (Base)
                          </span>
                          {prod.allowedUnits
                            .filter((u) => u.unit !== prod.baseUnit)
                            .map((u) => (
                              <span
                                key={u.unit}
                                className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-mono text-[10px]"
                              >
                                {u.unit} = {u.multiplier} {prod.baseUnit}
                              </span>
                            ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        {prod.costPrice.toLocaleString()} {config.currency}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {prod.salePrice.toLocaleString()} {config.currency}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold font-mono ${
                            isLow
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {isLow && <AlertTriangle size={11} />}
                          {prod.currentStock} {prod.baseUnit}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-slate-400">
                        {prod.minimumStock} {prod.baseUnit}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenAdjustment(prod)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition"
                        >
                          Ajustar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Lots and Expirations Table */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Lote / Batch</th>
                  <th className="py-3 px-4">Artigo Associado</th>
                  <th className="py-3 px-4">Data de Fabrico</th>
                  <th className="py-3 px-4">Data de Validade</th>
                  <th className="py-3 px-4 text-center">Qtd Inicial</th>
                  <th className="py-3 px-4 text-center">Qtd Atual</th>
                  <th className="py-3 px-4">Status de Validade</th>
                  <th className="py-3 px-4">Instruções / Armazenamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lots.map((lot) => {
                  const prod = products.find((p) => p.id === lot.productId);
                  const expiry = new Date(lot.expirationDate);
                  const now = new Date();
                  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
                  
                  let badge = (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                      ✓ Válido ({diffDays} dias)
                    </span>
                  );

                  if (diffDays <= 0) {
                    badge = (
                      <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full font-bold">
                        ⚠️ VENCIDO
                      </span>
                    );
                  } else if (diffDays <= 60) {
                    badge = (
                      <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                        ⚡ Vence em {diffDays} dias
                      </span>
                    );
                  }

                  return (
                    <tr key={lot.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {lot.lotNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {prod ? prod.name : 'Produto Desconhecido'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {lot.manufacturingDate || '-'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {lot.expirationDate}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">
                        {lot.initialQuantity} {lot.unit}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                        {lot.currentQuantity} {lot.unit}
                      </td>
                      <td className="py-3 px-4">{badge}</td>
                      <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                        {lot.notes || 'Armazenar em local seco e fresco.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-600">{adjustingProduct.code}</span>
                <h3 className="font-bold text-base text-slate-900">Ajustar Saldo de Stock</h3>
              </div>
              <button onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Artigo: <strong>{adjustingProduct.name}</strong> (Unidade: {adjustingProduct.baseUnit})
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Novo Saldo Físico:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(parseFloat(e.target.value) || 0)}
                  className="w-full text-lg font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motivo do Ajuste:
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
                >
                  <option value="Contagem Física de Inventário">Contagem Física de Inventário</option>
                  <option value="Avaria / Quebra / Perda">Avaria / Quebra / Perda</option>
                  <option value="Entrada Extraordinária de Fornecedor">Entrada Extraordinária de Fornecedor</option>
                  <option value="Devolução de Cliente">Devolução de Cliente</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAdjustment}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs"
              >
                Salvar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
