import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, Home, IndianRupee,
  Tag, FileText, Calendar, Clock, AlertCircle,
  CheckCircle2, X, Save, Edit3, AlertTriangle,
  BadgeCheck, Circle, Flag, MapPin
} from 'lucide-react';
import { MOCK_LEADS, formatBudget } from '../data/mockLeads';

// ─── Constants ─────────────────────────────────────────────────────────────
const PROPERTY_OPTIONS = [
  '1 BHK Apartment', '2 BHK Apartment', '3 BHK Apartment',
  'Villa', 'Independent House', 'Commercial Space', 'Plot/Land', 'Other',
];
const SOURCE_OPTIONS = [
  'Website', 'Referral', 'Facebook', 'Instagram', 'Walk-in', 'Property Portal', 'Other',
];
const STATUS_OPTIONS = [
  'New', 'Contacted', 'Site Visit Scheduled', 'Negotiating', 'Closed Deal', 'Not Interested',
];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

const PIPELINE_STAGES = [
  { key: 'New',                  label: 'New Lead',           icon: Circle },
  { key: 'Contacted',            label: 'Contacted',          icon: Phone },
  { key: 'Site Visit Scheduled', label: 'Site Visit',         icon: Calendar },
  { key: 'Negotiating',          label: 'Negotiating',        icon: Edit3 },
  { key: 'Closed Deal',          label: 'Closed',             icon: BadgeCheck },
];

const statusConfig = {
  'New':                  { cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  'Contacted':            { cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  'Site Visit Scheduled': { cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  'Negotiating':          { cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  'Closed Deal':          { cls: 'bg-green-500/15 text-green-400 border-green-500/30' },
  'Not Interested':       { cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
};

const priorityConfig = {
  High:   'text-red-400 bg-red-500/10 border-red-500/25',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25',
  Low:    'text-green-400 bg-green-500/10 border-green-500/25',
};

const todayStr = () => new Date().toISOString().split('T')[0];

const fmtDisplayDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const previewBudget = (val) => {
  const n = Number(val);
  if (!val || isNaN(n)) return '';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

// ─── Toast ─────────────────────────────────────────────────────────────────
const Toast = ({ title, message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp">
      <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl max-w-sm
        ${type === 'success' ? 'bg-[#151517] border-[#C6FF00]/40' : 'bg-[#151517] border-red-500/40'}`}>
        <div className={`mt-0.5 flex-shrink-0 ${type === 'success' ? 'text-[#C6FF00]' : 'text-red-400'}`}>
          {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#F5F5F5] text-sm font-semibold">{title}</p>
          {message && <p className="text-[#A0A0A0] text-xs mt-0.5">{message}</p>}
        </div>
        <button onClick={onClose} aria-label="Dismiss"
          className="text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors flex-shrink-0 mt-0.5">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Loading Skeleton ────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`bg-[#1E1E21] rounded-lg animate-pulse ${className}`} />
);

const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 space-y-4">
      <Skeleton className="h-4 w-40" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </div>
    <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 space-y-4">
      <Skeleton className="h-4 w-32" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </div>
  </div>
);

// ─── Field Wrapper ───────────────────────────────────────────────────────────
const FieldWrapper = ({ label, required, error, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-[#A0A0A0] flex items-center gap-1">
      {label}
      {required && <span className="text-[#C6FF00] text-xs">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-[#5A5A5D] text-[11px]">{hint}</p>}
    {error && (
      <p className="flex items-center gap-1 text-red-400 text-[11px]" role="alert">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

// ─── Input styles ────────────────────────────────────────────────────────────
const inputBase =
  'w-full h-10 px-3 rounded-lg bg-[#1E1E21] border text-sm text-[#F5F5F5] placeholder-[#4A4A4D] ' +
  'transition-all duration-150 outline-none ';
const inputCls = (err) => inputBase + (err
  ? 'border-red-500/60 ring-2 ring-red-500/10'
  : 'border-[#2A2A2D] hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10');
const selectCls = (err) => 'appearance-none ' + inputBase + (err
  ? 'border-red-500/60 ring-2 ring-red-500/10'
  : 'border-[#2A2A2D] hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10') + ' cursor-pointer';

// ─── Section Card ────────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, accent = '#C6FF00', delay = 0, children }) => (
  <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 animate-fadeInUp"
    style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#2A2A2D]">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${accent}18` }}>
        <Icon size={15} style={{ color: accent }} />
      </div>
      <h2 className="text-[#F5F5F5] text-sm font-semibold">{title}</h2>
    </div>
    {children}
  </div>
);

// ─── Status Timeline ─────────────────────────────────────────────────────────
const StatusTimeline = ({ currentStatus }) => {
  const isNotInterested = currentStatus === 'Not Interested';
  const currentIdx = PIPELINE_STAGES.findIndex(s => s.key === currentStatus);

  return (
    <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 animate-fadeInUp"
      style={{ animationDelay: '120ms' }}>
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#2A2A2D]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#C6FF00]/10">
          <BadgeCheck size={15} className="text-[#C6FF00]" />
        </div>
        <h2 className="text-[#F5F5F5] text-sm font-semibold">Sales Pipeline</h2>
      </div>

      {isNotInterested ? (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/25">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-medium">Not Interested</p>
            <p className="text-[#5A5A5D] text-[11px] mt-0.5">This lead has been marked as not interested.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-0 overflow-x-auto pb-1">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isDone    = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const Icon      = stage.icon;

            return (
              <React.Fragment key={stage.key}>
                {/* Stage node */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[72px]">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200
                    ${isCurrent
                      ? 'bg-[#C6FF00] border-[#C6FF00] text-[#0B0B0D]'
                      : isDone
                        ? 'bg-[#C6FF00]/20 border-[#C6FF00]/50 text-[#C6FF00]'
                        : 'bg-[#1E1E21] border-[#2A2A2D] text-[#3A3A3D]'}`}
                  >
                    <Icon size={15} />
                  </div>
                  <p className={`text-[10px] text-center leading-tight px-1
                    ${isCurrent ? 'text-[#C6FF00] font-semibold' : isDone ? 'text-[#A0A0A0]' : 'text-[#3A3A3D]'}`}>
                    {stage.label}
                  </p>
                </div>

                {/* Connector */}
                {idx < PIPELINE_STAGES.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-5 min-w-[16px]
                    ${idx < currentIdx ? 'bg-[#C6FF00]/40' : 'bg-[#2A2A2D]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Validate ────────────────────────────────────────────────────────────────
const validate = (form) => {
  const errors = {};
  let valid = true;

  if (!form.name?.trim()) { errors.name = 'Customer name is required.'; valid = false; }
  else if (form.name.trim().length < 3) { errors.name = 'Name must be at least 3 characters.'; valid = false; }

  if (!form.email?.trim()) { errors.email = 'Email is required.'; valid = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Enter a valid email.'; valid = false; }

  if (!form.phone?.trim()) { errors.phone = 'Phone number is required.'; valid = false; }
  else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) { errors.phone = 'Enter a valid 10-digit number.'; valid = false; }

  if (!form.property) { errors.property = 'Select a property type.'; valid = false; }

  if (!form.budget) { errors.budget = 'Budget is required.'; valid = false; }
  else if (isNaN(Number(form.budget)) || Number(form.budget) <= 0) { errors.budget = 'Budget must be a positive number.'; valid = false; }

  if (form.followUpDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(form.followUpDate);
    if (selected < today) {
      errors.followUpDate = 'Follow-up date cannot be in the past.';
      valid = false;
    }
  }

  return { errors, valid };
};

// ─── EditLead Page ───────────────────────────────────────────────────────────
const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const notesRef = useRef(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const adjustNotesHeight = () => {
    const textarea = notesRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Load mock lead on mount
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const found = MOCK_LEADS.find(l => l.id === Number(id));
      if (found) {
        // Compute mock created & updated dates dynamically if not present
        const createdDay = 10 + (found.id % 15);
        const updatedDay = 1 + (found.id % 8);
        const createdAt = found.createdAt || `2026-05-${String(createdDay).padStart(2, '0')}`;
        const updatedAt = found.updatedAt || `2026-06-0${updatedDay}`;

        const updatedLead = {
          ...found,
          createdAt,
          updatedAt,
        };
        setLead(updatedLead);
        setForm({
          name:          updatedLead.name,
          email:         updatedLead.email,
          phone:         updatedLead.phone.replace(/\D/g, '').slice(-10),
          property:      updatedLead.property,
          budget:        String(updatedLead.budget),
          source:        updatedLead.source,
          status:        updatedLead.status,
          followUpDate:  updatedLead.followUp ?? '',
          followUpTime:  '',
          priority:      'Medium',
          notes:         updatedLead.notes ?? '',
        });
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  // Adjust notes height whenever notes change or lead loads
  useEffect(() => {
    if (lead) {
      setTimeout(adjustNotesHeight, 50);
    }
  }, [lead]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e, stayOnPage = false) => {
    e.preventDefault();
    const { errors: newErr, valid } = validate(form);
    if (!valid) { setErrors(newErr); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 650));
    setSubmitting(false);

    // Update memory lead array
    const leadIndex = MOCK_LEADS.findIndex(l => l.id === Number(id));
    const nowStr = new Date().toISOString().split('T')[0];
    const updatedLeadData = {
      name: form.name,
      email: form.email,
      phone: form.phone.startsWith('+91') ? form.phone : `+91 ${form.phone.slice(-10)}`,
      property: form.property,
      budget: Number(form.budget),
      source: form.source,
      status: form.status,
      followUp: form.followUpDate || null,
      notes: form.notes || null,
      updatedAt: nowStr,
    };

    if (leadIndex !== -1) {
      MOCK_LEADS[leadIndex] = {
        ...MOCK_LEADS[leadIndex],
        ...updatedLeadData,
      };
    }

    setLead(prev => ({
      ...prev,
      ...updatedLeadData,
      createdAt: prev?.createdAt,
      id: prev?.id,
    }));

    setToast({
      type: 'success',
      title: 'Lead Updated Successfully',
      message: 'The lead information has been updated.',
    });

    if (!stayOnPage) {
      setTimeout(() => navigate('/leads'), 1800);
    }
  };

  const charLeft = 1000 - (form.notes?.length ?? 0);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 pb-10 animate-fadeIn">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-32" />
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <FormSkeleton />
      </div>
    );
  }

  // ── Not Found ────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h1 className="text-[#F5F5F5] text-xl font-bold mb-1">Lead Not Found</h1>
        <p className="text-[#A0A0A0] text-sm mb-6">
          No lead with ID <span className="text-[#F5F5F5] font-medium">#{id}</span> was found.
        </p>
        <button onClick={() => navigate('/leads')}
          className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm
            hover:bg-[#D7FF4A] transition-colors duration-150">
          <ArrowLeft size={15} /> Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-fadeIn">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 animate-fadeInUp">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate('/leads')} aria-label="Back to Leads"
            className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#F5F5F5] text-sm mt-1
              transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/40 rounded-lg p-1 -ml-1 flex-shrink-0">
            <ArrowLeft size={16} />
            <span>Back to Leads</span>
          </button>
          <div className="w-px h-10 bg-[#2A2A2D] hidden sm:block mt-0.5" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] leading-tight">
              Edit Lead
            </h1>
            <p className="text-[#A0A0A0] text-sm mt-0.5">
              Update lead information and track progress through the sales pipeline.
            </p>
          </div>
        </div>
        {/* Lead ID chip */}
        <div className="flex items-center gap-2 bg-[#151517] border border-[#2A2A2D] rounded-lg px-3 py-1.5 self-start flex-shrink-0">
          <span className="text-[#5A5A5D] text-xs">Lead ID</span>
          <span className="text-[#C6FF00] text-xs font-bold">#{lead.id.toString().padStart(4, '0')}</span>
        </div>
      </section>

      {/* ── Lead Summary Card ────────────────────────────────────────── */}
      <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 animate-fadeInUp"
        style={{ animationDelay: '60ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C6FF00] to-[#7AC800] flex items-center justify-center flex-shrink-0">
            <span className="text-[#0B0B0D] text-sm font-bold">
              {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>

          {/* Core info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-[#F5F5F5] font-semibold text-base">{lead.name}</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border
                ${statusConfig[lead.status]?.cls ?? 'bg-[#2A2A2D] text-[#A0A0A0] border-[#3A3A3D]'}`}>
                {lead.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#5A5A5D] text-xs">
              <span className="flex items-center gap-1"><Mail size={10} className="text-[#3A3A3D]" />{lead.email}</span>
              <span className="flex items-center gap-1"><Phone size={10} className="text-[#3A3A3D]" />{lead.phone}</span>
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="bg-[#1E1E21] border border-[#2A2A2D] rounded px-2 py-1 text-[#A0A0A0]">
              Source: <span className="text-[#F5F5F5]">{lead.source}</span>
            </span>
            <span className="bg-[#1E1E21] border border-[#2A2A2D] rounded px-2 py-1 text-[#A0A0A0]">
              Created: <span className="text-[#F5F5F5]">{fmtDisplayDate(lead.createdAt)}</span>
            </span>
            <span className="bg-[#1E1E21] border border-[#2A2A2D] rounded px-2 py-1 text-[#A0A0A0]">
              Last Updated: <span className="text-[#F5F5F5]">{fmtDisplayDate(lead.updatedAt)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Pipeline Timeline ─────────────────────────────────────────── */}
      <StatusTimeline currentStatus={form.status || lead.status} />

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <form onSubmit={(e) => handleSubmit(e, false)} noValidate className="space-y-6" aria-label="Edit lead form">
        
        {/* Responsive Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
          
          {/* Column 1: Core Fields & Notes */}
          <div className="space-y-6">
            {/* Section 1 – Customer Information */}
            <SectionCard icon={User} title="Customer Information" delay={160}>
              <div className="space-y-4">
                <FieldWrapper label="Customer Name" required error={errors.name}>
                  <input id="edit-name" type="text" value={form.name ?? ''}
                    onChange={e => handleChange('name', e.target.value)}
                    aria-invalid={!!errors.name} placeholder="Enter customer name"
                    className={inputCls(errors.name)} />
                </FieldWrapper>

                <FieldWrapper label="Email Address" required error={errors.email}>
                  <input id="edit-email" type="email" value={form.email ?? ''}
                    onChange={e => handleChange('email', e.target.value)}
                    aria-invalid={!!errors.email} placeholder="Enter email address"
                    className={inputCls(errors.email)} />
                </FieldWrapper>

                <FieldWrapper label="Phone Number" required error={errors.phone} hint="10-digit mobile number">
                  <input id="edit-phone" type="tel" value={form.phone ?? ''}
                    onChange={e => handleChange('phone', e.target.value)}
                    aria-invalid={!!errors.phone} placeholder="e.g. 9876543210" maxLength={15}
                    className={inputCls(errors.phone)} />
                </FieldWrapper>
              </div>
            </SectionCard>

            {/* Section 2 – Property Details */}
            <SectionCard icon={Home} title="Property Details" accent="#A78BFA" delay={200}>
              <div className="space-y-4">
                <FieldWrapper label="Property Interest" required error={errors.property}>
                  <div className="relative">
                    <select id="edit-property" value={form.property ?? ''}
                      onChange={e => handleChange('property', e.target.value)}
                      aria-invalid={!!errors.property} className={selectCls(errors.property)}>
                      <option value="">Select property type</option>
                      {PROPERTY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5D]">▾</div>
                  </div>
                </FieldWrapper>

                <FieldWrapper label="Budget (INR)" required error={errors.budget}
                  hint={form.budget ? `Preview: ${previewBudget(form.budget)}` : 'e.g. 4500000'}>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5D] pointer-events-none" />
                    <input id="edit-budget" type="number" min="1" value={form.budget ?? ''}
                      onChange={e => handleChange('budget', e.target.value)}
                      aria-invalid={!!errors.budget} placeholder="e.g. 4500000"
                      className={inputCls(errors.budget) + ' pl-8'} />
                  </div>
                </FieldWrapper>
              </div>
            </SectionCard>

            {/* Section 5 – Notes */}
            <SectionCard icon={FileText} title="Lead Notes" accent="#FB923C" delay={320}>
              <FieldWrapper label="Notes">
                <textarea
                  ref={notesRef}
                  id="edit-notes"
                  value={form.notes ?? ''}
                  onChange={e => {
                    if (e.target.value.length <= 1000) {
                      handleChange('notes', e.target.value);
                      adjustNotesHeight();
                    }
                  }}
                  placeholder="Update notes regarding customer interactions..."
                  className="w-full px-3 py-2.5 rounded-lg bg-[#1E1E21] border text-sm text-[#F5F5F5] placeholder-[#4A4A4D] resize-none
                    border-[#2A2A2D] hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10
                    transition-all duration-150 outline-none overflow-hidden"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-[11px] tabular-nums ${charLeft <= 100 ? 'text-orange-400' : 'text-[#5A5A5D]'}`}>
                    {charLeft} characters remaining
                  </span>
                </div>
              </FieldWrapper>
            </SectionCard>
          </div>

          {/* Column 2: Lead Management & Follow-ups */}
          <div className="space-y-6">
            {/* Section 3 – Lead Management */}
            <SectionCard icon={Tag} title="Lead Management" accent="#60A5FA" delay={240}>
              <div className="space-y-4">
                <FieldWrapper label="Lead Source">
                  <div className="relative">
                    <select id="edit-source" value={form.source ?? ''}
                      onChange={e => handleChange('source', e.target.value)}
                      className={selectCls(false)}>
                      {SOURCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5D]">▾</div>
                  </div>
                </FieldWrapper>

                <FieldWrapper label="Lead Status">
                  <div className="relative">
                    <select id="edit-status" value={form.status ?? ''}
                      onChange={e => handleChange('status', e.target.value)}
                      className={selectCls(false)}>
                      {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5D]">▾</div>
                  </div>
                  {/* Live status badge preview */}
                  {form.status && (
                    <span className={`mt-1 self-start inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border
                      ${statusConfig[form.status]?.cls ?? 'bg-[#2A2A2D] text-[#A0A0A0] border-[#3A3A3D]'}`}>
                      {form.status}
                    </span>
                  )}
                </FieldWrapper>
              </div>
            </SectionCard>

            {/* Section 4 – Follow-Up Management */}
            <SectionCard icon={Calendar} title="Follow-Up Management" accent="#34D399" delay={280}>
              <div className="space-y-4">
                <FieldWrapper label="Follow-Up Date" hint="Cannot select past dates" error={errors.followUpDate}>
                  <input id="edit-followup-date" type="date" value={form.followUpDate ?? ''}
                    min={todayStr()} onChange={e => handleChange('followUpDate', e.target.value)}
                    className={inputCls(errors.followUpDate) + ' [color-scheme:dark] cursor-pointer'} />
                </FieldWrapper>

                <FieldWrapper label="Follow-Up Time">
                  <input id="edit-followup-time" type="time" value={form.followUpTime ?? ''}
                    onChange={e => handleChange('followUpTime', e.target.value)}
                    className={inputCls(false) + ' [color-scheme:dark] cursor-pointer'} />
                </FieldWrapper>

                <FieldWrapper label="Priority Level">
                  <div className="relative">
                    <select id="edit-priority" value={form.priority ?? 'Medium'}
                      onChange={e => handleChange('priority', e.target.value)}
                      className={selectCls(false)}>
                      {PRIORITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5D]">▾</div>
                  </div>
                  {form.priority && (
                    <span className={`mt-1 self-start inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border
                      ${priorityConfig[form.priority] ?? ''}`}>
                      <Flag size={9} /> {form.priority}
                    </span>
                  )}
                </FieldWrapper>
              </div>
            </SectionCard>
          </div>

        </div>

        {/* ── Action Buttons ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3
          bg-[#151517] border border-[#2A2A2D] rounded-xl px-6 py-4 animate-fadeInUp animate-pulse-none"
          style={{ animationDelay: '380ms' }}>

          {/* Cancel */}
          <button type="button" onClick={() => navigate('/leads')}
            className="h-10 px-5 rounded-lg text-sm text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1E1E21]
              transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/30 order-last sm:order-first">
            Cancel
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Save & Continue */}
            <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={submitting}
              className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-medium
                border border-[#2A2A2D] text-[#A0A0A0]
                hover:border-[#C6FF00]/40 hover:text-[#C6FF00] hover:bg-[#1E1E21]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/30">
              <Edit3 size={14} />
              Save &amp; Continue Editing
            </button>

            {/* Save Changes */}
            <button type="submit" disabled={submitting}
              className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold
                bg-[#C6FF00] text-[#0B0B0D] hover:bg-[#D7FF4A]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 focus:ring-offset-[#0B0B0D]">
              {submitting
                ? <span className="w-4 h-4 border-2 border-[#0B0B0D]/30 border-t-[#0B0B0D] rounded-full animate-spin" />
                : <Save size={15} />}
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && (
        <Toast title={toast.title} message={toast.message}
          type={toast.type} onClose={dismissToast} />
      )}
    </div>
  );
};

export default EditLead;
