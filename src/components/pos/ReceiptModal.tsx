import React, { useRef } from 'react';
import { Printer, CheckCircle2, Download, ArrowLeft, QrCode } from 'lucide-react';
import { Sale } from '../../types/pos';
import { BusinessNicheConfig } from '../../types/business';

interface ReceiptModalProps {
  sale: Sale;
  config: BusinessNicheConfig;
  onNewSale: () => void;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  sale,
  config,
  onNewSale,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[95vh]">
        {/* Modal Top Bar */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="font-bold text-sm">Venda Concluída com Sucesso!</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-1">
            ✕
          </button>
        </div>

        {/* 80mm Thermal Receipt Preview Container */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div
            ref={receiptRef}
            className="w-full max-w-[340px] bg-white p-5 rounded-lg shadow-sm border border-slate-200 text-slate-800 font-mono text-[11px] leading-relaxed select-text"
          >
            {/* Header / Company Info */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300 space-y-0.5">
              <h3 className="font-black text-sm text-slate-900 uppercase">
                EMPRESA COMERCIAL UNIVERSAL, LDA
              </h3>
              <p className="text-[10px] text-slate-600">ECHpro POS Enterprise Solution</p>
              <p className="text-[10px] text-slate-600">NUIT: 400192837 | Tel: +258 21 490 000</p>
              <p className="text-[10px] text-slate-500">Av. 25 de Setembro, Edifício Jat V - Maputo</p>
              <div className="pt-1 font-bold text-xs text-slate-900">
                {sale.documentType.toUpperCase()} - {sale.saleNumber}
              </div>
              <p className="text-[9px] text-slate-400">{sale.date} • {config.name}</p>
            </div>

            {/* Customer Details */}
            <div className="py-2 border-b border-dashed border-slate-300 space-y-0.5 text-[10px]">
              <div>
                <strong>{config.terminology.customerLabel}:</strong> {sale.customerName}
              </div>
              {sale.customerTaxId && (
                <div>
                  <strong>NUIT/Doc:</strong> {sale.customerTaxId}
                </div>
              )}
              {sale.tableNumber && (
                <div>
                  <strong>Mesa / Salão:</strong> {sale.tableNumber} {sale.comandaNumber ? `(${sale.comandaNumber})` : ''}
                </div>
              )}
              <div>
                <strong>Operador:</strong> {sale.operatorName}
              </div>
            </div>

            {/* Line Items */}
            <div className="py-2 border-b border-dashed border-slate-300 space-y-1.5">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 border-b border-slate-200 pb-1">
                <span>DESCRIÇÃO</span>
                <span>QTD x PREÇO = TOTAL</span>
              </div>

              {sale.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  
                  {/* Context details if present */}
                  {item.variantLabel && (
                    <div className="text-[9px] text-purple-700">Var: {item.variantLabel}</div>
                  )}
                  {item.lotNumber && (
                    <div className="text-[9px] text-amber-800">Lote: {item.lotNumber} (Val: {item.expiryDate})</div>
                  )}
                  {item.petName && (
                    <div className="text-[9px] text-cyan-800">Paciente: {item.petName} ({item.petWeightKg}kg)</div>
                  )}

                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>
                      {item.quantity} {item.unit} x {item.unitPrice.toLocaleString()} {config.currency}
                    </span>
                    <span className="font-bold text-slate-900">
                      {item.total.toLocaleString()} {config.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="py-2 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal Incidência IVA:</span>
                <span>{sale.subtotal.toLocaleString()} {config.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA ({config.defaultTaxRate}%):</span>
                <span>{sale.totalTax.toLocaleString()} {config.currency}</span>
              </div>
              {sale.serviceFeeAmount && sale.serviceFeeAmount > 0 ? (
                <div className="flex justify-between font-semibold">
                  <span>Taxa de Serviço:</span>
                  <span>+{sale.serviceFeeAmount.toLocaleString()} {config.currency}</span>
                </div>
              ) : null}

              <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL LIQUIDO:</span>
                <span>{sale.totalLiquido.toLocaleString()} {config.currency}</span>
              </div>
            </div>

            {/* Payments breakdown */}
            <div className="py-2 border-b border-dashed border-slate-300 space-y-0.5 text-[10px]">
              <div className="font-bold text-slate-500 mb-1">PAGAMENTOS EFETUADOS:</div>
              {sale.payments.map((p, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{p.method}:</span>
                  <span className="font-bold">{p.amount.toLocaleString()} {config.currency}</span>
                </div>
              ))}
              {sale.changeGiven > 0 && (
                <div className="flex justify-between font-bold text-emerald-700 pt-0.5">
                  <span>Troco Entregue:</span>
                  <span>{sale.changeGiven.toLocaleString()} {config.currency}</span>
                </div>
              )}
              {sale.debtAmountAdded > 0 && (
                <div className="flex justify-between font-bold text-amber-800 pt-0.5">
                  <span>Debitado em Fiado (C/C):</span>
                  <span>{sale.debtAmountAdded.toLocaleString()} {config.currency}</span>
                </div>
              )}
            </div>

            {/* Fiscal Footer & Simulated QR Code */}
            <div className="pt-3 text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-1 bg-white border border-slate-300 rounded inline-block">
                  <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white">
                    <QrCode size={48} className="text-white" />
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-500">
                Documento Processado por Computador Certificado Nº 142/AT/2026.
              </p>
              <p className="text-[9px] text-slate-400 font-sans">
                Obrigado pela preferência! Volte sempre.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2 print:hidden">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <ArrowLeft size={14} />
            <span>Fechar</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-xs transition"
            >
              <Printer size={14} />
              <span>Imprimir Talão (80mm)</span>
            </button>

            <button
              onClick={onNewSale}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition"
            >
              <CheckCircle2 size={14} />
              <span>Nova Venda</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
