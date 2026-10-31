import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CreditCard, 
  Calendar, 
  Filter, 
  Store, 
  Sprout, 
  Stethoscope, 
  UtensilsCrossed, 
  Zap, 
  Users,
  Award,
  Layers,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { Sale } from '../../types/pos';
import { BusinessNiche, BusinessNicheConfig } from '../../types/business';
import { NICHE_CONFIGS } from '../../config/nicheConfigs';

interface SalesDashboardProps {
  sales: Sale[];
  config: BusinessNicheConfig;
  currentNiche: BusinessNiche;
  onSelectNiche: (niche: BusinessNiche) => void;
}

const COLORS = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#3b82f6', // blue
];

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  sales,
  config,
  currentNiche,
  onSelectNiche,
}) => {
  // Niche filter state: 'ALL' or specific niche
  const [selectedNicheFilter, setSelectedNicheFilter] = useState<string>('ALL');
  // Period filter: 'all' | '30days' | '7days'
  const [periodFilter, setPeriodFilter] = useState<'all' | '30days' | '7days'>('all');

  // Filter sales according to selected niche and time range
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      // 1. Niche filter
      if (selectedNicheFilter !== 'ALL' && sale.niche !== selectedNicheFilter) {
        return false;
      }

      // 2. Date filter
      if (periodFilter !== 'all') {
        const saleDate = new Date(sale.date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - saleDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (periodFilter === '7days' && diffDays > 7) return false;
        if (periodFilter === '30days' && diffDays > 30) return false;
      }

      return true;
    });
  }, [sales, selectedNicheFilter, periodFilter]);

  // --- KPI CALCULATIONS ---
  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + s.totalLiquido, 0);
  }, [filteredSales]);

  const totalOrders = filteredSales.length;

  const averageTicket = useMemo(() => {
    return totalOrders > 0 ? totalRevenue / totalOrders : 0;
  }, [totalRevenue, totalOrders]);

  const totalFiadoDebt = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + s.debtAmountAdded, 0);
  }, [filteredSales]);

  const totalCashPaid = useMemo(() => {
    return Math.max(0, totalRevenue - totalFiadoDebt);
  }, [totalRevenue, totalFiadoDebt]);

  // --- CHART 1: DAILY SALES VOLUME (Faturamento Diário) ---
  const dailySalesData = useMemo(() => {
    const mapByDate: Record<string, { date: string; displayDate: string; faturamento: number; transacoes: number }> = {};

    filteredSales.forEach((sale) => {
      // Date format is "YYYY-MM-DD"
      const dateKey = sale.date.split(' ')[0] || sale.date.substring(0, 10);
      const parts = dateKey.split('-');
      const displayDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateKey;

      if (!mapByDate[dateKey]) {
        mapByDate[dateKey] = {
          date: dateKey,
          displayDate,
          faturamento: 0,
          transacoes: 0,
        };
      }
      mapByDate[dateKey].faturamento += sale.totalLiquido;
      mapByDate[dateKey].transacoes += 1;
    });

    // Sort chronologically
    return Object.values(mapByDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredSales]);

  // --- CHART 2: MONTHLY SALES VOLUME (Faturamento Mensal) ---
  const monthlySalesData = useMemo(() => {
    const monthNames: Record<string, string> = {
      '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
      '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
      '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
    };

    const mapByMonth: Record<string, { monthKey: string; mes: string; faturamento: number; pedidos: number }> = {};

    filteredSales.forEach((sale) => {
      const yearMonth = sale.date.substring(0, 7); // e.g. "2026-10"
      const [year, month] = yearMonth.split('-');
      const label = `${monthNames[month] || month}/${year.substring(2)}`;

      if (!mapByMonth[yearMonth]) {
        mapByMonth[yearMonth] = {
          monthKey: yearMonth,
          mes: label,
          faturamento: 0,
          pedidos: 0,
        };
      }
      mapByMonth[yearMonth].faturamento += sale.totalLiquido;
      mapByMonth[yearMonth].pedidos += 1;
    });

    return Object.values(mapByMonth).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }, [filteredSales]);

  // --- CHART 3: TOP SELLING PRODUCTS (Produtos Mais Vendidos) ---
  const topProductsData = useMemo(() => {
    const mapByProd: Record<string, { nome: string; quantidade: number; receita: number }> = {};

    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        const prodName = item.name.length > 22 ? item.name.substring(0, 22) + '...' : item.name;
        if (!mapByProd[item.productId]) {
          mapByProd[item.productId] = {
            nome: prodName,
            quantidade: 0,
            receita: 0,
          };
        }
        mapByProd[item.productId].quantidade += item.quantity;
        mapByProd[item.productId].receita += item.total;
      });
    });

    // Sort by total revenue generated descending and take top 7
    return Object.values(mapByProd)
      .sort((a, b) => b.receita - a.receita)
      .slice(0, 7);
  }, [filteredSales]);

  // --- CHART 4: PAYMENT METHODS BREAKDOWN ---
  const paymentMethodsData = useMemo(() => {
    const mapByMethod: Record<string, number> = {};

    filteredSales.forEach((sale) => {
      sale.payments.forEach((p) => {
        const label = p.method.includes('Fiado') ? 'Fiado (C/C)' : p.method;
        mapByMethod[label] = (mapByMethod[label] || 0) + p.amount;
      });
    });

    return Object.entries(mapByMethod).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [filteredSales]);

  // --- CHART 5: SALES BY NICHE BREAKDOWN ---
  const nicheBreakdownData = useMemo(() => {
    const mapByNiche: Record<string, number> = {};

    filteredSales.forEach((sale) => {
      const nicheCfg = NICHE_CONFIGS[sale.niche as BusinessNiche];
      const nicheName = nicheCfg ? nicheCfg.name.split('&')[0].trim() : sale.niche;
      mapByNiche[nicheName] = (mapByNiche[nicheName] || 0) + sale.totalLiquido;
    });

    return Object.entries(mapByNiche).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [filteredSales]);

  const getNicheIcon = (niche: string) => {
    switch (niche) {
      case 'retail':
        return <ShoppingBag size={14} />;
      case 'veterinary':
        return <Stethoscope size={14} />;
      case 'agriculture':
        return <Sprout size={14} />;
      case 'restaurant':
        return <UtensilsCrossed size={14} />;
      case 'kiosk':
        return <Zap size={14} />;
      default:
        return <Store size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner and Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
              <TrendingUp size={12} />
              BUSINESS INTELLIGENCE
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Dashboard de Vendas & Performance
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Análise em tempo real do faturamento diário, evolução mensal e artigos com maior volume de saída.
          </p>
        </div>

        {/* Niche & Period Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Niche Filter Pill Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedNicheFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedNicheFilter === 'ALL'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos os Nichos
            </button>
            {(Object.values(NICHE_CONFIGS) as BusinessNicheConfig[]).map((cfg) => (
              <button
                key={cfg.id}
                onClick={() => setSelectedNicheFilter(cfg.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition ${
                  selectedNicheFilter === cfg.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {getNicheIcon(cfg.id)}
                <span>{cfg.name.split('&')[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Period Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPeriodFilter('7days')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                periodFilter === '7days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setPeriodFilter('30days')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                periodFilter === '30days' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              30 Dias
            </button>
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                periodFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Histórico Completo
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
              Faturamento Total
            </span>
            <div className="text-2xl font-black text-slate-900">
              {totalRevenue.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">{config.currency}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
              <ArrowUpRight size={12} />
              {totalOrders} vendas realizadas
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Metric 2: Average Ticket */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
              Ticket Médio
            </span>
            <div className="text-2xl font-black text-slate-900">
              {Math.round(averageTicket).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">{config.currency}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              Valor médio por transação
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Metric 3: Cash & Liquid Paid */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
              Pronto Pagamento
            </span>
            <div className="text-2xl font-black text-emerald-700">
              {totalCashPaid.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">{config.currency}</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              Dinheiro, Cartão & M-Pesa ({totalRevenue > 0 ? Math.round((totalCashPaid / totalRevenue) * 100) : 0}%)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
        </div>

        {/* Metric 4: Fiado Debt Balance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
              Vendido a Fiado (C/C)
            </span>
            <div className="text-2xl font-black text-amber-700">
              {totalFiadoDebt.toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-500">{config.currency}</span>
            </div>
            <span className="text-[10px] text-amber-700 font-medium block mt-1">
              Contas a receber de clientes ({totalRevenue > 0 ? Math.round((totalFiadoDebt / totalRevenue) * 100) : 0}%)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Main Charts Row: Daily Sales & Monthly Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Volume Diário de Vendas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Calendar size={16} className="text-emerald-600" />
                Volume de Vendas Diário
              </h3>
              <p className="text-xs text-slate-500">
                Faturamento diário registrado no período selecionado
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {dailySalesData.length} dias c/ vendas
            </span>
          </div>

          <div className="h-64 w-full">
            {dailySalesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Nenhuma venda registrada no filtro selecionado.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} ${config.currency}`, 'Faturamento']}
                    labelFormatter={(label) => `Data: ${label}`}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="faturamento"
                    name="Faturamento"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorFaturamento)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Volume Mensal de Vendas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <BarChart3 size={16} className="text-indigo-600" />
                Volume de Vendas Mensal
              </h3>
              <p className="text-xs text-slate-500">
                Comparativo de faturamento acumulado mês a mês
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Evolução Temporal
            </span>
          </div>

          <div className="h-64 w-full">
            {monthlySalesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Nenhum dado mensal registrado.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      name === 'faturamento' ? `${Number(value).toLocaleString()} ${config.currency}` : value,
                      name === 'faturamento' ? 'Faturamento Total' : 'Nº Pedidos',
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="faturamento" name="faturamento" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Top Selling Products and Payment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Award size={16} className="text-amber-500" />
                Produtos Mais Vendidos (Top Produtos por Faturamento)
              </h3>
              <p className="text-xs text-slate-500">
                Artigos com maior receita agregada no nicho selecionado
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Top {topProductsData.length} Artigos
            </span>
          </div>

          <div className="h-72 w-full">
            {topProductsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Nenhum produto vendido no filtro selecionado.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="nome"
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    width={140}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      name === 'receita' ? `${Number(value).toLocaleString()} ${config.currency}` : value,
                      name === 'receita' ? 'Receita Total' : 'Qtd Vendida',
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="receita" name="receita" fill="#10b981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Payment Methods & Niche Breakdown (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <CreditCard size={16} className="text-purple-600" />
              {selectedNicheFilter === 'ALL' ? 'Faturamento por Nicho' : 'Meios de Pagamento'}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedNicheFilter === 'ALL'
                ? 'Distribuição entre os ramos de negócio'
                : 'Distribuição dos valores recebidos'}
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {selectedNicheFilter === 'ALL' ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nicheBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {nicheBreakdownData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} ${config.currency}`, 'Faturamento']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentMethodsData.map((_, index) => (
                      <Cell key={`cell-pm-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} ${config.currency}`, 'Total Pago']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick breakdown list */}
          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
            {(selectedNicheFilter === 'ALL' ? nicheBreakdownData : paymentMethodsData).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-[11px]">
                  {item.value.toLocaleString()} {config.currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
