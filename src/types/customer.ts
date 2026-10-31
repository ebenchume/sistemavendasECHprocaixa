export interface PetPatient {
  id: string;
  customerId: string; // Tutor ID
  name: string;
  species: 'Cão' | 'Gato' | 'Bovino' | 'Equino' | 'Ave' | 'Outro';
  breed: string;
  birthDate?: string;
  weightKg: number; // Peso actual para dosagem
  microchipNumber?: string;
  allergies?: string[];
  medicalNotes?: string;
  vaccines: {
    id: string;
    vaccineName: string;
    applicationDate: string;
    nextDueDate: string;
    appliedBy: string;
    batchNumber: string;
  }[];
}

export interface AgroPrescriptionRetention {
  id: string;
  prescriptionNumber: string;
  issuingAgronomist: string; // Nome do Engenheiro Agrónomo
  professionalId: string;   // Registro profissional / CREA / Ordem
  targetCrop: string;       // Cultura (ex: Milho, Tomate, Soja, Hortícolas)
  targetPestOrDisease: string; // Praga ou Doença combatida
  customerNuitOrCpf: string;
  issueDate: string;
  receiptNumber?: string;
  status: 'RETIDO_ARQUIVADO' | 'PENDENTE';
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  taxId?: string; // NUIT / NIF / CNPJ / CPF
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  creditLimit: number;    // Limite máximo permitido para compras a fiado
  currentBalance: number; // Saldo devedor atual (quanto deve à empresa)
  loyaltyPoints: number;  // Saldo de pontos no programa de fidelidade
  isActive: boolean;
  notes?: string;
  createdAt: string;
  
  // Specific Relations (optional loaded or linked)
  pets?: PetPatient[];
}

export interface DebtPaymentReceipt {
  id: string;
  customerId: string;
  customerName: string;
  amountPaid: number;
  previousBalance: number;
  newBalance: number;
  paymentMethod: 'Dinheiro' | 'Cartao' | 'Transferencia' | 'PIX';
  date: string;
  operatorName: string;
  receiptNumber: string;
  notes?: string;
}
