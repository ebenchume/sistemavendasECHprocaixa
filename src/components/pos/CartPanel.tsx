import React from 'react';
import { 
  Trash2, 
  User, 
  UtensilsCrossed, 
  Stethoscope, 
  Sprout, 
  AlertCircle, 
  Tag, 
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';
import { CartItem, RestaurantTable } from '../../types/pos';
import { Customer, PetPatient, AgroPrescriptionRetention } from '../../types/customer';
import { BusinessNicheConfig } from '../../types/business';
import { CalculationResult } from '../../services/posEngine';

interface CartPanelProps {
  cart: CartItem[];
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (cust: Customer | null) => void;
  
  // Niche specific selectors
  pets: PetPatient[];
  selectedPet: PetPatient | null;
  onSelectPet: (pet: PetPatient | null) => void;
  
  tables: RestaurantTable[];
  selectedTable: RestaurantTable | null;
  onSelectTable: (table: RestaurantTable | null) => void;
  onSendToKDS?: () => void;

  agroPrescriptions: AgroPrescriptionRetention[];
  selectedAgroPrescription: AgroPrescriptionRetention | null;
  onSelectAgroPrescription: (rx: AgroPrescriptionRetention | null) => void;

  calculation: CalculationResult;
  config: BusinessNicheConfig;
  
  onUpdateQuantity: (lineId: string, delta: number) => void;
  onRemoveItem: (lineId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  customers,
  selectedCustomer,
  onSelectCustomer,
  pets,
  selectedPet,
  onSelectPet,
  tables,
  selectedTable,
  onSelectTable,
  onSendToKDS,
  agroPrescriptions,
  selectedAgroPrescription,
  onSelectAgroPrescription,
  calculation,
  config,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}) => {
  // Check if any item in cart is an agrochemical that requires prescription
  const hasAgrochemicalInCart = cart.some((i) => i.isAgrochemical);
  // Check if customer pets are available
  const availablePetsForCustomer = selectedCustomer
    ? pets.filter((p) => p.customerId === selectedCustomer.id)
    : pets;

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Context Selectors Header (Customer / Table / Pet / Prescription) */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
        {/* Customer / Tutor / Farmer Selector */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <User size={13} className="text-slate-600" />
              {config.terminology.customerLabel}
            </span>
            {selectedCustomer && (
              <span className="text-[10px] text-slate-500">
                Crédito Disp:{' '}
                <strong className={selectedCustomer.creditLimit - selectedCustomer.currentBalance > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {(selectedCustomer.creditLimit - selectedCustomer.currentBalance).toLocaleString()} {config.currency}
                </strong>
              </span>
            )}
          </div>

          <select
            value={selectedCustomer?.id || ''}
            onChange={(e) => {
              const cust = customers.find((c) => c.id === e.target.value) || null;
              onSelectCustomer(cust);
            }}
            className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Cliente Balcão Ocasional (Sem Fiado)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.currentBalance > 0 ? `(Dívida: ${c.currentBalance.toLocaleString()} ${config.currency})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Niche Specific Context: Restauração -> Mesa / Comanda */}
        {config.flags.enableTablesAndOrders && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1">
                <UtensilsCrossed size={13} />
                Mesa / Comanda
              </span>
            </div>
            <select
              value={selectedTable?.id || ''}
              onChange={(e) => {
                const tbl = tables.find((t) => t.id === e.target.value) || null;
                onSelectTable(tbl);
              }}
              className="w-full text-xs bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="">Venda Direta / Balcão</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.status}) {t.activeComandaNumber ? `[${t.activeComandaNumber}]` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Niche Specific Context: Veterinária -> Paciente Animal */}
        {config.flags.enablePetPatients && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1">
                <Stethoscope size={13} />
                Paciente Animal (Pet)
              </span>
            </div>
            <select
              value={selectedPet?.id || ''}
              onChange={(e) => {
                const pet = pets.find((p) => p.id === e.target.value) || null;
                onSelectPet(pet);
              }}
              className="w-full text-xs bg-white border border-cyan-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">Nenhum Paciente Vinculado</option>
              {availablePetsForCustomer.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.species} ({p.breed}, {p.weightKg} kg)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Niche Specific Context: Agricultura -> Receituário Agronómico Retido */}
        {config.flags.enableAgroPrescriptionRetention && hasAgrochemicalInCart && (
          <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Sprout size={13} />
                Receituário Agronómico Retido *
              </span>
            </div>
            <select
              value={selectedAgroPrescription?.id || ''}
              onChange={(e) => {
                const rx = agroPrescriptions.find((r) => r.id === e.target.value) || null;
                onSelectAgroPrescription(rx);
              }}
              className="w-full text-xs bg-white border border-amber-300 rounded-lg px-2 py-1.2 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">Selecione o Receituário Retido...</option>
              {agroPrescriptions.map((rx) => (
                <option key={rx.id} value={rx.id}>
                  {rx.prescriptionNumber} - {rx.issuingAgronomist} ({rx.targetCrop})
                </option>
              ))}
            </select>
            {!selectedAgroPrescription && (
              <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle size={11} /> Exigência Legal: Defensivos agrícolas exigem receita retida.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
              <Tag size={24} />
            </div>
            <p className="text-sm font-medium text-slate-600">Carrinho Vazio</p>
            <p className="text-xs text-slate-400">
              Clique nos produtos do catálogo ao lado ou faça a leitura por código de barras.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs hover:border-slate-300 transition space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{item.code}</span>
                  <h5 className="text-xs font-bold text-slate-800 leading-tight">{item.name}</h5>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-300 hover:text-rose-500 transition p-0.5"
                  title="Remover Item"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Badges for Lot, Variant, Pet, Notes */}
              <div className="flex flex-wrap gap-1 text-[10px]">
                {item.variantLabel && (
                  <span className="bg-purple-50 text-purple-700 font-medium px-1.5 py-0.2 rounded border border-purple-200 flex items-center gap-0.5">
                    <Layers size={9} /> {item.variantLabel}
                  </span>
                )}
                {item.lotNumber && (
                  <span className="bg-amber-50 text-amber-800 font-medium px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-0.5">
                    <Tag size={9} /> Lote: {item.lotNumber} ({item.expiryDate})
                  </span>
                )}
                {item.petName && (
                  <span className="bg-cyan-50 text-cyan-800 font-medium px-1.5 py-0.2 rounded border border-cyan-200 flex items-center gap-0.5">
                    <Stethoscope size={9} /> Paciente: {item.petName} ({item.petWeightKg}kg)
                  </span>
                )}
                {item.kitchenNotes && (
                  <span className="bg-rose-50 text-rose-800 px-1.5 py-0.2 rounded border border-rose-200 italic">
                    Obs: {item.kitchenNotes}
                  </span>
                )}
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded font-bold transition"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="text-xs font-bold font-mono px-1">
                    {item.quantity} {item.unit}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded font-bold transition"
                  >
                    <Plus size={11} />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    {item.total.toLocaleString()} {config.currency}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    @{item.unitPrice.toLocaleString()} {config.currency}/{item.unit}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals & Checkout Button Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
        <div className="space-y-1 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal (Líquido s/ IVA):</span>
            <span className="font-mono">{calculation.subtotal.toLocaleString()} {config.currency}</span>
          </div>

          <div className="flex justify-between">
            <span>IVA ({config.defaultTaxRate}% incluído):</span>
            <span className="font-mono">{calculation.totalTax.toLocaleString()} {config.currency}</span>
          </div>

          {config.flags.enableServiceFee && calculation.serviceFeeAmount > 0 && (
            <div className="flex justify-between text-rose-700 font-medium">
              <span>Taxa de Serviço Mesa ({config.serviceFeePercent}%):</span>
              <span className="font-mono">+{calculation.serviceFeeAmount.toLocaleString()} {config.currency}</span>
            </div>
          )}

          <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-300">
            <span>TOTAL A PAGAR:</span>
            <span className="text-emerald-700">
              {calculation.totalLiquido.toLocaleString()} {config.currency}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClearCart}
            disabled={cart.length === 0}
            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 bg-white border border-slate-300 hover:border-rose-300 rounded-xl transition disabled:opacity-40"
            title="Limpar Carrinho"
          >
            Limpar
          </button>

          {/* If Restaurant, option to send ticket to KDS without closing payment */}
          {config.flags.enableKitchenDisplay && cart.length > 0 && onSendToKDS && (
            <button
              onClick={onSendToKDS}
              className="flex-1 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              Enviar Cozinha (KDS)
            </button>
          )}

          <button
            onClick={onOpenCheckout}
            disabled={cart.length === 0}
            className="flex-1 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Finalizar Venda (F2)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
