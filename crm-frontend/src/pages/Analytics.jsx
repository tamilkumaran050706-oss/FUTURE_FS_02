import { useState, useEffect } from 'react';
import {
  Users, TrendingUp, Clock, Calendar, BadgeCheck, IndianRupee,
  Download, Lightbulb, AlertTriangle, Info, Sparkles, CheckCircle2, ChevronDown
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import {
  MONTHLY_LEADS_DATA, LEAD_SOURCE_DATA, LEAD_STATUS_DATA,
  LEAD_FUNNEL_DATA, TOP_SOURCES_DATA, FOLLOW_UP_METRICS,
  DATE_RANGE_KPIS, BUSINESS_INSIGHTS
} from '../data/mockAnalytics';

// ─── Toast Notification Component ──────────────────────────────────────────
const Toast = ({ title, message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp" role="alert">
      <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl max-w-sm
        ${type === 'success' ? 'bg-[#151517] border-[#C6FF00]/40' : 'bg-[#151517] border-red-500/40'}`}>
        <div className={`mt-0.5 flex-shrink-0 ${type === 'success' ? 'text-[#C6FF00]' : 'text-red-400'}`}>
          <CheckCircle2 size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#F5F5F5] text-sm font-semibold">{title}</p>
          {message && <p className="text-[#A0A0A0] text-xs mt-0.5">{message}</p>}
        </div>
        <button onClick={onClose} aria-label="Dismiss Notification"
          className="text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors flex-shrink-0 mt-0.5">
          <Download size={14} className="rotate-180 opacity-0 w-0 h-0" /> {/* dummy ref */}
          <span className="text-xs">✕</span>
        </button>
      </div>
    </div>
  );
};

// ─── Custom Tooltip for Charts ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#151517] border border-[#2A2A2D] p-3 rounded-lg shadow-xl">
        {label && <p className="text-[10px] uppercase font-bold text-[#5A5A5D] mb-1">{label}</p>}
        <p className="text-xs font-bold text-[#F5F5F5]">
          {payload[0].name}: <span className="text-[#C6FF00]">{prefix}{payload[0].value.toLocaleString('en-IN')}</span>
        </p>
      </div>
    );
  }
  return null;
};

// ─── Analytics Component ────────────────────────────────────────────────────
const Analytics = () => {
  const [dateRange, setDateRange] = useState('Last 90 Days');
  const [kpis, setKpis] = useState(DATE_RANGE_KPIS['Last 90 Days']);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Trigger KPI data transition simulation on Date Range change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setKpis(DATE_RANGE_KPIS[dateRange]);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleExport = () => {
    setToast({
      title: 'Report Exported Successfully',
      message: `Lead Performance Report (${dateRange}) has been downloaded as PDF.`,
      type: 'success'
    });
  };

  const kpiIcons = {
    'Total Leads': Users,
    'Conversion Rate': TrendingUp,
    'Average Response Time': Clock,
    'Site Visits Scheduled': Calendar,
    'Closed Deals': BadgeCheck,
    'Revenue Potential': IndianRupee
  };

  const kpiColors = {
    'Total Leads': '#60A5FA',
    'Conversion Rate': '#C6FF00',
    'Average Response Time': '#A78BFA',
    'Site Visits Scheduled': '#FBBF24',
    'Closed Deals': '#34D399',
    'Revenue Potential': '#F43F5E'
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#F5F5F5]">

      {/* ─── PAGE HEADER ───────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2D] pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
          <p className="text-xs text-[#A0A0A0]">Track lead performance, conversion trends, and business insights.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Date Range Selector */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              aria-label="Filter analytics by date range"
              className="appearance-none w-full sm:w-44 h-10 pl-3.5 pr-9 rounded-lg bg-[#151517] border border-[#2A2A2D] text-xs font-semibold text-[#F5F5F5] outline-none transition-all duration-150 cursor-pointer focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10 hover:border-[#3A3A3D]"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="This Year">This Year</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5D] pointer-events-none" />
          </div>

          {/* Export Report */}
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] hover:border-[#C6FF00]/40 text-[#A0A0A0] hover:text-[#C6FF00] hover:bg-[#151517] text-xs font-bold transition-all duration-200"
            aria-label="Export PDF Report"
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </header>

      {/* ─── KPI CARDS ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Key Performance Indicators"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 animate-fadeInUp"
        style={{ animationDelay: '60ms' }}
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpiIcons[kpi.label] || Users;
          const iconColor = kpiColors[kpi.label] || '#C6FF00';
          const isNegativeVal = kpi.label === 'Average Response Time'; // -1 Day response is positive progress, so we check colors carefully.
          const isRedTrend = isNegativeVal ? false : kpi.change.startsWith('-');

          return (
            <div
              key={kpi.label}
              className={`bg-[#151517] border border-[#2A2A2D] rounded-xl p-4 relative overflow-hidden transition-all duration-200 hover:border-[#3A3A3D]
                ${loading ? 'opacity-40 animate-pulse' : 'opacity-100'}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-[#5A5A5D] uppercase font-bold tracking-wider">{kpi.label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${iconColor}15` }}>
                  <Icon size={14} style={{ color: iconColor }} />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl font-black text-[#F5F5F5] tracking-tight leading-none tabular-nums">
                  {kpi.value}
                </span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide leading-none
                  ${isRedTrend
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-[#C6FF00]/10 text-[#C6FF00]'}`}
                >
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* ─── MAIN CHARTS ROW 1 (GROWTH & SOURCES) ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LINE CHART: MONTHLY GROWTH */}
        <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 hover:border-[#3A3A3D] transition-colors duration-200">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#2A2A2D]/60">
            <h2 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C6FF00]" /> Monthly Lead Growth Trends
            </h2>
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold tracking-wider font-mono">Last 8 Months</span>
          </div>

          <div className="w-full h-64 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_LEADS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="growthGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6FF00" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C6FF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2D" vertical={false} />
                <XAxis dataKey="month" stroke="#5A5A5D" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A5A5D" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2A2A2D', strokeWidth: 1 }} />
                <Line
                  name="Leads Captured"
                  type="monotone"
                  dataKey="leads"
                  stroke="#C6FF00"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1, fill: '#151517' }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#C6FF00' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* PIE CHART: LEAD SOURCES */}
        <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 hover:border-[#3A3A3D] transition-colors duration-200">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#2A2A2D]/60">
            <h2 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA]" /> Lead Source Analytics
            </h2>
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold tracking-wider font-mono">ratios</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center h-64 select-none">
            {/* Donut Pie */}
            <div className="sm:col-span-3 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip prefix="" />} />
                  <Pie
                    data={LEAD_SOURCE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {LEAD_SOURCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#151517" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Structured Legend */}
            <div className="sm:col-span-2 space-y-2">
              {LEAD_SOURCE_DATA.map((src) => (
                <div key={src.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ backgroundColor: src.color }} />
                    <span className="text-[#A0A0A0] font-medium">{src.name}</span>
                  </div>
                  <span className="font-bold text-white tracking-wide">{src.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* ─── CHARTS ROW 2 (FUNNEL & STATUS) ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BAR CHART: STATUS DISTRIBUTION */}
        <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 hover:border-[#3A3A3D] transition-colors duration-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#2A2A2D]/60">
            <h2 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A78BFA]" /> Lead Status Distribution
            </h2>
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold tracking-wider font-mono">active categories</span>
          </div>

          <div className="w-full h-64 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LEAD_STATUS_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2D" vertical={false} />
                <XAxis dataKey="status" stroke="#5A5A5D" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A5A5D" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar name="Leads Count" dataKey="count" radius={[4, 4, 0, 0]}>
                  {LEAD_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* LEAD CONVERSION FUNNEL */}
        <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 hover:border-[#3A3A3D] transition-colors duration-200">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#2A2A2D]/60">
            <h2 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FB923C]" /> Lead Conversion Funnel
            </h2>
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold tracking-wider font-mono">conversion</span>
          </div>

          {/* Funnel Layout */}
          <div className="space-y-2.5">
            {LEAD_FUNNEL_DATA.map((stage, idx) => {
              // Calculate width based on percentage to create a funnel shape
              const widthPct = Math.max(45, stage.percentage);

              return (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex justify-between items-center text-xs px-1">
                    <span className="text-[#A0A0A0] font-semibold">{stage.stage}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-black">{stage.count}</span>
                      <span className="text-[10px] text-[#5A5A5D]">({stage.percentage}%)</span>
                    </div>
                  </div>
                  {/* Visual trapezoid representation using standard boxes */}
                  <div className="w-full bg-[#1E1E21] h-6 rounded-md overflow-hidden relative border border-[#2A2A2D]">
                    <div
                      className={`h-full border-r-4 border-solid transition-all duration-300 ${stage.color}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ─── COLUMN 3: LISTS & METRICS (PERFORMANCE, RANKINGS, INSIGHTS) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* FOLLOW-UP PERFORMANCE */}
        <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 hover:border-[#3A3A3D] transition-colors duration-200 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2D]/60">
            <h2 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" /> Follow-Up Performance
            </h2>
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold tracking-wider font-mono">metrics</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
              <span className="text-[9px] text-[#5A5A5D] uppercase font-bold">Upcoming</span>
              <p className="text-lg font-black text-white mt-1 tabular-nums">{FOLLOW_UP_METRICS.upcoming}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30">
              <span className="text-[9px] text-red-400 uppercase font-bold">Overdue</span>
              <p className="text-lg font-black text-red-400 mt-1 tabular-nums">{FOLLOW_UP_METRICS.overdue}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
              <span className="text-[9px] text-[#5A5A5D] uppercase font-bold">Completed</span>
              <p className="text-lg font-black text-white mt-1 tabular-nums">{FOLLOW_UP_METRICS.completed}</p>
            </div>

            <div className="p-3 rounded-lg bg-[#C6FF00]/5 border border-[#C6FF00]/20">
              <span className="text-[9px] text-[#C6FF00] uppercase font-bold">Success Rate</span>
              <p className="text-lg font-black text-[#C6FF00] mt-1 tabular-nums">{FOLLOW_UP_METRICS.successRate}%</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#1E1E21]/60 border border-[#2A2A2D] text-xs text-[#A0A0A0] leading-relaxed">
            <p>Agent task success is within target SLA. Recommended action: allocate 3 additional leads from Instagram to reduce individual workload and improve speed.</p>
          </div>
        </section>

        {/* TOP PERFORMING SOURCES */}
        <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 hover:border-[#3A3A3D] transition-colors duration-200 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2D]/60">
            <h2 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F43F5E]" /> Top Performing Sources
            </h2>
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold tracking-wider font-mono">Rankings</span>
          </div>

          <div className="space-y-2.5">
            {TOP_SOURCES_DATA.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-2 rounded-lg bg-[#1E1E21]/60 border border-[#2A2A2D]/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[#5A5A5D] w-3 font-mono">#{item.rank}</span>
                  <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-white">{item.source}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#A0A0A0] tabular-nums">{item.count} Leads</span>
                  <span className="font-bold text-[#C6FF00] min-w-[32px] text-right">{item.conversion}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INSIGHTS & RECOMMENDATIONS */}
        <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 hover:border-[#3A3A3D] transition-colors duration-200 space-y-4 md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2D]/60">
            <h2 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FB923C]" /> Insights &amp; Recommendations
            </h2>
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold tracking-wider font-mono">intelligence</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[17.5rem] pr-1 scrollbar-thin scrollbar-thumb-[#2A2A2D]">
            {BUSINESS_INSIGHTS.map((insight) => {
              let Icon = Info;
              let borderClr = 'border-[#2A2A2D]';
              let iconClr = 'text-[#A0A0A0]';

              if (insight.type === 'success') {
                Icon = CheckCircle2;
                borderClr = 'border-green-500/25 bg-green-500/5';
                iconClr = 'text-[#34D399]';
              } else if (insight.type === 'warning') {
                Icon = AlertTriangle;
                borderClr = 'border-red-500/25 bg-red-500/5';
                iconClr = 'text-red-400';
              } else if (insight.type === 'recommend') {
                Icon = Lightbulb;
                borderClr = 'border-[#C6FF00]/25 bg-[#C6FF00]/5';
                iconClr = 'text-[#C6FF00]';
              }

              return (
                <div key={insight.id} className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${borderClr}`}>
                  <Icon size={15} className={`flex-shrink-0 mt-0.5 ${iconClr}`} />
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">{insight.text}</p>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ─── TOAST NOTIFICATION ─────────────────────────────────────────────── */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
};

export default Analytics;
