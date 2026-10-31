import { CartItem, PaymentEntry, Sale } from '../types/pos';
import { Customer } from '../types/customer';
import { Product, ProductLot } from '../types/inventory';
import { BusinessNicheConfig } from '../types/business';

export interface CalculationResult {
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  serviceFeeAmount: number;
  totalLiquido: number;
  totalPaid: number;
  remainingDue: number;
  changeGiven: number;
  fiadoAmount: number;
}

export const POSEngine = {
  calculateTotals(
    items: CartItem[],
    config: BusinessNicheConfig,
    payments: PaymentEntry[] = []
  ): CalculationResult {
    let grossTotal = 0;
    let totalDiscount = 0;

    for (const item of items) {
      grossTotal += item.unitPrice * item.quantity;
      if (item.discount > 0) {
        totalDiscount += item.discount;
      }
    }

    const netBeforeTaxAndService = Math.max(0, grossTotal - totalDiscount);
    
    // Service fee (only if enabled, e.g. restaurant 10%)
    const serviceFeePercent = config.flags.enableServiceFee ? (config.serviceFeePercent || 0) : 0;
    const serviceFeeAmount = netBeforeTaxAndService * (serviceFeePercent / 100);

    // Default tax calculation (VAT included)
    // For 16% IVA: base = total / (1 + 0.16)
    const taxRateDecimal = config.defaultTaxRate / 100;
    const subtotal = netBeforeTaxAndService / (1 + taxRateDecimal);
    const totalTax = netBeforeTaxAndService - subtotal;
    
    const totalLiquido = netBeforeTaxAndService + serviceFeeAmount;

    // Payments tally
    let totalPaid = 0;
    let fiadoAmount = 0;

    for (const p of payments) {
      if (p.method === 'Fiado (Conta Corrente)') {
        fiadoAmount += p.amount;
      } else {
        totalPaid += p.amount;
      }
    }

    const totalCovered = totalPaid + fiadoAmount;
    const remainingDue = Math.max(0, totalLiquido - totalCovered);
    const changeGiven = totalPaid > (totalLiquido - fiadoAmount) ? (totalPaid - (totalLiquido - fiadoAmount)) : 0;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      serviceFeeAmount: Math.round(serviceFeeAmount * 100) / 100,
      totalLiquido: Math.round(totalLiquido * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      remainingDue: Math.round(remainingDue * 100) / 100,
      changeGiven: Math.round(changeGiven * 100) / 100,
      fiadoAmount: Math.round(fiadoAmount * 100) / 100,
    };
  },

  validateCustomerCredit(
    customer: Customer | null | undefined,
    fiadoAmount: number
  ): { allowed: boolean; message?: string } {
    if (fiadoAmount <= 0) return { allowed: true };
    if (!customer) {
      return { allowed: false, message: 'Para vendas a fiado, é obrigatório selecionar um cliente cadastrado.' };
    }
    const projectedBalance = customer.currentBalance + fiadoAmount;
    if (projectedBalance > customer.creditLimit) {
      return {
        allowed: false,
        message: `Limite de crédito excedido! Limite: ${customer.creditLimit.toLocaleString()} MTn. Saldo atual: ${customer.currentBalance.toLocaleString()} MTn. Disponível: ${Math.max(0, customer.creditLimit - customer.currentBalance).toLocaleString()} MTn.`
      };
    }
    return { allowed: true };
  },

  processSaleCompletion(
    items: CartItem[],
    calc: CalculationResult,
    payments: PaymentEntry[],
    config: BusinessNicheConfig,
    customer?: Customer | null,
    operatorName = 'Operador de Caixa',
    tableNumber?: string,
    comandaNumber?: string,
    observations?: string
  ): {
    sale: Sale;
    updatedProductsStock: { productId: string; newStock: number }[];
    updatedLotsStock: { lotId: string; newStock: number }[];
    customerBalanceDelta: number;
    customerLoyaltyPointsDelta: number;
  } {
    const saleId = 'sale-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5);
    const saleNumber = `FT ${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const sale: Sale = {
      id: saleId,
      saleNumber,
      documentType: 'Factura',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      niche: config.id,
      customerId: customer?.id,
      customerName: customer ? customer.name : 'Cliente Balcão Ocasional',
      customerTaxId: customer?.taxId,
      operatorId: 'usr-current',
      operatorName,
      tableNumber,
      comandaNumber,
      serviceFeeAmount: calc.serviceFeeAmount,
      items: [...items],
      subtotal: calc.subtotal,
      totalDiscount: calc.totalDiscount,
      totalTax: calc.totalTax,
      totalLiquido: calc.totalLiquido,
      payments: [...payments],
      amountPaid: calc.totalPaid,
      changeGiven: calc.changeGiven,
      debtAmountAdded: calc.fiadoAmount,
      status: 'Paga',
      observations,
    };

    // Calculate updated product stocks
    const updatedProductsStock: { productId: string; newStock: number }[] = [];
    const updatedLotsStock: { lotId: string; newStock: number }[] = [];

    // Group item quantities by product
    const qtyByProduct: Record<string, number> = {};
    const qtyByLot: Record<string, number> = {};

    for (const item of items) {
      qtyByProduct[item.productId] = (qtyByProduct[item.productId] || 0) + item.quantity;
      if (item.lotId) {
        qtyByLot[item.lotId] = (qtyByLot[item.lotId] || 0) + item.quantity;
      }
    }

    return {
      sale,
      updatedProductsStock,
      updatedLotsStock,
      customerBalanceDelta: calc.fiadoAmount,
      customerLoyaltyPointsDelta: Math.floor(calc.totalLiquido / 10), // 1 ponto por cada 10 MTn
    };
  }
};
