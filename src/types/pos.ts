import { UnitOfMeasure } from './inventory';

export type PaymentMethodType = 
  | 'Dinheiro'
  | 'Cartão'
  | 'PIX / Carteira Digital'
  | 'Transferência'
  | 'Fiado (Conta Corrente)';

export interface PaymentEntry {
  method: PaymentMethodType;
  amount: number;
  referenceNumber?: string;
}

export interface CartItem {
  id: string; // unique item line id
  productId: string;
  code: string;
  name: string;
  unit: UnitOfMeasure;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  discount: number; // percentage or fixed
  taxPercent: number;
  total: number;
  
  // Niche Specific metadata
  variantId?: string;
  variantLabel?: string;
  lotId?: string;
  lotNumber?: string;
  expiryDate?: string;
  
  // Veterinary
  petId?: string;
  petName?: string;
  petWeightKg?: number;
  dosageNotes?: string;
  
  // Agriculture
  isAgrochemical?: boolean;
  agroPrescriptionNumber?: string;
  
  // Restaurant
  kitchenStation?: string;
  kitchenNotes?: string;
  kitchenStatus?: 'Pendente' | 'Preparando' | 'Pronto' | 'Servido';
}

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  name: string;
  capacity: number;
  status: 'LIVRE' | 'OCUPADA' | 'CONTA_SOLICITADA' | 'RESERVADA';
  activeComandaNumber?: string;
  waiterName?: string;
  openedAt?: string;
  items: CartItem[];
  customerCount?: number;
  serviceFeePercent?: number; // e.g. 10%
}

export interface KitchenTicket {
  id: string;
  saleOrTableId: string;
  tableNumber?: string;
  orderNumber: string;
  customerName?: string;
  openedAt: string;
  status: 'NOVO' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE';
  station?: string;
  items: {
    name: string;
    quantity: number;
    notes?: string;
    completed: boolean;
  }[];
  urgency: 'NORMAL' | 'URGENTE';
}

export interface Sale {
  id: string;
  saleNumber: string; // e.g. FT 2026/00142
  documentType: 'Factura' | 'Talão de Venda' | 'Nota de Crédito';
  date: string;
  niche: string;
  
  // Customer & Operator
  customerId?: string;
  customerName: string;
  customerTaxId?: string;
  operatorId: string;
  operatorName: string;
  
  // Restaurant Specific
  tableNumber?: string;
  comandaNumber?: string;
  serviceFeeAmount?: number;
  
  // Financial Totals
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalLiquido: number;
  
  // Payments
  payments: PaymentEntry[];
  amountPaid: number;
  changeGiven: number;
  debtAmountAdded: number; // if fiado used
  
  status: 'Paga' | 'Pendente' | 'Cancelada';
  observations?: string;
}
