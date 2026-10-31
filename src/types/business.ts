export type BusinessNiche = 
  | 'retail'        // Lojas / Retalho Geral
  | 'veterinary'    // Veterinárias & Pet Shops
  | 'agriculture'   // Agropecuária / Agricultura
  | 'restaurant'    // Bares & Restaurantes
  | 'kiosk';        // Bancas / Quiosques / Conveniência Rápida

export interface BusinessFeatureFlags {
  // Módulo 1: Adaptações de Nicho
  enableTablesAndOrders: boolean;       // Mesas e comandas eletrónicas (Restaurantes)
  enableKitchenDisplay: boolean;        // KDS - Kitchen Display System (Restaurantes)
  enableServiceFee: boolean;            // Taxa de serviço (Restaurantes - ex: 10%)
  enableBillSplitting: boolean;         // Divisão de conta entre clientes (Restaurantes)
  enablePetPatients: boolean;           // Registo de animais pacientes e tutores (Veterinária)
  enableVeterinaryClinical: boolean;    // Histórico clínico, peso e vacinas (Veterinária)
  enableFractionalQuantities: boolean;  // Venda por peso/fração decimal (Agro: kg, Litros)
  enableAgroPrescriptionRetention: boolean; // Receituário agronómico retido para defensivos (Agro)
  enableBatchAndExpiryControl: boolean; // Rastreio obrigatório de Lote e Data de Validade (Agro, Vet)
  enableProductVariants: boolean;       // Grade de variantes de produto: cor, tamanho, voltagem (Retalho)
  enableQuickBarcodeScan: boolean;      // Leitor rápido de código de barras em foco contínuo (Retalho, Bancas)
  enableTwoClickQuickSale: boolean;     // Venda expressa em 2 cliques com botões de notas rápidas (Bancas)
  
  // Módulo 2: Stock
  enableMultiUnitMeasure: boolean;      // Unidades múltiplas (Un, Kg, Litro, Caixa, Saco, Fardo)
  enableLowStockAlerts: boolean;        // Notificações e badges de stock mínimo e crítico
  
  // Módulo 3: POS e Pagamentos
  enableSplitPayments: boolean;         // Múltiplos pagamentos combinados na mesma venda
  enableCustomerCreditFiado: boolean;   // Venda a Fiado / Conta corrente com limite de crédito
  enableReceiptPrinting: boolean;       // Impressão e talão térmico 80mm / Factura A4
  
  // Módulo 4: CRM
  enableCustomerLoyaltyPoints: boolean; // Pontos de fidelização
  enableCreditLimitEnforcement: boolean;// Bloquear fiado se ultrapassar limite de crédito
}

export interface BusinessNicheConfig {
  id: BusinessNiche;
  name: string;
  tagline: string;
  iconName: string;
  currency: string;
  defaultTaxRate: number; // ex: 16% IVA
  serviceFeePercent?: number; // ex: 10%
  primaryColor: string;
  badges: string[];
  flags: BusinessFeatureFlags;
  terminology: {
    itemLabel: string;
    itemsLabel: string;
    customerLabel: string;
    ticketLabel: string;
    specialActionLabel?: string;
  };
}
