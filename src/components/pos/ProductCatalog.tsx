import React, { useState } from 'react';
import { 
  Search, 
  Barcode, 
  Plus, 
  Layers, 
  Sprout, 
  AlertTriangle, 
  Stethoscope, 
  Clock, 
  Tag, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { Product, ProductLot, ProductVariant, UnitOfMeasure } from '../../types/inventory';
import { BusinessNicheConfig } from '../../types/business';

interface ProductCatalogProps {
  products: Product[];
  lots: ProductLot[];
  config: BusinessNicheConfig;
  onAddToCart: (
    product: Product,
    quantity: number,
    options?: {
      variant?: ProductVariant;
      lot?: ProductLot;
      customUnit?: UnitOfMeasure;
      notes?: string;
    }
  ) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  lots,
  config,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Modal states for item configuration before adding
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedLot, setSelectedLot] = useState<ProductLot | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<UnitOfMeasure>('Un');
  const [qtyInput, setQtyInput] = useState<number>(1);
  const [itemNotes, setItemNotes] = useState<string>('');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm));
    return p.isActive && matchesCategory && matchesSearch;
  });

  const handleOpenProductOptions = (prod: Product) => {
    const prodLots = lots.filter((l) => l.productId === prod.id && l.currentQuantity > 0);
    const hasVariants = prod.nicheSpecific?.variants && prod.nicheSpecific.variants.length > 0;
    const hasLots = config.flags.enableBatchAndExpiryControl && prodLots.length > 0;
    const hasMultiUnits = config.flags.enableMultiUnitMeasure && prod.allowedUnits.length > 1;
    const isFractional = config.flags.enableFractionalQuantities;

    // If no configuration is needed and standard unit: add directly
    if (!hasVariants && !hasLots && !hasMultiUnits && !isFractional) {
      onAddToCart(prod, 1);
      return;
    }

    // Otherwise, open quick configuration modal
    setActiveModalProduct(prod);
    setSelectedVariant(hasVariants && prod.nicheSpecific?.variants ? prod.nicheSpecific.variants[0] : null);
    setSelectedLot(hasLots ? prodLots[0] : null);
    setSelectedUnit(prod.baseUnit);
    setQtyInput(1);
    setItemNotes('');
  };

  const handleConfirmAddModal = () => {
    if (!activeModalProduct) return;
    
    onAddToCart(activeModalProduct, qtyInput, {
      variant: selectedVariant || undefined,
      lot: selectedLot || undefined,
      customUnit: selectedUnit,
      notes: itemNotes.trim() ? itemNotes : undefined,
    });

    setActiveModalProduct(null);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = products.find(
      (p) => p.barcode === barcodeInput.trim() || p.code.toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (matched) {
      handleOpenProductOptions(matched);
      setBarcodeInput('');
    } else {
      alert(`Produto com código ou código de barras "${barcodeInput}" não encontrado!`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
      {/* Search & Barcode Header */}
      <div className="p-3 bg-white border-b border-slate-200 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={17} />
            <input
              type="text"
              placeholder={`Pesquisar ${config.terminology.itemsLabel.toLowerCase()} por nome ou código...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Barcode Quick Scanner Input */}
          <form onSubmit={handleBarcodeSubmit} className="relative w-44 hidden sm:block">
            <Barcode className="absolute left-2.5 top-2.5 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Ler Barcode..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full pl-8 pr-2 py-2 bg-slate-100 focus:bg-white text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Todos os Itens' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredProducts.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm">
            <p>Nenhum produto encontrado nesta categoria ou pesquisa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filteredProducts.map((prod) => {
              const isLowStock = prod.currentStock <= prod.minimumStock;
              const prodLots = lots.filter((l) => l.productId === prod.id && l.currentQuantity > 0);
              const hasVariants = prod.nicheSpecific?.variants && prod.nicheSpecific.variants.length > 0;
              const hasLots = prodLots.length > 0;

              return (
                <div
                  key={prod.id}
                  onClick={() => handleOpenProductOptions(prod)}
                  className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md transition-all text-left"
                >
                  {/* Top tags */}
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {prod.code}
                      </span>
                      {isLowStock && config.flags.enableLowStockAlerts && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded flex items-center gap-0.5">
                          <AlertTriangle size={10} />
                          Stock Baixo
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover:text-emerald-700 transition">
                      {prod.name}
                    </h4>

                    {/* Niche specific badges */}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {prod.nicheSpecific?.isAgrochemical && (
                        <span className="text-[9px] bg-amber-50 text-amber-700 font-medium px-1 rounded flex items-center gap-0.5 border border-amber-200">
                          <Sprout size={9} /> Defensivo Retido
                        </span>
                      )}
                      {prod.nicheSpecific?.isVeterinaryMedicine && (
                        <span className="text-[9px] bg-cyan-50 text-cyan-700 font-medium px-1 rounded flex items-center gap-0.5 border border-cyan-200">
                          <Stethoscope size={9} /> Uso Veterinário
                        </span>
                      )}
                      {hasVariants && (
                        <span className="text-[9px] bg-purple-50 text-purple-700 font-medium px-1 rounded flex items-center gap-0.5 border border-purple-200">
                          <Layers size={9} /> {prod.nicheSpecific?.variants?.length} Variantes
                        </span>
                      )}
                      {prod.nicheSpecific?.kitchenStation && (
                        <span className="text-[9px] bg-rose-50 text-rose-700 font-medium px-1 rounded flex items-center gap-0.5 border border-rose-200">
                          <Clock size={9} /> {prod.nicheSpecific.kitchenStation} ({prod.nicheSpecific.preparationTimeMinutes}m)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {prod.salePrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">{config.currency}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Stock: {prod.currentStock} {prod.baseUnit}
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Plus size={15} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Item Configuration Modal (Variants / Multi-Units / Lots / Weights) */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400">{activeModalProduct.code}</span>
                <h3 className="font-bold text-base">{activeModalProduct.name}</h3>
                <p className="text-xs text-slate-300">
                  Preço Base: {activeModalProduct.salePrice.toLocaleString()} {config.currency} / {activeModalProduct.baseUnit}
                </p>
              </div>
              <button
                onClick={() => setActiveModalProduct(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* 1. Variants Selection (Retail) */}
              {activeModalProduct.nicheSpecific?.variants && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Layers size={14} className="text-purple-600" />
                    Selecione a Variante / Tamanho / Cor:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeModalProduct.nicheSpecific.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-2 rounded-lg text-xs text-left border transition ${
                          selectedVariant?.id === variant.id
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold ring-1 ring-purple-600'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-medium">{variant.name}</div>
                        <div className="text-[10px] text-slate-500">
                          SKU: {variant.sku} | Stock: {variant.stock}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Lot and Expiration Selection (Agro & Vet) */}
              {config.flags.enableBatchAndExpiryControl && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Tag size={14} className="text-amber-600" />
                    Selecione o Lote e Data de Validade (Rastreabilidade):
                  </label>
                  {lots.filter((l) => l.productId === activeModalProduct.id).length === 0 ? (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">
                      Nenhum lote específico registrado. O stock base ({activeModalProduct.currentStock} {activeModalProduct.baseUnit}) será abatido.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {lots
                        .filter((l) => l.productId === activeModalProduct.id)
                        .map((lot) => {
                          const isExpired = new Date(lot.expirationDate) < new Date();
                          return (
                            <button
                              key={lot.id}
                              type="button"
                              onClick={() => setSelectedLot(lot)}
                              className={`w-full p-2.5 rounded-lg text-xs text-left border flex items-center justify-between transition ${
                                selectedLot?.id === lot.id
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div>
                                <span className="font-mono font-bold">{lot.lotNumber}</span>
                                <span className="ml-2 text-slate-500">
                                  Validade: {lot.expirationDate}
                                </span>
                              </div>
                              <span className="text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                                Qtd: {lot.currentQuantity} {lot.unit}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Unit of Measure Selection (Multi-Unit) */}
              {activeModalProduct.allowedUnits && activeModalProduct.allowedUnits.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Unidade de Medida para a Venda:
                  </label>
                  <div className="flex gap-2">
                    {activeModalProduct.allowedUnits.map((u) => (
                      <button
                        key={u.unit}
                        type="button"
                        onClick={() => setSelectedUnit(u.unit)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                          selectedUnit === u.unit
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {u.unit} {u.multiplier !== 1 && `(Fator: ${u.multiplier})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Quantity (with decimal fraction for Agro/Vet) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Quantidade a Vender ({selectedUnit}):
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQtyInput((q) => Math.max(0.1, q - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    step={config.flags.enableFractionalQuantities ? '0.01' : '1'}
                    min="0.01"
                    value={qtyInput}
                    onChange={(e) => setQtyInput(parseFloat(e.target.value) || 0)}
                    className="flex-1 py-2 text-center text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setQtyInput((q) => q + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                {config.flags.enableFractionalQuantities && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Suporta frações decimais (ex: 0.5 kg, 2.75 L, dosagens veterinárias).
                  </p>
                )}
              </div>

              {/* 5. Notes / Observações */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações para o item (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ponto da carne, instruções de dosagem, instruções de entrega..."
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-slate-500 text-xs">Total do Item: </span>
                <span className="font-bold text-slate-900 text-base">
                  {(activeModalProduct.salePrice * qtyInput).toLocaleString()} {config.currency}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalProduct(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAddModal}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Check size={14} />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
