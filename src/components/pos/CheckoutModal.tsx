import React, { useState } from 'react';
import { 
  CreditCard, 
  Banknote, 
  QrCode, 
  Building, 
  Clock, 
  Check, 
  AlertTriangle, 
  Plus, 
  Trash2,
  DollarSign
} from 'lucide-react';
import { PaymentEntry, PaymentMethodType } from '../../types/pos';
import { Customer } from '../../types/customer';
import { BusinessNicheConfig } from '../../types/business';
import { CalculationResult, POSEngine } from '../../services/posEngine';

interface CheckoutModalProps {
  totalToPay: number;
  customer: Customer | null;
  config: BusinessNicheConfig;
  onConfirmSale: (payments: PaymentEntry[], notes?: string) => void;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  totalToPay,
  customer,
  config,
  onConfirmSale,
  onClose,
}) => {
  // Start with default full payment in cash or card
  const [payments, setPayments] = useState<PaymentEntry[]>([
    { method: 'Dinheiro', amount: totalToPay }
  ]);
  const [observations, setObservations] = useState('');
  const [activeMethodToAdd, setActiveMethodToAdd] = useState<PaymentMethodType>('Cartão');
  const [amountToAdd, setAmountToAdd] = useState<number>(0);

  // Calculate current payment tallies
  let totalPaid = 0;
  let fiadoTotal = 0;

  for (const p of payments) {
    if (p.method === 'Fiado (Conta Corrente)') {
      fiadoTotal += p.amount;
    } else {
      totalPaid += p.amount;
    }
  }

  const grandTotalCovered = totalPaid + fiadoTotal;
  const remainingDue = Math.max(0, totalToPay - grandTotalCovered);
  const changeToReturn = totalPaid > (totalToPay - fiadoTotal) ? (totalPaid - (totalToPay - fiadoTotal)) : 0;

  // Credit check for fiado
  const creditValidation = POSEngine.validateCustomerCredit(customer, fiadoTotal);

  const handleUpdatePaymentAmount = (index: number, newAmount: number) => {
    const updated = [...payments];
    updated[index].amount = Math.max(0, newAmount);
    setPayments(updated);
  };

  const handleRemovePayment = (index: number) => {
    if (payments.length <= 1) return;
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleAddPaymentSplit = () => {
    if (remainingDue <= 0 && amountToAdd <= 0) return;
    const value = amountToAdd > 0 ? amountToAdd : remainingDue;
    setPayments([...payments, { method: activeMethodToAdd, amount: value }]);
    setAmountToAdd(0);
  };

  const handleQuickCashBill = (billValue: number) => {
    // If only 1 cash payment exists, set its value
    const cashIdx = payments.findIndex((p) => p.method === 'Dinheiro');
    if (cashIdx >= 0) {
      handleUpdatePaymentAmount(cashIdx, billValue);
    } else {
      setPayments([...payments, { method: 'Dinheiro', amount: billValue }]);
    }
  };

  const canFinalize = grandTotalCovered >= totalToPay && creditValidation.allowed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Módulo 3: Frente de Caixa & Pagamentos
            </span>
            <h3 className="text-lg font-bold">Liquidação e Métodos de Pagamento</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold p-1">
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Total Display Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Total da Venda
              </span>
              <div className="text-2xl font-black text-slate-900">
                {totalToPay.toLocaleString()} <span className="text-sm font-medium text-slate-500">{config.currency}</span>
              </div>
            </div>

            <div className="text-right">
              {remainingDue > 0 ? (
                <div>
                  <span className="text-xs text-rose-600 font-semibold">Faltam Liquidar</span>
                  <div className="text-xl font-bold text-rose-600">
                    {remainingDue.toLocaleString()} {config.currency}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-emerald-700 font-semibold">Troco a Devolver</span>
                  <div className="text-xl font-bold text-emerald-700">
                    {changeToReturn.toLocaleString()} {config.currency}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Cash Presets (for fast retail/kiosks) */}
          <div>
            <span className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Atalhos de Numerário Rápido (Dinheiro):
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickCashBill(totalToPay)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
              >
                Valor Exato ({totalToPay.toLocaleString()})
              </button>
              {[100, 200, 500, 1000, 2000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickCashBill(val)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-semibold transition"
                >
                  +{val} {config.currency}
                </button>
              ))}
            </div>
          </div>

          {/* Payments List (Supports Multiple Payment Methods in the Same Sale) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Linhas de Pagamento Múltiplo ({payments.length}):
              </span>
              <span className="text-[11px] text-slate-400">
                Pode combinar Dinheiro + Cartão + Fiado
              </span>
            </div>

            {payments.map((entry, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {/* Method selector */}
                <select
                  value={entry.method}
                  onChange={(e) => {
                    const updated = [...payments];
                    updated[index].method = e.target.value as PaymentMethodType;
                    setPayments(updated);
                  }}
                  className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1.5 font-medium focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Dinheiro">💵 Dinheiro</option>
                  <option value="Cartão">💳 Cartão / TPA</option>
                  <option value="PIX / Carteira Digital">📱 Carteira Digital / M-Pesa</option>
                  <option value="Transferência">🏦 Transferência Bancária</option>
                  <option value="Fiado (Conta Corrente)">⏳ Fiado (Conta Corrente)</option>
                </select>

                {/* Amount input */}
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={entry.amount}
                    onChange={(e) => handleUpdatePaymentAmount(index, parseFloat(e.target.value) || 0)}
                    className="w-full text-sm font-bold text-right pr-12 pl-2 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">
                    {config.currency}
                  </span>
                </div>

                {/* Remove split row */}
                {payments.length > 1 && (
                  <button
                    onClick={() => handleRemovePayment(index)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            {/* Add Split Payment Row */}
            {remainingDue > 0 && (
              <div className="flex gap-2 pt-1">
                <select
                  value={activeMethodToAdd}
                  onChange={(e) => setActiveMethodToAdd(e.target.value as PaymentMethodType)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                >
                  <option value="Cartão">💳 Cartão / TPA</option>
                  <option value="Dinheiro">💵 Dinheiro</option>
                  <option value="PIX / Carteira Digital">📱 M-Pesa / Carteira Digital</option>
                  <option value="Transferência">🏦 Transferência</option>
                  <option value="Fiado (Conta Corrente)">⏳ Fiado (Conta Corrente)</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddPaymentSplit}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition"
                >
                  <Plus size={13} />
                  Dividir Restante ({remainingDue.toLocaleString()} {config.currency})
                </button>
              </div>
            )}
          </div>

          {/* Fiado Credit Limit Warning (Módulo 4) */}
          {fiadoTotal > 0 && (
            <div className={`p-3 rounded-xl border text-xs space-y-1 ${
              creditValidation.allowed
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle size={15} className={creditValidation.allowed ? 'text-amber-600' : 'text-rose-600'} />
                <span>Controlo de Venda Fiada / Conta Corrente:</span>
              </div>
              {customer ? (
                <div>
                  <p>
                    Cliente: <strong>{customer.name}</strong> | Saldo Devedor Atual: {customer.currentBalance.toLocaleString()} {config.currency}
                  </p>
                  <p>
                    Limite de Crédito Aprovado: {customer.creditLimit.toLocaleString()} {config.currency} | Novo Saldo Projetado: {(customer.currentBalance + fiadoTotal).toLocaleString()} {config.currency}
                  </p>
                  {!creditValidation.allowed && (
                    <p className="font-bold text-rose-700 pt-1">
                      {creditValidation.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="font-bold text-rose-700">
                  ⚠️ Para vender a Fiado, selecione primeiro um cliente cadastrado no carrinho.
                </p>
              )}
            </div>
          )}

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Observações no Talão / Documento (Opcional):
            </label>
            <input
              type="text"
              placeholder="Ex: Entregar na fazenda / Comprovativo enviado por WhatsApp..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Voltar ao Caixa
          </button>

          <button
            type="button"
            onClick={() => onConfirmSale(payments, observations)}
            disabled={!canFinalize}
            className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Check size={16} />
            <span>Confirmar Pagamento e Emitir Talão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
