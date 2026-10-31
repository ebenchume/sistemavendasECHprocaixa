import { Product, ProductLot } from '../types/inventory';
import { Customer, PetPatient, AgroPrescriptionRetention } from '../types/customer';
import { RestaurantTable, KitchenTicket, Sale } from '../types/pos';
import { AppUser } from '../types/user';

export const INITIAL_PRODUCTS: Product[] = [
  // --- RETALHO (RETAIL) ---
  {
    id: 'prod-ret-1',
    code: 'CAM-001',
    name: 'Camisa Polo Piquet Clássica',
    category: 'Vestuário',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 450,
    salePrice: 1250,
    currentStock: 42,
    minimumStock: 10,
    barcode: '7891234567890',
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      brand: 'ECH Signature',
      variants: [
        { id: 'var-1', productId: 'prod-ret-1', sku: 'CAM-001-AZ-M', name: 'Azul Marinho / M', attributes: { cor: 'Azul Marinho', tamanho: 'M' }, stock: 15, priceModifier: 0 },
        { id: 'var-2', productId: 'prod-ret-1', sku: 'CAM-001-AZ-G', name: 'Azul Marinho / G', attributes: { cor: 'Azul Marinho', tamanho: 'G' }, stock: 12, priceModifier: 0 },
        { id: 'var-3', productId: 'prod-ret-1', sku: 'CAM-001-PR-M', name: 'Preto / M', attributes: { cor: 'Preto', tamanho: 'M' }, stock: 10, priceModifier: 0 },
        { id: 'var-4', productId: 'prod-ret-1', sku: 'CAM-001-PR-GG', name: 'Preto / GG', attributes: { cor: 'Preto', tamanho: 'GG' }, stock: 5, priceModifier: 100 },
      ]
    }
  },
  {
    id: 'prod-ret-2',
    code: 'FON-002',
    name: 'Fone Bluetooth Pro Noise Cancelling',
    category: 'Eletrónicos',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 1200,
    salePrice: 2800,
    currentStock: 8,
    minimumStock: 5,
    barcode: '7899876543210',
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      brand: 'Acoustic Sound',
      variants: [
        { id: 'var-fon-1', productId: 'prod-ret-2', sku: 'FON-002-BLK', name: 'Matte Black', attributes: { cor: 'Preto Fosco' }, stock: 5, priceModifier: 0 },
        { id: 'var-fon-2', productId: 'prod-ret-2', sku: 'FON-002-WHT', name: 'Ice White', attributes: { cor: 'Branco Gelo' }, stock: 3, priceModifier: 0 },
      ]
    }
  },
  {
    id: 'prod-ret-3',
    code: 'CAL-003',
    name: 'Calça Jeans Slim Stretch',
    category: 'Vestuário',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 650,
    salePrice: 1850,
    currentStock: 3, // Stock baixo alerta!
    minimumStock: 6,
    barcode: '7894561230123',
    taxPercent: 16,
    isActive: true,
  },

  // --- VETERINÁRIA & PET SHOP ---
  {
    id: 'prod-vet-1',
    code: 'VAC-010',
    name: 'Vacina Canina Nobivac DHPPi + L4',
    category: 'Vacinas & Imunização',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 280,
    salePrice: 750,
    currentStock: 25,
    minimumStock: 10,
    barcode: '7891112223334',
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      isVeterinaryMedicine: true,
      requiresVetPrescription: true,
      targetSpecies: ['Cães'],
      contraindications: 'Não aplicar em fêmeas gestantes ou animais debilitados.'
    }
  },
  {
    id: 'prod-vet-2',
    code: 'ANT-020',
    name: 'Bravecto Comprimido Mastigável (10kg a 20kg)',
    category: 'Antiparasitários',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 950,
    salePrice: 1950,
    currentStock: 14,
    minimumStock: 5,
    barcode: '7895556667778',
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      isVeterinaryMedicine: true,
      requiresVetPrescription: false,
      targetSpecies: ['Cães'],
      contraindications: 'Dose calculada pelo peso corporal exato do cão (10-20kg).'
    }
  },
  {
    id: 'prod-vet-3',
    code: 'RAC-030',
    name: 'Ração Hill\'s Prescription Diet k/d Renal 12kg',
    category: 'Nutrição Clínica',
    baseUnit: 'saco',
    allowedUnits: [
      { unit: 'saco', multiplier: 1 },
      { unit: 'kg', multiplier: 1/12, priceModifier: 320 } // venda fracionada a granel
    ],
    costPrice: 1900,
    salePrice: 3450,
    currentStock: 9,
    minimumStock: 4,
    barcode: '7899998887776',
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      targetSpecies: ['Cães'],
    }
  },

  // --- AGROPECUÁRIA & AGRICULTURA ---
  {
    id: 'prod-agro-1',
    code: 'DEF-100',
    name: 'Herbicida Glifosato 480 SL Concentrado',
    category: 'Defensivos Agrícolas',
    baseUnit: 'L',
    allowedUnits: [
      { unit: 'L', multiplier: 1 },
      { unit: 'ml', multiplier: 0.001 },
      { unit: 'fardo', multiplier: 12, priceModifier: 5200 } // Fardo com 12L
    ],
    costPrice: 220,
    salePrice: 480,
    currentStock: 350,
    minimumStock: 50,
    barcode: '7893334445556',
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      isAgrochemical: true,
      activeIngredient: 'Glifosato 480g/L',
      agronomicPrescriptionRequired: true, // EXIGE RECEITA RETIDA!
      toxicologicalClass: 'II - Altamente Tóxico',
      safetyIntervalDays: 14,
    }
  },
  {
    id: 'prod-agro-2',
    code: 'ADU-200',
    name: 'Fertilizante Mineral Composto NPK 12-24-12',
    category: 'Fertilizantes & Nutrição de Solo',
    baseUnit: 'kg',
    allowedUnits: [
      { unit: 'kg', multiplier: 1 },
      { unit: 'saco', multiplier: 50, priceModifier: 2250 } // Saco de 50kg
    ],
    costPrice: 28,
    salePrice: 48,
    currentStock: 2500, // 2500 kg (50 sacas)
    minimumStock: 500,
    barcode: '7897778889990',
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      isAgrochemical: false,
    }
  },
  {
    id: 'prod-agro-3',
    code: 'SEM-300',
    name: 'Semente Milho Híbrido Alta Produtividade SC719',
    category: 'Sementes Certificadas',
    baseUnit: 'saco',
    allowedUnits: [
      { unit: 'saco', multiplier: 1 }, // 25kg (50.000 sementes)
      { unit: 'kg', multiplier: 0.04, priceModifier: 160 }
    ],
    costPrice: 1800,
    salePrice: 3200,
    currentStock: 18,
    minimumStock: 10,
    barcode: '7894441112223',
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      isAgrochemical: false,
    }
  },

  // --- RESTAURAÇÃO / BARES & RESTAURANTES ---
  {
    id: 'prod-rest-1',
    code: 'PRT-001',
    name: 'Bife à Portuguesa com Ovo a Cavalo e Fritas',
    category: 'Pratos Principais',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 180,
    salePrice: 650,
    currentStock: 999,
    minimumStock: 20,
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      kitchenStation: 'Grelha',
      preparationTimeMinutes: 18,
      allergens: ['Ovos', 'Glúten']
    }
  },
  {
    id: 'prod-rest-2',
    code: 'PRT-002',
    name: 'Pizza Artesanal Margherita no Forno a Lenha',
    category: 'Pizzas & Forno',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 220,
    salePrice: 780,
    currentStock: 999,
    minimumStock: 15,
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      kitchenStation: 'Fornos',
      preparationTimeMinutes: 15,
      allergens: ['Glúten', 'Laticínios']
    }
  },
  {
    id: 'prod-rest-3',
    code: 'BEB-001',
    name: 'Cerveja Especial 2M Garrafa 550ml Gelada',
    category: 'Bebidas Alcoólicas',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 65,
    salePrice: 130,
    currentStock: 180,
    minimumStock: 48,
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      kitchenStation: 'Bar',
      preparationTimeMinutes: 2,
    }
  },
  {
    id: 'prod-rest-4',
    code: 'BEB-002',
    name: 'Sumo Natural de Maracujá com Hortelã 500ml',
    category: 'Bebidas Sem Álcool',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 35,
    salePrice: 120,
    currentStock: 999,
    minimumStock: 30,
    taxPercent: 16,
    isActive: true,
    nicheSpecific: {
      kitchenStation: 'Bar',
      preparationTimeMinutes: 5,
    }
  },

  // --- BANCAS & QUIOSQUES ---
  {
    id: 'prod-kio-1',
    code: 'NOT-001',
    name: 'Jornal Notícias - Edição Diária',
    category: 'Jornais & Periódicos',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 35,
    salePrice: 50,
    currentStock: 80,
    minimumStock: 15,
    barcode: '9771234567001',
    taxPercent: 0, // Isento de IVA
    isActive: true,
  },
  {
    id: 'prod-kio-2',
    code: 'AGU-001',
    name: 'Água Mineral da Namaacha 500ml',
    category: 'Bebidas Rápidas',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 20,
    salePrice: 40,
    currentStock: 64,
    minimumStock: 20,
    barcode: '6001234567890',
    taxPercent: 16,
    isActive: true,
  },
  {
    id: 'prod-kio-3',
    code: 'HAL-001',
    name: 'Pastilha Halls Mentol Extra Forte',
    category: 'Conveniência & Snacks',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 12,
    salePrice: 25,
    currentStock: 120,
    minimumStock: 30,
    barcode: '7622210123456',
    taxPercent: 16,
    isActive: true,
  },
  {
    id: 'prod-kio-4',
    code: 'REC-100',
    name: 'Recarga Telefónica Vodacom 100 MTn',
    category: 'Recargas & Serviços',
    baseUnit: 'Un',
    allowedUnits: [{ unit: 'Un', multiplier: 1 }],
    costPrice: 95,
    salePrice: 100,
    currentStock: 200,
    minimumStock: 50,
    barcode: '8901234567010',
    taxPercent: 16,
    isActive: true,
  }
];

export const INITIAL_LOTS: ProductLot[] = [
  {
    id: 'lot-vet-1',
    productId: 'prod-vet-1',
    lotNumber: 'LT-NOB-2026A',
    manufacturingDate: '2026-01-10',
    expirationDate: '2027-04-30',
    initialQuantity: 30,
    currentQuantity: 25,
    unit: 'Un',
    notes: 'Conservar sob refrigeração entre 2°C e 8°C.'
  },
  {
    id: 'lot-vet-2',
    productId: 'prod-vet-2',
    lotNumber: 'LT-BRV-8842',
    manufacturingDate: '2025-11-15',
    expirationDate: '2027-11-15',
    initialQuantity: 20,
    currentQuantity: 14,
    unit: 'Un',
    notes: 'Comprimido mastigável sabor fígado.'
  },
  {
    id: 'lot-agro-1',
    productId: 'prod-agro-1',
    lotNumber: 'LT-GLIF-2026-04',
    manufacturingDate: '2026-02-01',
    expirationDate: '2028-02-01',
    initialQuantity: 500,
    currentQuantity: 350,
    unit: 'L',
    notes: 'Lote aprovado no laudo fitossanitário nacional.'
  },
  {
    id: 'lot-agro-2',
    productId: 'prod-agro-2',
    lotNumber: 'LT-NPK-991',
    manufacturingDate: '2026-01-15',
    expirationDate: '2026-11-30', // Vence em breve!
    initialQuantity: 3000,
    currentQuantity: 2500,
    unit: 'kg',
    notes: 'Armazenar em local seco e ventilado sobre estrados.'
  },
  {
    id: 'lot-agro-3',
    productId: 'prod-agro-3',
    lotNumber: 'LT-SEM-SC-012',
    manufacturingDate: '2025-12-01',
    expirationDate: '2026-12-15',
    initialQuantity: 30,
    currentQuantity: 18,
    unit: 'saco',
    notes: 'Germinação 98% comprovada em laboratório.'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Carlos Alberto Mondlane',
    taxId: '109283746',
    phone: '+258 84 123 4567',
    email: 'carlos.mondlane@email.com',
    address: 'Av. Julius Nyerere, 1420',
    city: 'Maputo',
    creditLimit: 15000,
    currentBalance: 3200, // Já tem 3200 MTn fiado pendente
    loyaltyPoints: 340,
    isActive: true,
    createdAt: '2025-08-14',
    notes: 'Cliente preferencial. Pagamento pontual no final do mês.'
  },
  {
    id: 'cust-2',
    name: 'Dra. Maria Fernanda Santos',
    taxId: '204918273',
    phone: '+258 82 987 6543',
    email: 'maria.fernanda@clinica.mz',
    address: 'Rua das Acácias, 88',
    city: 'Matola',
    creditLimit: 25000,
    currentBalance: 0,
    loyaltyPoints: 890,
    isActive: true,
    createdAt: '2025-05-10',
    notes: 'Tutor de 2 cães de raça (Pastor Alemão e Golden Retriever).'
  },
  {
    id: 'cust-3',
    name: 'Cooperativa Agrícola Vale do Incomáti',
    taxId: '401928374',
    phone: '+258 87 555 1212',
    email: 'compras@valeincomati.co.mz',
    address: 'Estrada Nacional nº 1, km 45',
    city: 'Marracuene',
    creditLimit: 80000,
    currentBalance: 18500, // Dívida fiada de fertilizantes
    loyaltyPoints: 120,
    isActive: true,
    createdAt: '2025-01-20',
    notes: 'Produtores de cereais e hortícolas com receituário agronómico registrado.'
  },
  {
    id: 'cust-4',
    name: 'Cliente Balcão Ocasional',
    taxId: '999999999',
    phone: '',
    email: '',
    creditLimit: 0, // Sem crédito fiado
    currentBalance: 0,
    loyaltyPoints: 0,
    isActive: true,
    createdAt: '2025-01-01',
    notes: 'Consumidor final não identificado.'
  }
];

export const INITIAL_PETS: PetPatient[] = [
  {
    id: 'pet-1',
    customerId: 'cust-2', // Maria Fernanda
    name: 'Thor',
    species: 'Cão',
    breed: 'Pastor Alemão',
    birthDate: '2023-04-10',
    weightKg: 34.5,
    microchipNumber: '985141001239876',
    allergies: ['Frango'],
    medicalNotes: 'Displasia coxofemoral leve sob controlo. Vermifugação em dia.',
    vaccines: [
      {
        id: 'vac-log-1',
        vaccineName: 'Nobivac DHPPi + L4',
        applicationDate: '2025-10-15',
        nextDueDate: '2026-10-15',
        appliedBy: 'Dra. Luísa Cossa (CRV 142)',
        batchNumber: 'LT-NOB-2025Z'
      },
      {
        id: 'vac-log-2',
        vaccineName: 'Nobivac Raiva',
        applicationDate: '2025-10-15',
        nextDueDate: '2026-10-15',
        appliedBy: 'Dra. Luísa Cossa (CRV 142)',
        batchNumber: 'LT-RAI-771'
      }
    ]
  },
  {
    id: 'pet-2',
    customerId: 'cust-1', // Carlos
    name: 'Mia',
    species: 'Gato',
    breed: 'Siamês',
    birthDate: '2024-02-18',
    weightKg: 3.8,
    microchipNumber: '985141009944112',
    medicalNotes: 'Castrada. Excelente estado nutricional.',
    vaccines: [
      {
        id: 'vac-log-3',
        vaccineName: 'Tríplice Felina FVRCP',
        applicationDate: '2026-01-20',
        nextDueDate: '2027-01-20',
        appliedBy: 'Dr. Tomás Macamo',
        batchNumber: 'LT-FEL-402'
      }
    ]
  }
];

export const INITIAL_AGRO_PRESCRIPTIONS: AgroPrescriptionRetention[] = [
  {
    id: 'agro-rx-1',
    prescriptionNumber: 'REC-AGRO-2026/089',
    issuingAgronomist: 'Eng. António Machel',
    professionalId: 'ORDEM-AGRO-0421',
    targetCrop: 'Milho e Feijão Nhemba',
    targetPestOrDisease: 'Controlo pré-emergente de infestantes de folha larga',
    customerNuitOrCpf: '401928374',
    issueDate: '2026-03-12',
    status: 'RETIDO_ARQUIVADO',
    notes: 'Receita original retida na pasta fiscal A-14 conforme decreto fitossanitário.'
  }
];

export const INITIAL_TABLES: RestaurantTable[] = [
  {
    id: 'tbl-1',
    tableNumber: 'Mesa 01',
    name: 'Mesa 01 - Salão Principal',
    capacity: 4,
    status: 'OCUPADA',
    activeComandaNumber: 'CMD-101',
    waiterName: 'João Silva',
    openedAt: '12:30',
    customerCount: 3,
    serviceFeePercent: 10,
    items: [
      {
        id: 'item-tbl-1',
        productId: 'prod-rest-1',
        code: 'PRT-001',
        name: 'Bife à Portuguesa com Ovo a Cavalo',
        unit: 'Un',
        quantity: 2,
        unitPrice: 650,
        costPrice: 180,
        discount: 0,
        taxPercent: 16,
        total: 1300,
        kitchenStation: 'Grelha',
        kitchenNotes: 'Bifes bem passados, por favor.',
        kitchenStatus: 'Preparando'
      },
      {
        id: 'item-tbl-2',
        productId: 'prod-rest-3',
        code: 'BEB-001',
        name: 'Cerveja Especial 2M Garrafa 550ml',
        unit: 'Un',
        quantity: 3,
        unitPrice: 130,
        costPrice: 65,
        discount: 0,
        taxPercent: 16,
        total: 390,
        kitchenStation: 'Bar',
        kitchenStatus: 'Servido'
      }
    ]
  },
  {
    id: 'tbl-2',
    tableNumber: 'Mesa 02',
    name: 'Mesa 02 - Janela',
    capacity: 2,
    status: 'CONTA_SOLICITADA',
    activeComandaNumber: 'CMD-102',
    waiterName: 'Marta Bila',
    openedAt: '12:15',
    customerCount: 2,
    serviceFeePercent: 10,
    items: [
      {
        id: 'item-tbl-3',
        productId: 'prod-rest-2',
        code: 'PRT-002',
        name: 'Pizza Artesanal Margherita',
        unit: 'Un',
        quantity: 1,
        unitPrice: 780,
        costPrice: 220,
        discount: 0,
        taxPercent: 16,
        total: 780,
        kitchenStation: 'Fornos',
        kitchenStatus: 'Pronto'
      },
      {
        id: 'item-tbl-4',
        productId: 'prod-rest-4',
        code: 'BEB-002',
        name: 'Sumo Natural de Maracujá',
        unit: 'Un',
        quantity: 2,
        unitPrice: 120,
        costPrice: 35,
        discount: 0,
        taxPercent: 16,
        total: 240,
        kitchenStation: 'Bar',
        kitchenStatus: 'Servido'
      }
    ]
  },
  {
    id: 'tbl-3',
    tableNumber: 'Mesa 03',
    name: 'Mesa 03 - Centro',
    capacity: 6,
    status: 'LIVRE',
    items: []
  },
  {
    id: 'tbl-4',
    tableNumber: 'Esplanada 01',
    name: 'Esplanada Jardim',
    capacity: 4,
    status: 'LIVRE',
    items: []
  },
  {
    id: 'tbl-5',
    tableNumber: 'Mesa VIP',
    name: 'Camarote Reservado',
    capacity: 8,
    status: 'RESERVADA',
    items: []
  }
];

export const INITIAL_KDS_TICKETS: KitchenTicket[] = [
  {
    id: 'kds-1',
    saleOrTableId: 'tbl-1',
    tableNumber: 'Mesa 01',
    orderNumber: 'PED-4091',
    customerName: 'Mesa 01 (3 pessoas)',
    openedAt: '12:32',
    status: 'EM_PREPARO',
    station: 'Grelha',
    urgency: 'NORMAL',
    items: [
      { name: '2x Bife à Portuguesa c/ Ovo a Cavalo', quantity: 2, notes: 'Bem passados', completed: false }
    ]
  },
  {
    id: 'kds-2',
    saleOrTableId: 'tbl-2',
    tableNumber: 'Mesa 02',
    orderNumber: 'PED-4088',
    customerName: 'Mesa 02',
    openedAt: '12:20',
    status: 'PRONTO',
    station: 'Fornos',
    urgency: 'NORMAL',
    items: [
      { name: '1x Pizza Artesanal Margherita', quantity: 1, notes: 'Borda crocante', completed: true }
    ]
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-001',
    saleNumber: 'FT 2026/00142',
    documentType: 'Factura',
    date: '2026-10-31 10:15',
    niche: 'veterinary',
    customerId: 'cust-2',
    customerName: 'Dra. Maria Fernanda Santos',
    customerTaxId: '204918273',
    operatorId: 'usr-1',
    operatorName: 'Caixa Central (Operador 01)',
    items: [
      {
        id: 'item-101',
        productId: 'prod-vet-2',
        code: 'ANT-020',
        name: 'Bravecto Comprimido Mastigável (10kg a 20kg)',
        unit: 'Un',
        quantity: 1,
        unitPrice: 1950,
        costPrice: 950,
        discount: 0,
        taxPercent: 16,
        total: 1950,
        lotNumber: 'LT-BRV-8842',
        expiryDate: '2027-11-15',
        petName: 'Thor (Pastor Alemão)',
        petWeightKg: 34.5
      }
    ],
    subtotal: 1681.03,
    totalDiscount: 0,
    totalTax: 268.97,
    totalLiquido: 1950,
    payments: [
      { method: 'Cartão', amount: 1950, referenceNumber: 'TPA-99381' }
    ],
    amountPaid: 1950,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga',
    observations: 'Venda de medicamento veterinário associado ao paciente Thor.'
  },
  {
    id: 'sale-002',
    saleNumber: 'FT 2026/00143',
    documentType: 'Factura',
    date: '2026-10-31 11:40',
    niche: 'retail',
    customerId: 'cust-1',
    customerName: 'Carlos Alberto Mondlane',
    customerTaxId: '109283746',
    operatorId: 'usr-1',
    operatorName: 'Caixa Central (Operador 01)',
    items: [
      {
        id: 'item-102',
        productId: 'prod-ret-1',
        code: 'CAM-001',
        name: 'Camisa Polo Piquet Clássica',
        unit: 'Un',
        quantity: 1,
        unitPrice: 1250,
        costPrice: 450,
        discount: 0,
        taxPercent: 16,
        total: 1250,
        variantLabel: 'Azul Marinho / M'
      }
    ],
    subtotal: 1077.59,
    totalDiscount: 0,
    totalTax: 172.41,
    totalLiquido: 1250,
    payments: [
      { method: 'Dinheiro', amount: 500 },
      { method: 'Fiado (Conta Corrente)', amount: 750 }
    ],
    amountPaid: 500,
    changeGiven: 0,
    debtAmountAdded: 750,
    status: 'Paga',
    observations: 'Entrada de 500 MTn e saldo a fiado.'
  },
  {
    id: 'sale-003',
    saleNumber: 'FT 2026/00144',
    documentType: 'Factura',
    date: '2026-10-30 14:20',
    niche: 'agriculture',
    customerId: 'cust-3',
    customerName: 'Cooperativa Agrícola Vale do Incomáti',
    customerTaxId: '401928374',
    operatorId: 'usr-1',
    operatorName: 'Caixa Central',
    items: [
      {
        id: 'item-103',
        productId: 'prod-agro-2',
        code: 'ADU-200',
        name: 'Fertilizante Mineral Composto NPK 12-24-12',
        unit: 'saco',
        quantity: 10,
        unitPrice: 2250,
        costPrice: 1400,
        discount: 0,
        taxPercent: 16,
        total: 22500,
      },
      {
        id: 'item-104',
        productId: 'prod-agro-1',
        code: 'DEF-100',
        name: 'Herbicida Glifosato 480 SL Concentrado',
        unit: 'L',
        quantity: 15,
        unitPrice: 480,
        costPrice: 220,
        discount: 0,
        taxPercent: 16,
        total: 7200,
        lotNumber: 'LT-GLIF-2026-04',
        agroPrescriptionNumber: 'REC-AGRO-2026/089'
      }
    ],
    subtotal: 25603.45,
    totalDiscount: 0,
    totalTax: 4096.55,
    totalLiquido: 29700,
    payments: [
      { method: 'Transferência', amount: 15000 },
      { method: 'Fiado (Conta Corrente)', amount: 14700 }
    ],
    amountPaid: 15000,
    changeGiven: 0,
    debtAmountAdded: 14700,
    status: 'Paga'
  },
  {
    id: 'sale-004',
    saleNumber: 'FT 2026/00145',
    documentType: 'Factura',
    date: '2026-10-29 20:30',
    niche: 'restaurant',
    customerId: 'cust-1',
    customerName: 'Carlos Alberto Mondlane',
    operatorId: 'usr-2',
    operatorName: 'Garçom João Silva',
    tableNumber: 'Mesa 01',
    items: [
      {
        id: 'item-105',
        productId: 'prod-rest-1',
        code: 'PRT-001',
        name: 'Bife à Portuguesa com Ovo a Cavalo',
        unit: 'Un',
        quantity: 2,
        unitPrice: 650,
        costPrice: 180,
        discount: 0,
        taxPercent: 16,
        total: 1300,
      },
      {
        id: 'item-106',
        productId: 'prod-rest-3',
        code: 'BEB-001',
        name: 'Cerveja Especial 2M Garrafa 550ml',
        unit: 'Un',
        quantity: 4,
        unitPrice: 130,
        costPrice: 65,
        discount: 0,
        taxPercent: 16,
        total: 520,
      }
    ],
    subtotal: 1568.97,
    totalDiscount: 0,
    totalTax: 251.03,
    serviceFeeAmount: 182,
    totalLiquido: 2002,
    payments: [
      { method: 'Cartão', amount: 2002 }
    ],
    amountPaid: 2002,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga'
  },
  {
    id: 'sale-005',
    saleNumber: 'FT 2026/00146',
    documentType: 'Talão de Venda',
    date: '2026-10-28 09:15',
    niche: 'kiosk',
    customerName: 'Cliente Balcão Ocasional',
    operatorId: 'usr-1',
    operatorName: 'Operador Quiosque',
    items: [
      {
        id: 'item-107',
        productId: 'prod-kio-1',
        code: 'NOT-001',
        name: 'Jornal Notícias - Edição Diária',
        unit: 'Un',
        quantity: 2,
        unitPrice: 50,
        costPrice: 35,
        discount: 0,
        taxPercent: 0,
        total: 100,
      },
      {
        id: 'item-108',
        productId: 'prod-kio-2',
        code: 'AGU-001',
        name: 'Água Mineral da Namaacha 500ml',
        unit: 'Un',
        quantity: 2,
        unitPrice: 40,
        costPrice: 20,
        discount: 0,
        taxPercent: 16,
        total: 80,
      },
      {
        id: 'item-109',
        productId: 'prod-kio-4',
        code: 'REC-100',
        name: 'Recarga Telefónica Vodacom 100 MTn',
        unit: 'Un',
        quantity: 1,
        unitPrice: 100,
        costPrice: 95,
        discount: 0,
        taxPercent: 16,
        total: 100,
      }
    ],
    subtotal: 241.38,
    totalDiscount: 0,
    totalTax: 38.62,
    totalLiquido: 280,
    payments: [
      { method: 'Dinheiro', amount: 300 }
    ],
    amountPaid: 300,
    changeGiven: 20,
    debtAmountAdded: 0,
    status: 'Paga'
  },
  {
    id: 'sale-006',
    saleNumber: 'FT 2026/00147',
    documentType: 'Factura',
    date: '2026-10-27 16:45',
    niche: 'retail',
    customerId: 'cust-2',
    customerName: 'Dra. Maria Fernanda Santos',
    customerTaxId: '204918273',
    operatorId: 'usr-1',
    operatorName: 'Caixa Central',
    items: [
      {
        id: 'item-110',
        productId: 'prod-ret-2',
        code: 'FON-002',
        name: 'Fone Bluetooth Pro Noise Cancelling',
        unit: 'Un',
        quantity: 1,
        unitPrice: 2800,
        costPrice: 1200,
        discount: 0,
        taxPercent: 16,
        total: 2800,
        variantLabel: 'Matte Black'
      },
      {
        id: 'item-111',
        productId: 'prod-ret-3',
        code: 'CAL-003',
        name: 'Calça Jeans Slim Stretch',
        unit: 'Un',
        quantity: 2,
        unitPrice: 1850,
        costPrice: 650,
        discount: 0,
        taxPercent: 16,
        total: 3700,
      }
    ],
    subtotal: 5603.45,
    totalDiscount: 0,
    totalTax: 896.55,
    totalLiquido: 6500,
    payments: [
      { method: 'Cartão', amount: 6500 }
    ],
    amountPaid: 6500,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga'
  },
  {
    id: 'sale-007',
    saleNumber: 'FT 2026/00148',
    documentType: 'Factura',
    date: '2026-10-25 11:10',
    niche: 'veterinary',
    customerId: 'cust-1',
    customerName: 'Carlos Alberto Mondlane',
    operatorId: 'usr-1',
    operatorName: 'Caixa Central',
    items: [
      {
        id: 'item-112',
        productId: 'prod-vet-1',
        code: 'VAC-010',
        name: 'Vacina Canina Nobivac DHPPi + L4',
        unit: 'Un',
        quantity: 2,
        unitPrice: 750,
        costPrice: 280,
        discount: 0,
        taxPercent: 16,
        total: 1500,
        lotNumber: 'LT-NOB-2026A',
        petName: 'Mia (Siamês)'
      },
      {
        id: 'item-113',
        productId: 'prod-vet-3',
        code: 'RAC-030',
        name: 'Ração Hill\'s Prescription Diet k/d Renal 12kg',
        unit: 'saco',
        quantity: 1,
        unitPrice: 3450,
        costPrice: 1900,
        discount: 0,
        taxPercent: 16,
        total: 3450,
      }
    ],
    subtotal: 4267.24,
    totalDiscount: 0,
    totalTax: 682.76,
    totalLiquido: 4950,
    payments: [
      { method: 'PIX / Carteira Digital', amount: 4950 }
    ],
    amountPaid: 4950,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga'
  },
  {
    id: 'sale-008',
    saleNumber: 'FT 2026/00149',
    documentType: 'Factura',
    date: '2026-10-20 18:30',
    niche: 'restaurant',
    customerName: 'Mesa 02 (Janela)',
    tableNumber: 'Mesa 02',
    operatorId: 'usr-2',
    operatorName: 'Garçom Marta Bila',
    items: [
      {
        id: 'item-114',
        productId: 'prod-rest-2',
        code: 'PRT-002',
        name: 'Pizza Artesanal Margherita',
        unit: 'Un',
        quantity: 3,
        unitPrice: 780,
        costPrice: 220,
        discount: 0,
        taxPercent: 16,
        total: 2340,
      },
      {
        id: 'item-115',
        productId: 'prod-rest-4',
        code: 'BEB-002',
        name: 'Sumo Natural de Maracujá',
        unit: 'Un',
        quantity: 4,
        unitPrice: 120,
        costPrice: 35,
        discount: 0,
        taxPercent: 16,
        total: 480,
      }
    ],
    subtotal: 2431.03,
    totalDiscount: 0,
    totalTax: 388.97,
    serviceFeeAmount: 282,
    totalLiquido: 3102,
    payments: [
      { method: 'Cartão', amount: 3102 }
    ],
    amountPaid: 3102,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga'
  },
  // Histórico Mensal Anterior (Setembro 2026)
  {
    id: 'sale-009',
    saleNumber: 'FT 2026/00098',
    documentType: 'Factura',
    date: '2026-09-28 15:00',
    niche: 'agriculture',
    customerId: 'cust-3',
    customerName: 'Cooperativa Agrícola Vale do Incomáti',
    operatorId: 'usr-1',
    operatorName: 'Caixa Central',
    items: [
      {
        id: 'item-116',
        productId: 'prod-agro-3',
        code: 'SEM-300',
        name: 'Semente Milho Híbrido Alta Produtividade SC719',
        unit: 'saco',
        quantity: 12,
        unitPrice: 3200,
        costPrice: 1800,
        discount: 0,
        taxPercent: 16,
        total: 38400,
        lotNumber: 'LT-SEM-SC-012'
      }
    ],
    subtotal: 33103.45,
    totalDiscount: 0,
    totalTax: 5296.55,
    totalLiquido: 38400,
    payments: [
      { method: 'Transferência', amount: 38400 }
    ],
    amountPaid: 38400,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga'
  },
  {
    id: 'sale-010',
    saleNumber: 'FT 2026/00099',
    documentType: 'Factura',
    date: '2026-09-15 11:30',
    niche: 'retail',
    customerId: 'cust-1',
    customerName: 'Carlos Alberto Mondlane',
    operatorId: 'usr-1',
    operatorName: 'Caixa Central',
    items: [
      {
        id: 'item-117',
        productId: 'prod-ret-1',
        code: 'CAM-001',
        name: 'Camisa Polo Piquet Clássica',
        unit: 'Un',
        quantity: 3,
        unitPrice: 1250,
        costPrice: 450,
        discount: 0,
        taxPercent: 16,
        total: 3750,
      }
    ],
    subtotal: 3232.76,
    totalDiscount: 0,
    totalTax: 517.24,
    totalLiquido: 3750,
    payments: [
      { method: 'Dinheiro', amount: 3750 }
    ],
    amountPaid: 3750,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga'
  },
  // Histórico Mensal Anterior (Agosto 2026)
  {
    id: 'sale-011',
    saleNumber: 'FT 2026/00065',
    documentType: 'Factura',
    date: '2026-08-20 14:00',
    niche: 'veterinary',
    customerId: 'cust-2',
    customerName: 'Dra. Maria Fernanda Santos',
    operatorId: 'usr-1',
    operatorName: 'Caixa Central',
    items: [
      {
        id: 'item-118',
        productId: 'prod-vet-2',
        code: 'ANT-020',
        name: 'Bravecto Comprimido Mastigável (10kg a 20kg)',
        unit: 'Un',
        quantity: 2,
        unitPrice: 1950,
        costPrice: 950,
        discount: 0,
        taxPercent: 16,
        total: 3900,
      }
    ],
    subtotal: 3362.07,
    totalDiscount: 0,
    totalTax: 537.93,
    totalLiquido: 3900,
    payments: [
      { method: 'Cartão', amount: 3900 }
    ],
    amountPaid: 3900,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga'
  },
  {
    id: 'sale-012',
    saleNumber: 'FT 2026/00066',
    documentType: 'Factura',
    date: '2026-08-12 19:40',
    niche: 'restaurant',
    customerName: 'Mesa 03',
    tableNumber: 'Mesa 03',
    operatorId: 'usr-2',
    operatorName: 'Garçom João Silva',
    items: [
      {
        id: 'item-119',
        productId: 'prod-rest-1',
        code: 'PRT-001',
        name: 'Bife à Portuguesa com Ovo a Cavalo',
        unit: 'Un',
        quantity: 4,
        unitPrice: 650,
        costPrice: 180,
        discount: 0,
        taxPercent: 16,
        total: 2600,
      },
      {
        id: 'item-120',
        productId: 'prod-rest-3',
        code: 'BEB-001',
        name: 'Cerveja Especial 2M Garrafa 550ml',
        unit: 'Un',
        quantity: 8,
        unitPrice: 130,
        costPrice: 65,
        discount: 0,
        taxPercent: 16,
        total: 1040,
      }
    ],
    subtotal: 3137.93,
    totalDiscount: 0,
    totalTax: 502.07,
    serviceFeeAmount: 364,
    totalLiquido: 4004,
    payments: [
      { method: 'Cartão', amount: 4004 }
    ],
    amountPaid: 4004,
    changeGiven: 0,
    debtAmountAdded: 0,
    status: 'Paga'
  }
];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-1',
    name: 'Dr. Mário Cossa',
    username: 'admin',
    email: 'mario.cossa@echpro.mz',
    phone: '+258 84 100 0001',
    role: 'ADMIN',
    roleLabel: 'Administrador do Sistema',
    pinCode: '1234',
    isActive: true,
    avatarColor: 'from-indigo-600 to-purple-600',
    assignedNiche: 'ALL',
    lastLogin: '2026-10-31 08:30',
    createdAt: '2025-01-15',
    permissions: {
      canOpenCloseCashRegister: true,
      canApplyCustomDiscount: true,
      canCancelSales: true,
      canManageStock: true,
      canManageCreditAndDebt: true,
      canViewFinancialReports: true,
      canManageUsers: true,
      canChangeNicheAndSettings: true,
    }
  },
  {
    id: 'usr-2',
    name: 'Carla Mabote',
    username: 'carla.mabote',
    email: 'carla.mabote@echpro.mz',
    phone: '+258 82 200 0002',
    role: 'GERENTE',
    roleLabel: 'Gerente Geral de Loja',
    pinCode: '2244',
    isActive: true,
    avatarColor: 'from-emerald-600 to-teal-600',
    assignedNiche: 'ALL',
    lastLogin: '2026-10-31 09:15',
    createdAt: '2025-02-01',
    permissions: {
      canOpenCloseCashRegister: true,
      canApplyCustomDiscount: true,
      canCancelSales: true,
      canManageStock: true,
      canManageCreditAndDebt: true,
      canViewFinancialReports: true,
      canManageUsers: false,
      canChangeNicheAndSettings: false,
    }
  },
  {
    id: 'usr-3',
    name: 'Paulo Sitóe',
    username: 'paulo.pos',
    email: 'paulo.sitoe@echpro.mz',
    phone: '+258 87 300 0003',
    role: 'OPERADOR',
    roleLabel: 'Operador de Caixa Principal',
    pinCode: '0000',
    isActive: true,
    avatarColor: 'from-amber-600 to-orange-600',
    assignedNiche: 'ALL',
    lastLogin: '2026-10-31 10:00',
    createdAt: '2025-03-10',
    permissions: {
      canOpenCloseCashRegister: true,
      canApplyCustomDiscount: false,
      canCancelSales: false,
      canManageStock: false,
      canManageCreditAndDebt: false,
      canViewFinancialReports: false,
      canManageUsers: false,
      canChangeNicheAndSettings: false,
    }
  },
  {
    id: 'usr-4',
    name: 'Dra. Luísa Bila',
    username: 'luisa.vet',
    email: 'luisa.bila@echpro.mz',
    phone: '+258 84 400 0004',
    role: 'ESPECIALISTA',
    roleLabel: 'Médica Veterinária Residente',
    pinCode: '9988',
    isActive: true,
    avatarColor: 'from-cyan-600 to-blue-600',
    assignedNiche: 'veterinary',
    lastLogin: '2026-10-30 16:40',
    createdAt: '2025-04-12',
    permissions: {
      canOpenCloseCashRegister: false,
      canApplyCustomDiscount: false,
      canCancelSales: false,
      canManageStock: true,
      canManageCreditAndDebt: false,
      canViewFinancialReports: false,
      canManageUsers: false,
      canChangeNicheAndSettings: false,
    }
  }
];

