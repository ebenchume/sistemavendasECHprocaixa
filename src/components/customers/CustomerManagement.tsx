import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  DollarSign, 
  AlertCircle, 
  Plus, 
  Search, 
  Check, 
  Stethoscope, 
  History, 
  FileText,
  BadgeCheck,
  TrendingDown
} from 'lucide-react';
import { Customer, PetPatient, DebtPaymentReceipt } from '../../types/customer';
import { Sale } from '../../types/pos';
import { BusinessNicheConfig } from '../../types/business';

interface CustomerManagementProps {
  customers: Customer[];
  pets: PetPatient[];
  sales: Sale[];
  config: BusinessNicheConfig;
  onUpdateCustomer: (customer: Customer) => void;
  onSettleDebt: (
    customerId: string,
    amountPaid: number,
    paymentMethod: 'Dinheiro' | 'Cartao' | 'Transferencia' | 'PIX'
  ) => void;
  onAddCustomer: (customer: Customer) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  pets,
  sales,
  config,
  onUpdateCustomer,
  onSettleDebt,
  onAddCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Debt payoff modal
  const [debtModalCustomer, setDebtModalCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Dinheiro' | 'Cartao' | 'Transferencia' | 'PIX'>('Dinheiro');
  const [receiptPrinted, setReceiptPrinted] = useState<DebtPaymentReceipt | null>(null);

  // Edit credit limit modal
  const [creditLimitModalCustomer, setCreditLimitModalCustomer] = useState<Customer | null>(null);
  const [newLimit, setNewLimit] = useState<number>(0);

  // Filter customers
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.taxId && c.taxId.includes(searchTerm))
  );

  // Calculate totals
  const totalFiadoReceivable = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalCreditLimitGranted = customers.reduce((sum, c) => sum + c.creditLimit, 0);

  const handleOpenDebtModal = (c: Customer) => {
    setDebtModalCustomer(c);
    setPaymentAmount(c.currentBalance);
    setReceiptPrinted(null);
  };

  const handleConfirmDebtPayment = () => {
    if (!debtModalCustomer || paymentAmount <= 0) return;
    
    const prev = debtModalCustomer.currentBalance;
    const newBal = Math.max(0, prev - paymentAmount);

    const receipt: DebtPaymentReceipt = {
      id: 'rec-' + Date.now(),
      customerId: debtModalCustomer.id,
      customerName: debtModalCustomer.name,
      amountPaid: paymentAmount,
      previousBalance: prev,
      newBalance: newBal,
      paymentMethod,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operatorName: 'Operador de Caixa Central',
      receiptNumber: `REC-DIV/${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onSettleDebt(debtModalCustomer.id, paymentAmount, paymentMethod);
    setReceiptPrinted(receipt);
  };

  const handleSaveCreditLimit = () => {
    if (!creditLimitModalCustomer) return;
    onUpdateCustomer({
      ...creditLimitModalCustomer,
      creditLimit: newLimit,
    });
    setCreditLimitModalCustomer(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Module 4 Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              MÓDULO 4
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              CRM, Fidelização e Controlo de Venda Fiada
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de contas correntes de clientes, saldo devedor, limites de crédito para vendas a prazo e histórico.
          </p>
        </div>

        {/* Global Debt Balance Indicator */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">
              Total em Dívida (Fiado a Receber)
            </span>
            <span className="text-lg font-black text-amber-800">
              {totalFiadoReceivable.toLocaleString()} <span className="text-xs">{config.currency}</span>
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Limite Global Concedido
            </span>
            <span className="text-lg font-black text-slate-800">
              {totalCreditLimitGranted.toLocaleString()} <span className="text-xs">{config.currency}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search and Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Pesquisar por nome, NUIT ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {filtered.length} clientes encontrados
            </span>
          </div>

          {/* Customer Cards */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filtered.map((c) => {
              const customerPets = pets.filter((p) => p.customerId === c.id);
              const availableCredit = Math.max(0, c.creditLimit - c.currentBalance);
              const hasDebt = c.currentBalance > 0;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    selectedCustomer?.id === c.id
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                      {c.taxId && (
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          NUIT: {c.taxId}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-3">
                      {c.phone && <span>Tel: {c.phone}</span>}
                      {c.city && <span>Cidade: {c.city}</span>}
                      {c.loyaltyPoints > 0 && (
                        <span className="text-emerald-700 font-medium">
                          ★ {c.loyaltyPoints} Pontos
                        </span>
                      )}
                    </div>

                    {/* Pet tags if veterinary */}
                    {customerPets.length > 0 && (
                      <div className="flex items-center gap-1 pt-1 text-[10px] text-cyan-800">
                        <Stethoscope size={11} />
                        <span>Animais: {customerPets.map((p) => `${p.name} (${p.species})`).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Financial Status and Actions */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Saldo em Dívida (Fiado)
                      </span>
                      <span className={`text-sm font-black font-mono ${hasDebt ? 'text-amber-700' : 'text-slate-600'}`}>
                        {c.currentBalance.toLocaleString()} {config.currency}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Limite: {c.creditLimit.toLocaleString()} {config.currency}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      {hasDebt && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDebtModal(c);
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          Liquidar Dívida
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCreditLimitModalCustomer(c);
                          setNewLimit(c.creditLimit);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                      >
                        Ajustar Limite
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Details & Purchase Timeline */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <History size={16} className="text-slate-500" />
            Extrato & Detalhes do Cliente
          </h3>

          {selectedCustomer ? (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                <div className="font-bold text-base text-slate-900">{selectedCustomer.name}</div>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>Telefone: {selectedCustomer.phone || 'Não informado'}</p>
                  <p>Email: {selectedCustomer.email || 'Não informado'}</p>
                  <p>Endereço: {selectedCustomer.address || 'Não informado'}</p>
                  <p>Cadastrado em: {selectedCustomer.createdAt}</p>
                </div>
                {selectedCustomer.notes && (
                  <p className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-200 italic">
                    {selectedCustomer.notes}
                  </p>
                )}
              </div>

              {/* Credit Status Gauge */}
              <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Utilização do Limite de Crédito
                </span>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      selectedCustomer.currentBalance > selectedCustomer.creditLimit * 0.8
                        ? 'bg-rose-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        selectedCustomer.creditLimit > 0
                          ? (selectedCustomer.currentBalance / selectedCustomer.creditLimit) * 100
                          : 0
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Dívida: {selectedCustomer.currentBalance.toLocaleString()} {config.currency}</span>
                  <span>Limite: {selectedCustomer.creditLimit.toLocaleString()} {config.currency}</span>
                </div>
              </div>

              {/* Purchase History for this customer */}
              <div>
                <span className="text-xs font-bold text-slate-700 mb-2 block">
                  Últimas Compras Realizadas:
                </span>
                {sales.filter((s) => s.customerId === selectedCustomer.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhuma compra registrada para este cliente.</p>
                ) : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {sales
                      .filter((s) => s.customerId === selectedCustomer.id)
                      .map((sale) => (
                        <div
                          key={sale.id}
                          className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center"
                        >
                          <div>
                            <div className="font-mono font-bold text-slate-800">{sale.saleNumber}</div>
                            <div className="text-[10px] text-slate-400">{sale.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">
                              {sale.totalLiquido.toLocaleString()} {config.currency}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-medium">
                              {sale.status}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center text-xs p-4">
              <Users size={32} className="text-slate-300 mb-2" />
              <p>Selecione um cliente na lista ao lado para ver o histórico detalhado, limite de fiado e saldos.</p>
            </div>
          )}
        </div>
      </div>

      {/* Debt Payoff Modal */}
      {debtModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 p-5 space-y-4">
            {!receiptPrinted ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-700">Recibo de Caixa</span>
                    <h3 className="font-bold text-base text-slate-900">Liquidação de Dívida (Fiado)</h3>
                  </div>
                  <button onClick={() => setDebtModalCustomer(null)} className="text-slate-400 hover:text-white font-bold p-1">
                    ✕
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1">
                  <p>Cliente: <strong>{debtModalCustomer.name}</strong></p>
                  <p>Saldo Devedor Atual: <strong>{debtModalCustomer.currentBalance.toLocaleString()} {config.currency}</strong></p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Valor a Amortizar / Pagar:
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={debtModalCustomer.currentBalance}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      className="w-full text-lg font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Forma de Pagamento Recebida:
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
                    >
                      <option value="Dinheiro">💵 Dinheiro em Caixa</option>
                      <option value="Cartao">💳 Cartão / TPA</option>
                      <option value="Transferencia">🏦 Transferência Bancária</option>
                      <option value="PIX">📱 M-Pesa / Carteira Digital</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDebtModalCustomer(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDebtPayment}
                    className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs"
                  >
                    Confirmar Quitação
                  </button>
                </div>
              </>
            ) : (
              /* Payoff Receipt Display */
              <div className="space-y-3">
                <div className="text-center pb-2 border-b border-slate-200">
                  <BadgeCheck size={36} className="text-emerald-600 mx-auto mb-1" />
                  <h4 className="font-bold text-sm text-slate-900">Dívida Liquidada com Sucesso!</h4>
                  <p className="text-xs text-slate-500 font-mono">{receiptPrinted.receiptNumber}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Cliente:</span>
                    <span className="font-bold">{receiptPrinted.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Amortizado:</span>
                    <span className="font-bold text-emerald-700">
                      {receiptPrinted.amountPaid.toLocaleString()} {config.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Novo Saldo Devedor:</span>
                    <span className="font-bold">
                      {receiptPrinted.newBalance.toLocaleString()} {config.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meio de Pagamento:</span>
                    <span>{receiptPrinted.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>Data:</span>
                    <span>{receiptPrinted.date}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDebtModalCustomer(null)}
                    className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Credit Limit Adjustment Modal */}
      {creditLimitModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Ajustar Limite de Crédito</h3>
              <button onClick={() => setCreditLimitModalCustomer(null)} className="text-slate-400 hover:text-white font-bold p-1">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Cliente: <strong>{creditLimitModalCustomer.name}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Novo Limite de Crédito ({config.currency}):
              </label>
              <input
                type="number"
                step="500"
                min="0"
                value={newLimit}
                onChange={(e) => setNewLimit(parseFloat(e.target.value) || 0)}
                className="w-full text-lg font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCreditLimitModalCustomer(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCreditLimit}
                className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs"
              >
                Salvar Limite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
