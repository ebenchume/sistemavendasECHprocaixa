import React, { useState } from 'react';
import { 
  Database, 
  FolderTree, 
  Code2, 
  Layers, 
  Copy, 
  Check, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Cpu
} from 'lucide-react';
import { ARCHITECTURE_BLUEPRINTS } from '../../types/architecture';
import { NICHE_CONFIGS } from '../../config/nicheConfigs';

export const ArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'database' | 'folders' | 'code' | 'matrix'>('database');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const dbBlueprint = ARCHITECTURE_BLUEPRINTS.find((b) => b.id === 'db-schema-sql');
  const folderBlueprint = ARCHITECTURE_BLUEPRINTS.find((b) => b.id === 'folder-architecture');
  const codeBlueprint = ARCHITECTURE_BLUEPRINTS.find((b) => b.id === 'feature-flag-engine');

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              BLUEPRINT ARQUITETURAL
            </span>
            <h2 className="text-xl font-bold">
              Especificação Técnica & Arquitetura de Software
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Desenho da base de dados (PostgreSQL JSONB / SQLite), organização de pastas por domínios e motor de execução.
          </p>
        </div>

        {/* Tab Switchers */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700/80 text-xs font-medium">
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'database'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Database size={14} />
            <span>1. Base de Dados (SQL)</span>
          </button>

          <button
            onClick={() => setActiveTab('folders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'folders'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FolderTree size={14} />
            <span>2. Arquitetura de Pastas</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Code2 size={14} />
            <span>3. Backend & Core Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>4. Matriz de Feature Flags</span>
          </button>
        </div>
      </div>

      {/* Content Panels */}
      {activeTab === 'database' && dbBlueprint && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">{dbBlueprint.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{dbBlueprint.summary}</p>
            </div>
            <button
              onClick={() => handleCopy(dbBlueprint.content, 'sql')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition self-start sm:self-auto"
            >
              {copiedId === 'sql' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedId === 'sql' ? 'Copiado para a Área de Transferência!' : 'Copiar Esquema SQL'}</span>
            </button>
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[600px]">
            <pre>{dbBlueprint.content}</pre>
          </div>
        </div>
      )}

      {activeTab === 'folders' && folderBlueprint && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">{folderBlueprint.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{folderBlueprint.summary}</p>
            </div>
            <button
              onClick={() => handleCopy(folderBlueprint.content, 'folders')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition self-start sm:self-auto"
            >
              {copiedId === 'folders' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedId === 'folders' ? 'Copiado!' : 'Copiar Árvore'}</span>
            </button>
          </div>

          <div className="bg-slate-950 text-emerald-400 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            <pre>{folderBlueprint.content}</pre>
          </div>
        </div>
      )}

      {activeTab === 'code' && codeBlueprint && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">{codeBlueprint.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{codeBlueprint.summary}</p>
            </div>
            <button
              onClick={() => handleCopy(codeBlueprint.content, 'code')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition self-start sm:self-auto"
            >
              {copiedId === 'code' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedId === 'code' ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[600px]">
            <pre>{codeBlueprint.content}</pre>
          </div>
        </div>
      )}

      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900">
              Matriz Comparativa de Nichos x Funcionalidades Ativas
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mapeamento de ativação automática de regras de negócio, campos de base de dados e componentes UI por tipo de nicho.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Funcionalidade / Módulo</th>
                  <th className="py-3 px-3 text-center">🛒 Retalho</th>
                  <th className="py-3 px-3 text-center">🐾 Veterinária</th>
                  <th className="py-3 px-3 text-center">🌱 Agropecuária</th>
                  <th className="py-3 px-3 text-center">🍽️ Restaurantes</th>
                  <th className="py-3 px-3 text-center">📰 Bancas/Quiosques</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Mesas & Comandas Eletrónicas', flags: ['restaurant'] },
                  { name: 'KDS - Kitchen Display System', flags: ['restaurant'] },
                  { name: 'Taxa de Serviço Automática (10%)', flags: ['restaurant'] },
                  { name: 'Divisão de Conta por Pessoas', flags: ['restaurant'] },
                  { name: 'Registo de Pacientes Animais (Pet/Tutor)', flags: ['veterinary'] },
                  { name: 'Peso Corporal p/ Dosagem & Vacinas', flags: ['veterinary'] },
                  { name: 'Venda Fracionada (Decimais / Peso / L)', flags: ['veterinary', 'agriculture'] },
                  { name: 'Receituário Agronómico Retido Obrigatório', flags: ['agriculture'] },
                  { name: 'Rastreabilidade de Lotes & Validades', flags: ['veterinary', 'agriculture'] },
                  { name: 'Grade de Variantes (Cor, Tamanho, SKU)', flags: ['retail'] },
                  { name: 'Leitura Rápida de Código de Barras', flags: ['retail', 'veterinary', 'agriculture', 'kiosk'] },
                  { name: 'Venda Expressa em 2 Cliques (Alta Rotação)', flags: ['kiosk'] },
                  { name: 'Multi-Unidades (Un, kg, L, cx, saco)', flags: ['retail', 'veterinary', 'agriculture'] },
                  { name: 'Alertas de Stock Mínimo & Crítico', flags: ['retail', 'veterinary', 'agriculture', 'restaurant', 'kiosk'] },
                  { name: 'Múltiplos Métodos na Mesma Venda', flags: ['retail', 'veterinary', 'agriculture', 'restaurant', 'kiosk'] },
                  { name: 'Venda a Fiado com Limite de Crédito', flags: ['retail', 'veterinary', 'agriculture', 'restaurant', 'kiosk'] },
                  { name: 'Emissão de Talão Térmico 80mm & Factura', flags: ['retail', 'veterinary', 'agriculture', 'restaurant', 'kiosk'] },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{row.name}</td>
                    {(['retail', 'veterinary', 'agriculture', 'restaurant', 'kiosk'] as const).map((n) => {
                      const active = row.flags.includes(n);
                      return (
                        <td key={n} className="py-2.5 px-3 text-center">
                          {active ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
