import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  PhoneCall,
  CalendarCheck,
  BadgeCheck,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowRight,
  Handshake,
  AlertCircle,
  Minus,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STATS = [
  {
    id: 'total-leads',
    title: 'Total Leads',
    value: 128,
    icon: Users,
    trend: '+12%',
    trendUp: true,
    trendLabel: 'this month',
    accent: '#C6FF00',
  },
  {
    id: 'new-leads',
    title: 'New Leads',
    value: 34,
    icon: UserPlus,
    trend: '+8%',
    trendUp: true,
    trendLabel: 'this week',
    accent: '#60A5FA',
  },
  {
    id: 'contacted',
    title: 'Contacted',
    value: 48,
    icon: PhoneCall,
    trend: '-5%',
    trendUp: false,
    trendLabel: 'this week',
    accent: '#FACC15',
  },
  {
    id: 'site-visits',
    title: 'Site Visits',
    value: 19,
    icon: CalendarCheck,
    trend: '+3%',
    trendUp: true,
    trendLabel: 'this month',
    accent: '#A78BFA',
  },
  {
    id: 'negotiations',
    title: 'Negotiations',
    value: 15,
    icon: Handshake,
    trend: '+2%',
    trendUp: true,
    trendLabel: 'this month',
    accent: '#FB923C',
  },
  {
    id: 'closed-deals',
    title: 'Closed Deals',
    value: 12,
    icon: BadgeCheck,
    trend: '+18%',
    trendUp: true,
    trendLabel: 'this month',
    accent: '#34D399',
  },
];

const PIPELINE = [
  { stage: 'New Leads',    count: 34, color: '#60A5FA', pct: 100 },
  { stage: 'Contacted',   count: 48, color: '#FACC15', pct: Math.round((48/128)*100) },
  { stage: 'Site Visits', count: 19, color: '#A78BFA', pct: Math.round((19/128)*100) },
  { stage: 'Negotiating', count: 15, color: '#FB923C', pct: Math.round((15/128)*100) },
  { stage: 'Closed',      count: 12, color: '#34D399', pct: Math.round((12/128)*100) },
];

const LEADS = [
  { id: 1, name: 'Arjun Mehta',     property: '3BHK Villa, Whitefield',    budget: '₹85L',  status: 'Negotiating', followUp: '10 Jun 2026', source: 'Website' },
  { id: 2, name: 'Priya Sharma',    property: '2BHK Apt, Koramangala',     budget: '₹52L',  status: 'Contacted',   followUp: '11 Jun 2026', source: 'Referral' },
  { id: 3, name: 'Rohit Nair',      property: 'Plot, Sarjapur Road',       budget: '₹1.2Cr', status: 'New',         followUp: '12 Jun 2026', source: 'Google Ads' },
  { id: 4, name: 'Deepika Rao',     property: '4BHK Penthouse, Indiranagar', budget: '₹2.1Cr', status: 'Closed Deal', followUp: '—',          source: 'Walk-in' },
  { id: 5, name: 'Vikram Joshi',    property: '1BHK Studio, Electronic City', budget: '₹28L',  status: 'Contacted',   followUp: '13 Jun 2026', source: 'Facebook' },
];

const FOLLOW_UPS = [
  { id: 1, name: 'Arjun Mehta',   date: 'Jun 10', time: '10:00 AM', priority: 'High' },
  { id: 2, name: 'Priya Sharma',  date: 'Jun 11', time: '02:30 PM', priority: 'Medium' },
  { id: 3, name: 'Rohit Nair',    date: 'Jun 12', time: '11:00 AM', priority: 'High' },
  { id: 4, name: 'Vikram Joshi',  date: 'Jun 13', time: '04:00 PM', priority: 'Low' },
  { id: 5, name: 'Sneha Patel',   date: 'Jun 14', time: '09:30 AM', priority: 'Medium' },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusStyles = {
  'New':         'bg-blue-500/15  text-blue-400  border-blue-500/30',
  'Contacted':   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  'Negotiating': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Closed Deal': 'bg-green-500/15  text-green-400  border-green-500/30',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusStyles[status] || 'bg-[#2A2A2D] text-[#A0A0A0] border-[#3A3A3D]'}`}>
    {status}
  </span>
);

// ─── Priority Badge ───────────────────────────────────────────────────────────
const priorityStyles = {
  High:   { cls: 'text-red-400 bg-red-500/10 border-red-500/25', icon: AlertCircle },
  Medium: { cls: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25', icon: Minus },
  Low:    { cls: 'text-green-400 bg-green-500/10 border-green-500/25', icon: TrendingDown },
};

const PriorityBadge = ({ priority }) => {
  const { cls, icon: Icon } = priorityStyles[priority] || priorityStyles.Low;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${cls}`}>
      <Icon size={10} />
      {priority}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ card, delay }) => {
  const Icon = card.icon;
  const TrendIcon = card.trendUp ? TrendingUp : TrendingDown;
  return (
    <div
      className="group relative bg-[#151517] border border-[#2A2A2D] rounded-xl p-5
        hover:border-[#3A3A3D] transition-all duration-200 cursor-default animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
      role="region"
      aria-label={`${card.title}: ${card.value}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200"
          style={{ backgroundColor: `${card.accent}18` }}
        >
          <Icon size={20} style={{ color: card.accent }} className="group-hover:opacity-90 transition-opacity duration-200" />
        </div>
        {/* Trend pill */}
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium
          ${card.trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          <TrendIcon size={10} />
          {card.trend}
        </div>
      </div>

      {/* Value */}
      <p className="text-[28px] font-bold text-[#F5F5F5] leading-none mb-1 tabular-nums">
        {card.value.toLocaleString()}
      </p>

      {/* Label */}
      <p className="text-[#A0A0A0] text-sm">{card.title}</p>

      {/* Trend label */}
      <p className="text-[#5A5A5D] text-[11px] mt-1">{card.trend} {card.trendLabel}</p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: card.accent }}
      />
    </div>
  );
};

// ─── Pipeline Bar ─────────────────────────────────────────────────────────────
const PipelineBar = ({ item, index }) => (
  <div className="animate-fadeInUp" style={{ animationDelay: `${index * 60 + 300}ms` }}>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-sm text-[#A0A0A0]">{item.stage}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[#F5F5F5] tabular-nums">{item.count}</span>
        <span className="text-[11px] text-[#5A5A5D]">{item.pct}%</span>
      </div>
    </div>
    <div className="h-2 rounded-full bg-[#1E1E21] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
      />
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fadeIn pb-8">

      {/* ── Welcome Section ──────────────────────────────────────────── */}
      <section aria-labelledby="welcome-heading" className="animate-fadeInUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 id="welcome-heading" className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] leading-tight">
              Welcome back,{' '}
              <span className="text-[#C6FF00]">Tamil Kumaran</span>{' '}
              <span role="img" aria-label="wave">👋</span>
            </h1>
            <p className="text-[#A0A0A0] mt-1.5 text-sm sm:text-base">
              Here's an overview of your real estate leads and sales performance.
            </p>
          </div>

          {/* Date chip */}
          <div className="flex items-center gap-2 bg-[#151517] border border-[#2A2A2D] rounded-lg px-3 py-2 self-start sm:self-auto">
            <Calendar size={14} className="text-[#C6FF00] flex-shrink-0" />
            <span className="text-[#A0A0A0] text-sm whitespace-nowrap">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats Grid ───────────────────────────────────────────────── */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Statistics Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {STATS.map((card, i) => (
            <div key={card.id} className="xl:col-span-1 sm:col-span-1">
              <StatCard card={card} delay={i * 50} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline + Follow-Ups row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Pipeline (3 cols) */}
        <section
          aria-labelledby="pipeline-heading"
          className="lg:col-span-3 bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 animate-fadeInUp"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="pipeline-heading" className="text-base font-semibold text-[#F5F5F5]">Lead Pipeline</h2>
              <p className="text-[#5A5A5D] text-xs mt-0.5">Stage-wise lead distribution</p>
            </div>
            <span className="text-[11px] text-[#A0A0A0] bg-[#1E1E21] border border-[#2A2A2D] px-2 py-1 rounded-lg">
              128 total
            </span>
          </div>

          <div className="space-y-4">
            {PIPELINE.map((item, i) => (
              <PipelineBar key={item.stage} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* Follow-Ups (2 cols) */}
        <section
          aria-labelledby="followup-heading"
          className="lg:col-span-2 bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 flex flex-col animate-fadeInUp"
          style={{ animationDelay: '250ms' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 id="followup-heading" className="text-base font-semibold text-[#F5F5F5]">Upcoming Follow-Ups</h2>
              <p className="text-[#5A5A5D] text-xs mt-0.5">Next 5 scheduled calls</p>
            </div>
            <Calendar size={16} className="text-[#C6FF00]" />
          </div>

          <ul className="space-y-3 flex-1">
            {FOLLOW_UPS.map((item, i) => (
              <li
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1A1D] border border-[#2A2A2D]
                  hover:border-[#3A3A3D] transition-colors duration-150 animate-fadeInUp"
                style={{ animationDelay: `${i * 60 + 300}ms` }}
              >
                {/* Calendar icon block */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#C6FF00]/10 flex flex-col items-center justify-center">
                  <span className="text-[#C6FF00] text-[10px] font-bold leading-none">
                    {item.date.split(' ')[0].toUpperCase()}
                  </span>
                  <span className="text-[#C6FF00] text-sm font-bold leading-none">
                    {item.date.split(' ')[1]}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#F5F5F5] text-sm font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={10} className="text-[#5A5A5D]" />
                    <span className="text-[#5A5A5D] text-[11px]">{item.time}</span>
                  </div>
                </div>

                <PriorityBadge priority={item.priority} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── Recent Leads Table ────────────────────────────────────────── */}
      <section
        aria-labelledby="leads-heading"
        className="bg-[#151517] border border-[#2A2A2D] rounded-xl overflow-hidden animate-fadeInUp"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2D]">
          <div>
            <h2 id="leads-heading" className="text-base font-semibold text-[#F5F5F5]">Recent Leads</h2>
            <p className="text-[#5A5A5D] text-xs mt-0.5">Latest 5 leads in your pipeline</p>
          </div>
          <button
            onClick={() => navigate('/leads')}
            className="flex items-center gap-1.5 text-[#C6FF00] text-sm font-medium hover:text-[#D7FF4A] transition-colors duration-150 focus:outline-none focus:underline"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {/* Scrollable on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]" role="table">
            <thead>
              <tr className="border-b border-[#2A2A2D]">
                {['Customer Name', 'Property Interest', 'Budget', 'Status', 'Follow-Up', 'Source'].map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-5 py-3 text-left text-[11px] font-semibold text-[#5A5A5D] uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADS.map((lead, i) => (
                <tr
                  key={lead.id}
                  className="border-b border-[#1E1E21] hover:bg-[#1A1A1D] transition-colors duration-100 cursor-pointer"
                  tabIndex={0}
                  role="row"
                  aria-label={`Lead: ${lead.name}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div className="w-8 h-8 rounded-full bg-[#2A2A2D] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#C6FF00] text-xs font-bold">
                          {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-[#F5F5F5] text-sm font-medium">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#A0A0A0] text-sm">{lead.property}</td>
                  <td className="px-5 py-3.5 text-[#F5F5F5] text-sm font-medium tabular-nums">{lead.budget}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-3.5 text-[#A0A0A0] text-sm">{lead.followUp}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[#5A5A5D] text-xs bg-[#1E1E21] border border-[#2A2A2D] px-2 py-0.5 rounded">
                      {lead.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="actions-heading"
        className="animate-fadeInUp"
        style={{ animationDelay: '350ms' }}
      >
        <h2 id="actions-heading" className="text-base font-semibold text-[#F5F5F5] mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Add Lead */}
          <button
            id="quick-action-add-lead"
            onClick={() => navigate('/leads/new')}
            className="group flex items-center gap-4 p-5 rounded-xl bg-[#C6FF00] text-[#0B0B0D]
              hover:bg-[#D7FF4A] transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 focus:ring-offset-[#0B0B0D]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#0B0B0D]/15 flex items-center justify-center flex-shrink-0">
              <UserPlus size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Add New Lead</p>
              <p className="text-[#0B0B0D]/70 text-xs mt-0.5">Capture a new prospect</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform duration-150" />
          </button>

          {/* View All Leads */}
          <button
            id="quick-action-view-leads"
            onClick={() => navigate('/leads')}
            className="group flex items-center gap-4 p-5 rounded-xl bg-[#151517] border border-[#2A2A2D] text-[#F5F5F5]
              hover:border-[#C6FF00]/40 hover:bg-[#1A1A1D] transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/50 focus:ring-offset-2 focus:ring-offset-[#0B0B0D]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#C6FF00]/10 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-[#C6FF00]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">View All Leads</p>
              <p className="text-[#A0A0A0] text-xs mt-0.5">Browse your pipeline</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-[#5A5A5D] group-hover:text-[#C6FF00] group-hover:translate-x-0.5 transition-all duration-150" />
          </button>

          {/* Analytics */}
          <button
            id="quick-action-analytics"
            onClick={() => navigate('/analytics')}
            className="group flex items-center gap-4 p-5 rounded-xl bg-[#151517] border border-[#2A2A2D] text-[#F5F5F5]
              hover:border-[#C6FF00]/40 hover:bg-[#1A1A1D] transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/50 focus:ring-offset-2 focus:ring-offset-[#0B0B0D]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#C6FF00]/10 flex items-center justify-center flex-shrink-0">
              <BarChart3 size={20} className="text-[#C6FF00]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Analytics</p>
              <p className="text-[#A0A0A0] text-xs mt-0.5">View reports &amp; insights</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-[#5A5A5D] group-hover:text-[#C6FF00] group-hover:translate-x-0.5 transition-all duration-150" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
