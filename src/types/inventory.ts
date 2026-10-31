export type UnitOfMeasure = 'Un' | 'kg' | 'g' | 'L' | 'ml' | 'cx' | 'saco' | 'fardo' | 'm';

export interface UnitConversion {
  unit: UnitOfMeasure;
  multiplier: number; // e.g. 1 Caixa = 12 Un (multiplier: 12), 1 Saco = 50 kg (multiplier: 50)
  barcode?: string;
  priceModifier?: number; // optional custom unit price
}

export interface ProductLot {
  id: string;
  productId: string;
  lotNumber: string;
  manufacturingDate?: string; // YYYY-MM-DD
  expirationDate: string;    // YYYY-MM-DD
  initialQuantity: number;
  currentQuantity: number;
  unit: UnitOfMeasure;
  notes?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string; // e.g., "Azul / GG" ou "Preto / 128GB"
  attributes: Record<string, string>; // { cor: 'Azul', tamanho: 'GG' }
  stock: number;
  priceModifier: number; // additional or specific price
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  baseUnit: UnitOfMeasure;
  allowedUnits: UnitConversion[];
  costPrice: number;
  salePrice: number;
  currentStock: number;
  minimumStock: number;
  barcode?: string;
  taxPercent: number; // e.g. 16% IVA
  isActive: boolean;
  image?: string;
  
  // Dynamic Niche Fields (JSON / metadata)
  nicheSpecific?: {
    // Retalho
    variants?: ProductVariant[];
    brand?: string;
    
    // Agropecuária
    isAgrochemical?: boolean; // Defensivo agrícola?
    activeIngredient?: string; // Princípio ativo
    agronomicPrescriptionRequired?: boolean; // Exige receituário agronómico retido
    toxicologicalClass?: 'I - Extremamente Tóxico' | 'II - Altamente Tóxico' | 'III - Moderadamente Tóxico' | 'IV - Pouco Tóxico';
    safetyIntervalDays?: number; // Período de carência em dias
    
    // Veterinária
    isVeterinaryMedicine?: boolean; // Medicamento veterinário
    requiresVetPrescription?: boolean;
    targetSpecies?: ('Cães' | 'Gatos' | 'Bovinos' | 'Equinos' | 'Aves' | 'Suínos')[];
    contraindications?: string;
    
    // Restauração
    kitchenStation?: 'Grelha' | 'Bar' | 'Fornos' | 'Sobremesas' | 'Copa';
    preparationTimeMinutes?: number;
    allergens?: string[];
  };
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  lotId?: string;
  lotNumber?: string;
  type: 'IN_PURCHASE' | 'OUT_SALE' | 'ADJUST_LOSS' | 'ADJUST_GAIN' | 'RETURN';
  quantity: number;
  unit: UnitOfMeasure;
  date: string;
  referenceDoc?: string;
  operatorName: string;
  notes?: string;
}
