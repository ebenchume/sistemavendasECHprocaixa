import React from 'react';
import { 
  Sliders, 
  Check, 
  RotateCcw, 
  Info, 
  Store, 
  ShoppingBag, 
  Stethoscope, 
  Sprout, 
  UtensilsCrossed, 
  Zap,
  Sparkles
} from 'lucide-react';
import { BusinessNiche, BusinessNicheConfig, BusinessFeatureFlags } from '../../types/business';
import { NICHE_CONFIGS } from '../../config/nicheConfigs';

interface NicheConfiguratorProps {
  currentNiche: BusinessNiche;
  nicheConfigs: Record<BusinessNiche, BusinessNicheConfig>;
  onSelectNiche: (niche: BusinessNiche) => void;
  onUpdateFlags: (flags: Partial<BusinessFeatureFlags>) => void;
  onResetNicheToDefaults: () => void;
}

export const NicheConfigurator: React.FC<NicheConfiguratorProps> = ({
  currentNiche,
  nicheConfigs,
  onSelectNiche,
  onUpdateFlags,
  onResetNicheToDefaults,
}) => {
  const activeConfig = nicheConfigs[currentNiche];

  const flagDescriptions: Record<keyof BusinessFeatureFlags, { title: string; desc: string; module: string }> = {
    enableTablesAndOrders: {
      title: 'Mesas & Comandas Eletrónicas',
      desc: 'Habilita mapa de salão, comandas abertas por mesa e controlo de consumo acumulado.',
      module: 'Restauração'
    },
    enableKitchenDisplay: {
      title: 'KDS - Kitchen Display System',
      desc: 'Exibe ecrã da cozinha com pedidos em tempo real por praça (Grelha, Forno, Bar).',
      module: 'Restauração'
    },
    enableServiceFee: {
      title: 'Taxa de Serviço Opcional (10%)',
      desc: 'Adiciona taxa de serviço automaticamente no fecho de contas de mesas.',
      module: 'Restauração'
    },
    enableBillSplitting: {
      title: 'Divisão de Conta por Pessoas',
      desc: 'Calculadora de divisão de conta por ocupantes da mesa com emissão de recibo individual.',
      module: 'Restauração'
    },
    enablePetPatients: {
      title: 'Registo de Animais Pacientes (Pet)',
      desc: 'Associa vendas a animais com nome, espécie, raça e tutor responsável.',
      module: 'Veterinária'
    },
    enableVeterinaryClinical: {
      title: 'Peso Corporal para Dosagem & Vacinas',
      desc: 'Permite registar o peso do animal no POS para conferência de dosagem e carteira de vacinas.',
      module: 'Veterinária'
    },
    enableFractionalQuantities: {
      title: 'Venda Fracionada (Decimais / Peso / Litro)',
      desc: 'Permite quantidades decimais como 1.450 kg de adubo ou 0.250 L de fertilizante.',
      module: 'Agropecuária'
    },
    enableAgroPrescriptionRetention: {
      title: 'Receituário Agronómico Retido Obrigatório',
      desc: 'Bloqueia venda de defensivos agrícolas até inserção da receita do engenheiro agrônomo.',
      module: 'Agropecuária'
    },
    enableBatchAndExpiryControl: {
      title: 'Rastreabilidade de Lotes & Validades',
      desc: 'Exige número de lote e data de expiração na venda e controlo de estoque.',
      module: 'Agro / Vet'
    },
    enableProductVariants: {
      title: 'Grade de Variantes (Cor, Tamanho, SKU)',
      desc: 'Permite selecionar tamanho (P/M/G) e cor do artigo antes de adicionar ao carrinho.',
      module: 'Retalho Geral'
    },
    enableQuickBarcodeScan: {
      title: 'Leitor Rápido de Código de Barras',
      desc: 'Foco contínuo e leitura em 1 clique para agilidade no caixa.',
      module: 'Retalho / Bancas'
    },
    enableTwoClickQuickSale: {
      title: 'Venda Expressa em 2 Cliques (Quiosque)',
      desc: 'Barra superior com artigos de alta rotação e pagamento instantâneo em dinheiro.',
      module: 'Bancas / Quiosques'
    },
    enableMultiUnitMeasure: {
      title: 'Multi-Unidades de Medida & Conversão',
      desc: 'Suporte a Unidade, Kg, Litro, Caixa, Saco de 50kg, Fardo com fator de conversão.',
      module: 'Stock Avançado'
    },
    enableLowStockAlerts: {
      title: 'Alertas de Stock Mínimo & Crítico',
      desc: 'Destaques visuais e contadores quando o stock atinge o nível mínimo estipulado.',
      module: 'Stock Avançado'
    },
    enableSplitPayments: {
      title: 'Múltiplos Meios de Pagamento na Venda',
      desc: 'Permite pagar parte em Dinheiro, parte em Cartão e parte em Fiado na mesma venda.',
      module: 'Frente de Caixa'
    },
    enableCustomerCreditFiado: {
      title: 'Venda Fiada / Conta Corrente de Cliente',
      desc: 'Permite debitar valor da compra na conta corrente do cliente com controlo de limite.',
      module: 'CRM & Fiado'
    },
    enableReceiptPrinting: {
      title: 'Emissão de Talão Térmico 80mm & Factura',
      desc: 'Layout térmico para impressoras de recibos com código QR fiscal e discriminativo legal.',
      module: 'Frente de Caixa'
    },
    enableCustomerLoyaltyPoints: {
      title: 'Programa de Pontos de Fidelização',
      desc: 'Gera pontos acumulados por cada compra efetuada pelo cliente cadastrado.',
      module: 'CRM'
    },
    enableCreditLimitEnforcement: {
      title: 'Bloqueio Rígido de Limite de Crédito Fiado',
      desc: 'Impede a conclusão da venda se a dívida do cliente ultrapassar o limite concedido.',
      module: 'CRM & Fiado'
    },
  };

  const getNicheIcon = (niche: BusinessNiche) => {
    switch (niche) {
      case 'retail':
        return <ShoppingBag size={20} />;
      case 'veterinary':
        return <Stethoscope size={20} />;
      case 'agriculture':
        return <Sprout size={20} />;
      case 'restaurant':
        return <UtensilsCrossed size={20} />;
      case 'kiosk':
        return <Zap size={20} />;
      default:
        return <Store size={20} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              MÓDULO 1
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Adaptação por Nicho & Motor de Feature Flags
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Escolha o ramo do negócio para reconfigurar a interface ou customize as funcionalidades ativas individualmente.
          </p>
        </div>

        <button
          onClick={onResetNicheToDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition self-start md:self-auto"
        >
          <RotateCcw size={13} />
          <span>Restaurar Padrões do Nicho</span>
        </button>
      </div>

      {/* 5 Niches Selector Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          1. Selecione o Nicho de Negócio Operacional:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.values(nicheConfigs) as BusinessNicheConfig[]).map((cfg) => {
            const isSelected = cfg.id === currentNiche;
            return (
              <div
                key={cfg.id}
                onClick={() => onSelectNiche(cfg.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {getNicheIcon(cfg.id)}
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ATIVO
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">{cfg.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-3 mb-3 leading-relaxed">
                    {cfg.tagline}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  {cfg.badges.map((b, idx) => (
                    <div key={idx} className="text-[10px] text-slate-600 flex items-center gap-1 font-medium">
                      <Check size={11} className="text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Flags Detailed Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sliders size={16} className="text-slate-600" />
              2. Painel de Feature Flags em Tempo Real (Módulos Ativos)
            </h3>
            <p className="text-xs text-slate-500">
              Você pode ligar ou desligar módulos específicos sem reiniciar o servidor.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {Object.values(activeConfig.flags).filter(Boolean).length} Módulos Ativos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(activeConfig.flags) as (keyof BusinessFeatureFlags)[]).map((flagKey) => {
            const isEnabled = activeConfig.flags[flagKey];
            const meta = flagDescriptions[flagKey];

            return (
              <div
                key={flagKey}
                onClick={() => onUpdateFlags({ [flagKey]: !isEnabled })}
                className={`p-3 rounded-xl border transition cursor-pointer select-none flex items-start justify-between gap-3 ${
                  isEnabled
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-slate-200 bg-slate-50/60 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {meta?.module || 'Core'}
                    </span>
                    <h5 className="font-bold text-xs text-slate-800 leading-tight">
                      {meta?.title || flagKey}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {meta?.desc}
                  </p>
                </div>

                <div className="mt-0.5">
                  <div
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
