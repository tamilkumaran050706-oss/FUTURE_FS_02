import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, SlidersHorizontal, UserPlus, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Users, CalendarCheck,
  Handshake, BadgeCheck, AlertTriangle, InboxIcon,
  Phone, Mail, MapPin, ChevronDown, ChevronUp, Filter,
  Calendar, Briefcase, Flag, DollarSign, Sparkles, Home
} from 'lucide-react';
import {
  MOCK_LEADS,
  formatBudget, formatDate,
} from '../data/mockLeads';

const PAGE_SIZE = 10;

// ─── Status config ─────────────────────────────────────────────────────────
const statusConfig = {
  'New':                  { cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  'Contacted':            { cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  'Site Visit Scheduled': { cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  'Negotiating':          { cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  'Closed Deal':          { cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
  'Not Interested':       { cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap
    ${statusConfig[status]?.cls ?? 'bg-[#2A2A2D] text-[#A0A0A0] border-[#3A3A3D]'}`}>
    {status}
  </span>
);

// ─── Source Badge ──────────────────────────────────────────────────────────
const SourceBadge = ({ source }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] text-[#A0A0A0] bg-[#1E1E21] border border-[#2A2A2D] whitespace-nowrap">
    {source}
  </span>
);

// ─── Select Dropdown ────────────────────────────────────────────────────────


// ─── Delete Confirmation Modal ─────────────────────────────────────────────
const DeleteModal = ({ lead, onCancel, onConfirm }) => {
  const cancelRef = useRef(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="w-full max-w-md bg-[#151517] border border-[#2A2A2D] rounded-2xl shadow-2xl animate-fadeInUp p-6">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>

        <h2 id="delete-modal-title" className="text-[#F5F5F5] font-semibold text-lg mb-1">
          Delete Lead
        </h2>
        <p className="text-[#A0A0A0] text-sm mb-1">
          Are you sure you want to delete{' '}
          <span className="text-[#F5F5F5] font-medium">{lead.name}</span>?
        </p>
        <p className="text-[#5A5A5D] text-xs mb-6">
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[#2A2A2D] text-[#A0A0A0] text-sm font-medium
              hover:border-[#3A3A3D] hover:text-[#F5F5F5] hover:bg-[#1E1E21]
              transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/40"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(lead.id)}
            className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-semibold
              hover:bg-red-500 transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Mobile Lead Card ───────────────────────────────────────────────────────
const LeadCard = ({ lead, onView, onEdit, onDelete }) => (
  <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-4 hover:border-[#3A3A3D] transition-colors duration-150">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2A2A2D] flex items-center justify-center flex-shrink-0">
          <span className="text-[#C6FF00] text-xs font-bold">
            {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="text-[#F5F5F5] font-semibold text-sm">{lead.name}</p>
          <StatusBadge status={lead.status} />
        </div>
      </div>
      <div className="flex gap-1">
        <button onClick={() => onView(lead.id)} aria-label="View lead"
          className="p-1.5 rounded-lg text-[#5A5A5D] hover:text-[#60A5FA] hover:bg-[#1E1E21] transition-colors duration-150">
          <Eye size={15} />
        </button>
        <button onClick={() => onEdit(lead.id)} aria-label="Edit lead"
          className="p-1.5 rounded-lg text-[#5A5A5D] hover:text-[#C6FF00] hover:bg-[#1E1E21] transition-colors duration-150">
          <Pencil size={15} />
        </button>
        <button onClick={() => onDelete(lead)} aria-label="Delete lead"
          className="p-1.5 rounded-lg text-[#5A5A5D] hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150">
          <Trash2 size={15} />
        </button>
      </div>
    </div>

    <div className="space-y-1.5 text-sm">
      <div className="flex items-center gap-2 text-[#A0A0A0]">
        <Mail size={12} className="flex-shrink-0" />
        <span className="truncate">{lead.email}</span>
      </div>
      <div className="flex items-center gap-2 text-[#A0A0A0]">
        <Phone size={12} className="flex-shrink-0" />
        <span>{lead.phone}</span>
      </div>
      <div className="flex items-center gap-2 text-[#A0A0A0]">
        <MapPin size={12} className="flex-shrink-0" />
        <span className="truncate">{lead.property}, {lead.location}</span>
      </div>
    </div>

    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2A2A2D]">
      <div>
        <p className="text-[#F5F5F5] text-sm font-semibold tabular-nums">{formatBudget(lead.budget)}</p>
        <p className="text-[#5A5A5D] text-[11px]">Budget</p>
      </div>
      <div className="text-right">
        <p className="text-[#A0A0A0] text-xs">{formatDate(lead.followUp)}</p>
        <p className="text-[#5A5A5D] text-[11px]">Follow-Up</p>
      </div>
      <SourceBadge source={lead.source} />
    </div>
  </div>
);

// ─── Empty State ────────────────────────────────────────────────────────────
const EmptyState = ({ onAdd, onClear, hasActiveFilters }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fadeIn">
    <div className="w-14 h-14 rounded-2xl bg-[#1E1E21] border border-[#2A2A2D] flex items-center justify-center mb-4 shadow-inner">
      <InboxIcon size={24} className="text-[#5A5A5D]" />
    </div>
    <h3 className="text-[#F5F5F5] font-bold text-base mb-1">No leads found</h3>
    <p className="text-[#5A5A5D] text-xs max-w-sm mb-6 leading-relaxed">
      Try adjusting your search criteria or clearing some filters.
    </p>
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="w-full sm:w-auto h-9 px-4 rounded-lg border border-[#2A2A2D] text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1E1E21] text-xs font-semibold transition-all duration-150 focus:outline-none"
        >
          Clear Filters
        </button>
      )}
      <button
        onClick={onAdd}
        className="w-full sm:w-auto flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-[#C6FF00] text-[#0B0B0D] hover:bg-[#D7FF4A] text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]"
      >
        <UserPlus size={14} /> Add New Lead
      </button>
    </div>
  </div>
);

// ─── Summary Stat Card ──────────────────────────────────────────────────────
const SummaryCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 bg-[#151517] border border-[#2A2A2D] rounded-xl px-4 py-3
    hover:border-[#3A3A3D] transition-colors duration-150">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${color}20` }}>
      <Icon size={16} style={{ color }} />
    </div>
    <div>
      <p className="text-[#F5F5F5] font-bold text-lg leading-none tabular-nums">{value}</p>
      <p className="text-[#5A5A5D] text-[11px] mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── Leads Page ─────────────────────────────────────────────────────────────
// ─── Filter & Search Constants ───────────────────────────────────────────────
const STATUS_OPTIONS_DISPLAY = [
  'All Statuses',
  'New',
  'Contacted',
  'Site Visit Scheduled',
  'Negotiating',
  'Closed Deal',
  'Not Interested'
];

const SOURCE_OPTIONS_DISPLAY = [
  'All Sources',
  'Website',
  'Referral',
  'Facebook',
  'Instagram',
  'Google Ads',
  'Walk-in',
  'Other'
];

const PRIORITY_OPTIONS_DISPLAY = [
  'All Priorities',
  'High',
  'Medium',
  'Low'
];

const BUDGET_OPTIONS_DETAILED = [
  { label: 'All Budgets', min: 0, max: Infinity },
  { label: 'Under ₹10,00,000', min: 0, max: 1000000 },
  { label: '₹10,00,000 – ₹50,00,000', min: 1000000, max: 5000000 },
  { label: '₹50,00,000 – ₹1,00,00,000', min: 5000000, max: 10000000 },
  { label: 'Above ₹1,00,00,000', min: 10000000, max: Infinity }
];

const PROPERTY_TYPE_OPTIONS = [
  'All Types',
  '1 BHK Apartment',
  '2 BHK Apartment',
  '3 BHK Apartment',
  'Villa',
  'Independent House',
  'Commercial Space',
  'Plot/Land'
];

const FOLLOW_UP_DATE_OPTIONS = [
  'All Dates',
  'Today',
  'Tomorrow',
  'This Week',
  'Overdue'
];

const CREATED_DATE_OPTIONS = [
  'All Time',
  'Last 7 Days',
  'Last 30 Days',
  'Last 90 Days'
];

// ─── Dropdown Component ──────────────────────────────────────────────────────
const PremiumFilterSelect = ({ id, label, value, onChange, options, icon: Icon }) => (
  <div className="relative min-w-[145px] flex-1">
    <div className="relative">
      {Icon && (
        <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5D] pointer-events-none" />
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={`appearance-none w-full h-9 ${Icon ? 'pl-9' : 'pl-3'} pr-8 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]
          text-[11px] text-[#F5F5F5] font-semibold outline-none transition-all duration-150 cursor-pointer
          focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10 hover:border-[#3A3A3D]`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#151517] text-[#F5F5F5]">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A5A5D] pointer-events-none" />
    </div>
  </div>
);

// ─── Leads Page ─────────────────────────────────────────────────────────────
const Leads = () => {
  const navigate = useNavigate();

  // State
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');

  // Advanced Filters
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All Types');
  const [followUpDateFilter, setFollowUpDateFilter] = useState('All Dates');
  const [createdDateFilter, setCreatedDateFilter] = useState('All Time');

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null); // lead to delete

  // 300ms Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Derived: filtered leads
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const budgetRange = BUDGET_OPTIONS_DETAILED.find(b => b.label === budgetFilter) ?? BUDGET_OPTIONS_DETAILED[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    return leads.filter((l) => {
      // 1. Search Query
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.property && l.property.toLowerCase().includes(q));

      // 2. Quick Filters
      const matchStatus = statusFilter === 'All Statuses' || l.status === statusFilter;
      const matchSource = sourceFilter === 'All Sources' || l.source === sourceFilter;
      
      const leadPriority = l.priority || (l.id % 3 === 0 ? 'High' : l.id % 3 === 1 ? 'Medium' : 'Low');
      const matchPriority = priorityFilter === 'All Priorities' || leadPriority === priorityFilter;

      // 3. Advanced Filters
      const matchBudget = l.budget >= budgetRange.min && l.budget <= budgetRange.max;
      const matchPropertyType = propertyTypeFilter === 'All Types' || l.property === propertyTypeFilter;

      // Follow-Up Date
      let matchFollowUp = true;
      if (followUpDateFilter !== 'All Dates') {
        if (!l.followUp) {
          matchFollowUp = false;
        } else {
          const fDate = new Date(l.followUp);
          fDate.setHours(0, 0, 0, 0);
          const fDateStr = l.followUp.split('T')[0];

          if (followUpDateFilter === 'Today') {
            matchFollowUp = fDateStr === todayStr;
          } else if (followUpDateFilter === 'Tomorrow') {
            matchFollowUp = fDateStr === tomorrowStr;
          } else if (followUpDateFilter === 'This Week') {
            matchFollowUp = fDate >= today && fDate <= oneWeekFromNow;
          } else if (followUpDateFilter === 'Overdue') {
            matchFollowUp = fDate < today && l.status !== 'Closed Deal' && l.status !== 'Not Interested';
          }
        }
      }

      // Created Date
      let matchCreated = true;
      if (createdDateFilter !== 'All Time') {
        const createdDay = 10 + (l.id % 15);
        const createdAtStr = l.createdAt || `2026-05-${String(createdDay).padStart(2, '0')}`;
        const cDate = new Date(createdAtStr);
        cDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - cDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (createdDateFilter === 'Last 7 Days') {
          matchCreated = diffDays <= 7;
        } else if (createdDateFilter === 'Last 30 Days') {
          matchCreated = diffDays <= 30;
        } else if (createdDateFilter === 'Last 90 Days') {
          matchCreated = diffDays <= 90;
        }
      }

      return matchSearch && matchStatus && matchSource && matchPriority && matchBudget && matchPropertyType && matchFollowUp && matchCreated;
    });
  }, [leads, search, statusFilter, sourceFilter, priorityFilter, budgetFilter, propertyTypeFilter, followUpDateFilter, createdDateFilter]);

  // Pagination totals
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasActiveFilters =
    search.trim() !== '' ||
    statusFilter !== 'All Statuses' ||
    sourceFilter !== 'All Sources' ||
    priorityFilter !== 'All Priorities' ||
    budgetFilter !== 'All Budgets' ||
    propertyTypeFilter !== 'All Types' ||
    followUpDateFilter !== 'All Dates' ||
    createdDateFilter !== 'All Time';

  const hasActiveAdvancedFilters =
    budgetFilter !== 'All Budgets' ||
    propertyTypeFilter !== 'All Types' ||
    followUpDateFilter !== 'All Dates' ||
    createdDateFilter !== 'All Time';

  const activeAdvancedCount =
    (budgetFilter !== 'All Budgets' ? 1 : 0) +
    (propertyTypeFilter !== 'All Types' ? 1 : 0) +
    (followUpDateFilter !== 'All Dates' ? 1 : 0) +
    (createdDateFilter !== 'All Time' ? 1 : 0);

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatusFilter('All Statuses');
    setSourceFilter('All Sources');
    setPriorityFilter('All Priorities');
    setBudgetFilter('All Budgets');
    setPropertyTypeFilter('All Types');
    setFollowUpDateFilter('All Dates');
    setCreatedDateFilter('All Time');
    setPage(1);
  };

  // Active filter tags row
  const activeChips = useMemo(() => {
    const chips = [];
    if (search.trim()) {
      chips.push({ key: 'search', label: `Search: "${search}"`, onRemove: () => { setSearchInput(''); setSearch(''); } });
    }
    if (statusFilter !== 'All Statuses') {
      chips.push({ key: 'status', label: `Status: ${statusFilter}`, onRemove: () => setStatusFilter('All Statuses') });
    }
    if (sourceFilter !== 'All Sources') {
      chips.push({ key: 'source', label: `Source: ${sourceFilter}`, onRemove: () => setSourceFilter('All Sources') });
    }
    if (priorityFilter !== 'All Priorities') {
      chips.push({ key: 'priority', label: `Priority: ${priorityFilter}`, onRemove: () => setPriorityFilter('All Priorities') });
    }
    if (budgetFilter !== 'All Budgets') {
      chips.push({ key: 'budget', label: `Budget: ${budgetFilter}`, onRemove: () => setBudgetFilter('All Budgets') });
    }
    if (propertyTypeFilter !== 'All Types') {
      chips.push({ key: 'propertyType', label: `Property: ${propertyTypeFilter}`, onRemove: () => setPropertyTypeFilter('All Types') });
    }
    if (followUpDateFilter !== 'All Dates') {
      chips.push({ key: 'followUpDate', label: `Follow-Up: ${followUpDateFilter}`, onRemove: () => setFollowUpDateFilter('All Dates') });
    }
    if (createdDateFilter !== 'All Time') {
      chips.push({ key: 'createdDate', label: `Created: ${createdDateFilter}`, onRemove: () => setCreatedDateFilter('All Time') });
    }
    return chips;
  }, [search, statusFilter, sourceFilter, priorityFilter, budgetFilter, propertyTypeFilter, followUpDateFilter, createdDateFilter]);

  // Summary counts
  const counts = useMemo(() => ({
    total:     leads.length,
    newLeads:  leads.filter(l => l.status === 'New').length,
    siteVisit: leads.filter(l => l.status === 'Site Visit Scheduled').length,
    nego:      leads.filter(l => l.status === 'Negotiating').length,
    closed:    leads.filter(l => l.status === 'Closed Deal').length,
  }), [leads]);

  // Actions
  const handleDelete = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 pb-8 animate-fadeIn">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInUp">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] leading-tight">
            Leads Management
          </h1>
          <p className="text-[#A0A0A0] text-sm mt-1">
            Track, manage, and convert your real estate leads efficiently.
          </p>
        </div>
        <button
          id="add-lead-btn"
          onClick={() => navigate('/leads/new')}
          className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm
            hover:bg-[#D7FF4A] transition-colors duration-150 self-start sm:self-auto flex-shrink-0
            focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 focus:ring-offset-[#0B0B0D]"
        >
          <UserPlus size={16} />
          Add Lead
        </button>
      </section>

      {/* ── Summary Cards ────────────────────────────────────────────── */}
      <section
        aria-label="Leads summary"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-fadeInUp"
        style={{ animationDelay: '60ms' }}
      >
        <SummaryCard icon={Users}        label="Total Leads"  value={counts.total}     color="#C6FF00" />
        <SummaryCard icon={UserPlus}     label="New Leads"    value={counts.newLeads}  color="#60A5FA" />
        <SummaryCard icon={CalendarCheck}label="Site Visits"  value={counts.siteVisit} color="#A78BFA" />
        <SummaryCard icon={Handshake}    label="Negotiating"  value={counts.nego}      color="#FB923C" />
        <SummaryCard icon={BadgeCheck}   label="Closed Deals" value={counts.closed}    color="#34D399" />
      </section>

      {/* ── Search + Filters ─────────────────────────────────────────── */}
      <section
        className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-4 space-y-4 shadow-lg animate-fadeInUp"
        style={{ animationDelay: '120ms' }}
      >
        {/* Main Controls Row */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Debounced Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5D] pointer-events-none" />
            <input
              id="leads-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by customer name, email, phone, or property interest..."
              aria-label="Search leads"
              className="w-full h-9 pl-9 pr-9 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]
                text-xs text-[#F5F5F5] placeholder-[#4A4A4D] outline-none
                focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10
                hover:border-[#3A3A3D] transition-all duration-150"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Filters Row */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <PremiumFilterSelect
              id="status-filter"
              label="Status Filter"
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              options={STATUS_OPTIONS_DISPLAY}
              icon={Briefcase}
            />
            <PremiumFilterSelect
              id="source-filter"
              label="Source Filter"
              value={sourceFilter}
              onChange={(v) => { setSourceFilter(v); setPage(1); }}
              options={SOURCE_OPTIONS_DISPLAY}
              icon={Filter}
            />
            <PremiumFilterSelect
              id="priority-filter"
              label="Priority Filter"
              value={priorityFilter}
              onChange={(v) => { setPriorityFilter(v); setPage(1); }}
              options={PRIORITY_OPTIONS_DISPLAY}
              icon={Flag}
            />

            {/* Advanced Filters Trigger */}
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              aria-expanded={advancedOpen}
              aria-controls="advanced-filters-panel"
              className={`flex items-center gap-2 h-9 px-3.5 rounded-lg border text-xs font-bold transition-all duration-150 outline-none focus:ring-2 focus:ring-[#C6FF00]/40
                ${advancedOpen || hasActiveAdvancedFilters
                  ? 'border-[#C6FF00]/40 text-[#C6FF00] bg-[#C6FF00]/5'
                  : 'border-[#2A2A2D] text-[#A0A0A0] hover:border-[#3A3A3D] hover:text-[#F5F5F5] hover:bg-[#1E1E21]'}`}
            >
              <SlidersHorizontal size={13} />
              <span>Advanced Filters</span>
              {activeAdvancedCount > 0 && (
                <span className="flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold rounded-full bg-[#C6FF00] text-[#0B0B0D]">
                  {activeAdvancedCount}
                </span>
              )}
              {advancedOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Clear All Filters button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-red-500/20 text-red-400 text-xs font-semibold
                  hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-150 outline-none"
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        <div
          id="advanced-filters-panel"
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-hidden transition-all duration-300
            ${advancedOpen ? 'max-h-[300px] pt-3 border-t border-[#2A2A2D]/40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold pl-0.5">Budget Range</span>
            <PremiumFilterSelect
              id="budget-filter"
              label="Budget Filter"
              value={budgetFilter}
              onChange={(v) => { setBudgetFilter(v); setPage(1); }}
              options={BUDGET_OPTIONS_DETAILED.map(b => b.label)}
              icon={DollarSign}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold pl-0.5">Property Type</span>
            <PremiumFilterSelect
              id="property-type-filter"
              label="Property Type Filter"
              value={propertyTypeFilter}
              onChange={(v) => { setPropertyTypeFilter(v); setPage(1); }}
              options={PROPERTY_TYPE_OPTIONS}
              icon={Home}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold pl-0.5">Follow-Up Date</span>
            <PremiumFilterSelect
              id="followup-date-filter"
              label="Follow-Up Date Filter"
              value={followUpDateFilter}
              onChange={(v) => { setFollowUpDateFilter(v); setPage(1); }}
              options={FOLLOW_UP_DATE_OPTIONS}
              icon={Calendar}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-[#5A5A5D] uppercase font-bold pl-0.5">Created Date</span>
            <PremiumFilterSelect
              id="created-date-filter"
              label="Created Date Filter"
              value={createdDateFilter}
              onChange={(v) => { setCreatedDateFilter(v); setPage(1); }}
              options={CREATED_DATE_OPTIONS}
              icon={Sparkles}
            />
          </div>
        </div>

        {/* Active Filter Chips / Tags */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#2A2A2D]/30 animate-fadeIn">
            <span className="text-[9px] uppercase font-bold text-[#5A5A5D] tracking-wider pr-1">Applied:</span>
            {activeChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1E1E21] border border-[#2A2A2D] text-[#F5F5F5] hover:border-[#3A3A3D] transition-colors"
              >
                <span>{chip.label}</span>
                <button
                  onClick={chip.onRemove}
                  aria-label={`Remove filter ${chip.label}`}
                  className="text-[#5A5A5D] hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors pl-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Results Summary count */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-[#5A5A5D] text-xs">
            Showing <span className="text-[#A0A0A0] font-bold">{filtered.length}</span> of{' '}
            <span className="text-[#A0A0A0] font-bold">{leads.length}</span> leads
          </p>
        </div>
      </section>

      {/* ── Table (desktop) / Cards (mobile) ─────────────────────────── */}
      <section
        aria-label="Leads list"
        className="animate-fadeInUp"
        style={{ animationDelay: '180ms' }}
      >
        {paginated.length === 0 ? (
          <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl">
            <EmptyState 
              onAdd={() => navigate('/leads/new')} 
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-[#151517] border border-[#2A2A2D] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]" role="table">
                  <thead>
                    <tr className="border-b border-[#2A2A2D]">
                      {['Customer', 'Property Interest', 'Budget', 'Source', 'Status', 'Follow-Up', 'Actions'].map(col => (
                        <th key={col} scope="col"
                          className="px-5 py-3 text-left text-[11px] font-semibold text-[#5A5A5D] uppercase tracking-wider whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((lead) => (
                      <tr key={lead.id}
                        className="border-b border-[#1E1E21] hover:bg-[#1A1A1D] transition-colors duration-100 group">

                        {/* Customer */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#2A2A2D] flex items-center justify-center flex-shrink-0">
                              <span className="text-[#C6FF00] text-xs font-bold">
                                {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[#F5F5F5] text-sm font-medium truncate max-w-[140px]">{lead.name}</p>
                              <p className="text-[#5A5A5D] text-[11px] truncate max-w-[140px]">{lead.email}</p>
                              <p className="text-[#5A5A5D] text-[11px]">{lead.phone}</p>
                            </div>
                          </div>
                        </td>

                        {/* Property */}
                        <td className="px-5 py-3.5">
                          <p className="text-[#F5F5F5] text-sm">{lead.property}</p>
                          <p className="text-[#5A5A5D] text-[11px] flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {lead.location}
                          </p>
                        </td>

                        {/* Budget */}
                        <td className="px-5 py-3.5 text-[#F5F5F5] text-sm font-semibold tabular-nums whitespace-nowrap">
                          {formatBudget(lead.budget)}
                        </td>

                        {/* Source */}
                        <td className="px-5 py-3.5">
                          <SourceBadge source={lead.source} />
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <StatusBadge status={lead.status} />
                        </td>

                        {/* Follow-Up */}
                        <td className="px-5 py-3.5 text-[#A0A0A0] text-sm whitespace-nowrap">
                          {formatDate(lead.followUp)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/leads/${lead.id}`)}
                              aria-label={`View ${lead.name}`}
                              title="View"
                              className="p-1.5 rounded-lg text-[#5A5A5D] hover:text-[#60A5FA] hover:bg-[#1E1E21]
                                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/40"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => navigate(`/leads/edit/${lead.id}`)}
                              aria-label={`Edit ${lead.name}`}
                              title="Edit"
                              className="p-1.5 rounded-lg text-[#5A5A5D] hover:text-[#C6FF00] hover:bg-[#1E1E21]
                                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/40"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(lead)}
                              aria-label={`Delete ${lead.name}`}
                              title="Delete"
                              className="p-1.5 rounded-lg text-[#5A5A5D] hover:text-red-400 hover:bg-red-500/10
                                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {paginated.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onView={(id) => navigate(`/leads/${id}`)}
                  onEdit={(id) => navigate(`/leads/edit/${id}`)}
                  onDelete={(l) => setDeleteTarget(l)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Pagination ───────────────────────────────────────────────── */}
      {filtered.length > PAGE_SIZE && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between bg-[#151517] border border-[#2A2A2D] rounded-xl px-5 py-3 animate-fadeInUp"
          style={{ animationDelay: '220ms' }}
        >
          <p className="text-[#5A5A5D] text-sm">
            Page <span className="text-[#A0A0A0] font-medium">{safePage}</span> of{' '}
            <span className="text-[#A0A0A0] font-medium">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#2A2A2D] text-sm text-[#A0A0A0]
                hover:border-[#3A3A3D] hover:text-[#F5F5F5] hover:bg-[#1E1E21]
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#A0A0A0] disabled:hover:border-[#2A2A2D]
                transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/40"
            >
              <ChevronLeft size={14} /> Prev
            </button>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#2A2A2D] text-sm text-[#A0A0A0]
                hover:border-[#3A3A3D] hover:text-[#F5F5F5] hover:bg-[#1E1E21]
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#A0A0A0] disabled:hover:border-[#2A2A2D]
                transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/40"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </nav>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          lead={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default Leads;
