export interface ArchitectureSection {
  id: string;
  title: string;
  summary: string;
  content: string;
  language: string;
}

export const ARCHITECTURE_BLUEPRINTS: ArchitectureSection[] = [
  {
    id: 'db-schema-sql',
    title: '1. Desenho da Base de Dados (Relacional + JSONB Híbrido)',
    summary: 'Arquitetura híbrida Postgres/SQLite: Single Table Inheritance com coluna custom_metadata JSONB indexada com GIN, garantindo performance e flexibilidade total para atributos de veterinária, agricultura e restauração.',
    language: 'sql',
    content: `-- ============================================================================
-- ECHPRO UNIVERSAL: ESQUEMA DE BASE DE DADOS MULTISSECTORIAL
-- Suporta PostgreSQL 14+ (JSONB) e SQLite 3.38+ (JSON1)
-- ============================================================================

-- 1. TENANTS & CONFIGURAÇÃO DO NICHO DE NEGÓCIO
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50), -- NUIT / NIF / CNPJ
    niche_type VARCHAR(50) NOT NULL, -- 'retail', 'veterinary', 'agriculture', 'restaurant', 'kiosk'
    currency VARCHAR(10) DEFAULT 'MTn',
    active_feature_flags JSONB NOT NULL DEFAULT '{}'::jsonb,
    business_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CLIENTES, TUTORES & PRODUTORES (CRM UNIFICADO COM FIADO)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(150),
    address TEXT,
    credit_limit NUMERIC(15,2) NOT NULL DEFAULT 0.00,  -- Limite de compra a fiado
    current_balance NUMERIC(15,2) NOT NULL DEFAULT 0.00, -- Saldo devedor atual
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    custom_metadata JSONB DEFAULT '{}'::jsonb, -- Campos customizados por nicho
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_phone ON customers(tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_nuit ON customers(tenant_id, tax_id);

-- 3. MÓDULO VETERINÁRIO: ANIMAIS PACIENTES (EXTENSÃO DE CLIENTE)
CREATE TABLE IF NOT EXISTS vet_patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE, -- Tutor
    name VARCHAR(150) NOT NULL,
    species VARCHAR(50) NOT NULL, -- 'Cão', 'Gato', 'Bovino', 'Equino'
    breed VARCHAR(100),
    birth_date DATE,
    current_weight_kg NUMERIC(6,2), -- Crítico para cálculo de dosagens no POS
    microchip_number VARCHAR(100),
    allergies JSONB DEFAULT '[]'::jsonb,
    clinical_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vet_patients_customer ON vet_patients(customer_id);

-- 4. PRODUTOS & CATÁLOGO MULTISSECTORIAL COM JSONB
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    barcode VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    category_id UUID,
    base_unit VARCHAR(20) NOT NULL DEFAULT 'Un', -- 'Un', 'kg', 'L', 'saco', 'm'
    cost_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(15,2) NOT NULL,
    current_stock NUMERIC(15,4) NOT NULL DEFAULT 0.0000,
    minimum_stock NUMERIC(15,4) NOT NULL DEFAULT 0.0000,
    tax_percent NUMERIC(5,2) NOT NULL DEFAULT 16.00,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- METADADOS EXTENSÍVEIS POR NICHO (Exemplos):
    -- Retalho: {"variants": [{"sku": "A1", "size": "G", "color": "Azul"}]}
    -- Agro: {"is_agrochemical": true, "toxic_class": "II", "active_ingredient": "Glifosato", "requires_rx": true}
    -- Veterinária: {"is_vet_rx": true, "target_species": ["Cães", "Gatos"], "contraindications": "..."}
    -- Restaurante: {"kitchen_station": "Grelha", "prep_time_min": 15, "allergens": ["Glúten"]}
    niche_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(tenant_id, barcode);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(tenant_id, code);
CREATE INDEX IF NOT EXISTS idx_products_niche_meta ON products USING gin (niche_metadata);

-- 5. CONVERSÕES DE MULTI-UNIDADES DE MEDIDA (MÓDULO 2)
CREATE TABLE IF NOT EXISTS product_unit_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    unit VARCHAR(20) NOT NULL, -- ex: 'saco', 'fardo', 'cx'
    multiplier NUMERIC(12,4) NOT NULL, -- ex: 1 saco = 50 kg (multiplier = 50)
    barcode VARCHAR(100),
    custom_price NUMERIC(15,2)
);

-- 6. LOTES E DATAS DE VALIDADE (MÓDULO 2 - CRÍTICO PARA AGRO E VETERINÁRIA)
CREATE TABLE IF NOT EXISTS product_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    lot_number VARCHAR(100) NOT NULL,
    manufacturing_date DATE,
    expiration_date DATE NOT NULL,
    initial_quantity NUMERIC(15,4) NOT NULL,
    current_quantity NUMERIC(15,4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    supplier_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_product_lots_expiry ON product_lots(expiration_date);

-- 7. RECEITUÁRIO AGRONÓMICO RETIDO (MÓDULO 1: AGRO)
CREATE TABLE IF NOT EXISTS agro_prescriptions_retention (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    prescription_number VARCHAR(100) NOT NULL UNIQUE,
    agronomist_name VARCHAR(255) NOT NULL,
    professional_registration VARCHAR(100) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    target_crop VARCHAR(150) NOT NULL, -- Milho, Soja, Tomate
    target_pest_disease VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    archived_file_url TEXT,
    status VARCHAR(50) DEFAULT 'RETIDO_ARQUIVADO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. MESAS E COMANDAS ELETRÓNICAS (MÓDULO 1: RESTAURANTES)
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    table_number VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 4,
    status VARCHAR(50) DEFAULT 'LIVRE', -- 'LIVRE', 'OCUPADA', 'CONTA_SOLICITADA'
    active_order_data JSONB DEFAULT '{}'::jsonb
);

-- 9. VENDAS / FACTURAS (MÓDULO 3)
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sale_number VARCHAR(100) NOT NULL UNIQUE,
    document_type VARCHAR(50) DEFAULT 'Factura',
    niche_type VARCHAR(50) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    operator_id UUID NOT NULL,
    subtotal NUMERIC(15,2) NOT NULL,
    discount_amount NUMERIC(15,2) DEFAULT 0.00,
    tax_amount NUMERIC(15,2) NOT NULL,
    service_fee_amount NUMERIC(15,2) DEFAULT 0.00, -- 10% Mesa
    total_liquido NUMERIC(15,2) NOT NULL,
    amount_paid NUMERIC(15,2) NOT NULL,
    change_given NUMERIC(15,2) DEFAULT 0.00,
    debt_fiado_added NUMERIC(15,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Paga',
    
    -- Vínculos de contexto
    table_number VARCHAR(50),
    pet_id UUID REFERENCES vet_patients(id),
    agro_prescription_id UUID REFERENCES agro_prescriptions_retention(id),
    
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ITENS DA VENDA
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    lot_id UUID REFERENCES product_lots(id),
    variant_sku VARCHAR(100),
    quantity NUMERIC(12,4) NOT NULL, -- Suporta frações (ex: 1.450 kg de ração/adubo)
    unit VARCHAR(20) NOT NULL,
    unit_price NUMERIC(15,2) NOT NULL,
    cost_price NUMERIC(15,2) NOT NULL,
    tax_percent NUMERIC(5,2) DEFAULT 16.00,
    total NUMERIC(15,2) NOT NULL,
    item_metadata JSONB DEFAULT '{}'::jsonb
);

-- 11. PAGAMENTOS MULTI-FORMA (MÓDULO 3)
CREATE TABLE IF NOT EXISTS sale_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL, -- 'Dinheiro', 'Cartao', 'PIX', 'Fiado'
    amount NUMERIC(15,2) NOT NULL,
    reference_code VARCHAR(100),
    payment_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    id: 'folder-architecture',
    title: '2. Arquitetura de Pastas (Clean Modular / Feature-Based)',
    summary: 'Estruturação recomendada para separar Frontend, Backend e Módulos de Domínio sem acoplamento, usando vertical slice architecture.',
    language: 'markdown',
    content: `## Estrutura Recomendada do Projeto ECHpro Universal

\`\`\`
echpro-universal/
├── backend/                             # API Backend (Node.js / Express ou C# ASP.NET Core)
│   ├── src/
│   │   ├── config/                      # Conexão DB, Variáveis de Ambiente, Auth
│   │   ├── core/                        # Núcleo compartilhado
│   │   │   ├── database/                # Migrations, Schemas, ORM
│   │   │   ├── feature-flags/           # Motor de Feature Flags por Tenant
│   │   │   ├── middlewares/             # Auth, TenantContext, AuditLog
│   │   │   └── errors/                  # Tratamento de exceções e respostas standard
│   │   │
│   │   ├── modules/                     # Vertical Slices por Domínio
│   │   │   ├── pos/                     # Módulo 3: Ponto de Venda & Pagamentos
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/            # Checkout, Split Payment, Troco, Talão
│   │   │   │   └── pos.routes.ts
│   │   │   │
│   │   │   ├── inventory/               # Módulo 2: Stock, Lotes & Multi-Unidades
│   │   │   │   ├── services/            # LotTracker, UnitConverter, StockAuditor
│   │   │   │   └── inventory.routes.ts
│   │   │   │
│   │   │   ├── customers/               # Módulo 4: CRM, Fiado & Contas Correntes
│   │   │   │   ├── services/            # CreditChecker, DebtSettlement, Loyalty
│   │   │   │   └── customer.routes.ts
│   │   │   │
│   │   │   └── niches/                  # Módulo 1: Plugins Especializados de Nicho
│   │   │       ├── restaurant/          # Mesas, Comandas, KDS, Taxa Serviço 10%
│   │   │       ├── veterinary/          # Fichas Clínicas, Pacientes, Vacinas, Receitas
│   │   │       ├── agriculture/         # Receituário Agronómico Retido, Defensivos
│   │   │       └── retail-kiosk/        # Variantes (SKU/Cor/Tam), Venda Rápida 2-Cliques
│   │   └── server.ts                    # Entrypoint da aplicação
│   │
├── frontend/                            # Single Page Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── config/                      # Matriz de Feature Flags e Niche Configs
│   │   ├── core/                        # Componentes globais de UI (Button, Modal, Input)
│   │   ├── hooks/                       # useFeatureFlags, usePOS, useCurrentNiche
│   │   ├── modules/                     # Componentes visuais organizados por funcionalidade
│   │   │   ├── pos/                     # Telas de Caixa, Catálogo, Carrinho, Pagamento
│   │   │   ├── inventory/               # Gestão de Stock, Lotes e Conversor de Unidades
│   │   │   ├── customers/               # CRM, Extrato de Fiado, Quitação de Dívida
│   │   │   ├── restaurant/              # Mapa de Mesas, KDS da Cozinha
│   │   │   ├── veterinary/              # Modal de Paciente Pet, Carteira de Vacinas
│   │   │   └── agriculture/             # Validação de Receita Fitossanitária
│   │   ├── services/                    # ApiClient, Impressão de Talões, LocalStorage
│   │   └── App.tsx                      # Orquestrador Dinâmico
│   │
└── shared/                              # Tipos TypeScript compartilhados (DTOs, Enums)
    ├── business.types.ts
    ├── inventory.types.ts
    └── pos.types.ts
\`\`\`
`
  },
  {
    id: 'feature-flag-engine',
    title: '3. Motor de Feature Flags e Processamento Dinâmico de Venda',
    summary: 'Implementação de Backend e Frontend que adapta a validação de regras de negócio em tempo de execução dependendo do nicho ativo.',
    language: 'typescript',
    content: `// ============================================================================
// BACKEND: SERVIÇO DE PROCESSAMENTO DE VENDA DINÂMICA
// Adapta validações e cálculos conforme as Feature Flags do Tenant
// ============================================================================

import { Request, Response } from 'express';

export async function processSaleController(req: Request, res: Response) {
  const tenant = req.tenant; // Injetado via middleware com flags do nicho
  const { items, payments, customerId, tableId, petId, agroPrescriptionNumber } = req.body;

  // 1. Validação Condicional: Nicho Agropecuária (Defensivo com Receita Retida)
  if (tenant.flags.enableAgroPrescriptionRetention) {
    const hasPesticide = items.some((i: any) => i.isAgrochemical);
    if (hasPesticide && !agroPrescriptionNumber) {
      return res.status(400).json({
        error: 'VENDA_BLOQUEADA',
        message: 'A venda contém defensivos agrícolas sujeitos a receituário agronómico retido obrigatório!'
      });
    }
  }

  // 2. Validação Condicional: Nicho Veterinário (Associação do Paciente Animal)
  if (tenant.flags.enablePetPatients) {
    const hasControlledMed = items.some((i: any) => i.requiresVetPrescription);
    if (hasControlledMed && !petId) {
      return res.status(400).json({
        error: 'PACIENTE_OBRIGATORIO',
        message: 'Medicamentos veterinários controlados exigem a vinculação de um paciente animal cadastrado.'
      });
    }
  }

  // 3. Validação Condicional: Módulo 4 - Fiado e Limite de Crédito
  const fiadoEntry = payments.find((p: any) => p.method === 'Fiado');
  if (fiadoEntry && fiadoEntry.amount > 0) {
    if (!customerId) {
      return res.status(400).json({ error: 'Cliente obrigatório para pagamento a fiado.' });
    }
    const customer = await getCustomerById(customerId);
    if (customer.currentBalance + fiadoEntry.amount > customer.creditLimit) {
      return res.status(400).json({
        error: 'LIMITE_CREDITO_EXCEDIDO',
        message: \`Limite disponível de \${customer.creditLimit - customer.currentBalance} MTn ultrapassado!\`
      });
    }
  }

  // 4. Cálculo com Taxa de Serviço Dinâmica (Restaurantes)
  let subtotal = calculateSubtotal(items);
  let serviceFee = 0;
  if (tenant.flags.enableServiceFee) {
    serviceFee = subtotal * 0.10; // 10%
  }
  const totalLiquido = subtotal + serviceFee;

  // 5. Execução em Transação ACID (Dedução de Stock e Lotes)
  await database.transaction(async (trx) => {
    // Grava Venda
    const sale = await trx('sales').insert({
      tenant_id: tenant.id,
      total_liquido: totalLiquido,
      service_fee_amount: serviceFee,
      customer_id: customerId,
      pet_id: petId,
      status: 'Paga'
    });

    // Abate de Stock por Lote (se flag ativa)
    for (const item of items) {
      if (tenant.flags.enableBatchAndExpiryControl && item.lotId) {
        await trx('product_lots')
          .where({ id: item.lotId })
          .decrement('current_quantity', item.quantity);
      }
      await trx('products')
        .where({ id: item.productId })
        .decrement('current_stock', item.quantity);
    }

    // Se restaurante, liberta a mesa ou atualiza status
    if (tenant.flags.enableTablesAndOrders && tableId) {
      await trx('restaurant_tables')
        .where({ id: tableId })
        .update({ status: 'LIVRE', active_order_data: null });
    }
  });

  return res.json({ success: true, message: 'Venda processada com sucesso!' });
}`
  }
];
