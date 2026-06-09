import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, Home, IndianRupee,
  Megaphone, Tag, FileText, Calendar, Clock,
  CheckCircle2, AlertCircle, X, Save, Plus,
} from 'lucide-react';

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

const INITIAL_FORM = {
  name: '', email: '', phone: '',
  property: '', budget: '',
  source: 'Website', status: 'New',
  notes: '',
  followUpDate: '', followUpTime: '',
};

const INITIAL_ERRORS = {
  name: '', email: '', phone: '', property: '', budget: '', source: '',
};

// ─── Toast ─────────────────────────────────────────────────────────────────
const Toast = ({ message, subtitle, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp">
      <div className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl max-w-sm
        ${type === 'success'
          ? 'bg-[#151517] border-[#C6FF00]/40'
          : 'bg-[#151517] border-red-500/40'}`}
      >
        <div className={`mt-0.5 flex-shrink-0 ${type === 'success' ? 'text-[#C6FF00]' : 'text-red-400'}`}>
          {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#F5F5F5] text-sm font-semibold">{message}</p>
          {subtitle && <p className="text-[#A0A0A0] text-xs mt-0.5">{subtitle}</p>}
        </div>
        <button onClick={onClose} aria-label="Dismiss notification"
          className="text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors flex-shrink-0 mt-0.5">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Form Field Wrapper ─────────────────────────────────────────────────────
const FieldWrapper = ({ label, required, error, children, hint }) => (
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

// ─── Input ──────────────────────────────────────────────────────────────────
const inputBase =
  'w-full h-10 px-3 rounded-lg bg-[#1E1E21] border text-sm text-[#F5F5F5] placeholder-[#4A4A4D] ' +
  'transition-all duration-150 outline-none ';

const inputClass = (error) =>
  inputBase +
  (error
    ? 'border-red-500/60 ring-2 ring-red-500/10 focus:border-red-500/80'
    : 'border-[#2A2A2D] hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10');

const selectClass = (error) =>
  'appearance-none ' + inputBase +
  (error
    ? 'border-red-500/60 ring-2 ring-red-500/10 focus:border-red-500/80'
    : 'border-[#2A2A2D] hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10') +
  ' cursor-pointer';

// ─── Section Card ───────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, accent = '#C6FF00', children, delay = 0 }) => (
  <div
    className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 animate-fadeInUp"
    style={{ animationDelay: `${delay}ms` }}
  >
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

// ─── Today in YYYY-MM-DD for min date ───────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

// ─── Validation ─────────────────────────────────────────────────────────────
const validate = (form) => {
  const errors = { ...INITIAL_ERRORS };
  let valid = true;

  if (!form.name.trim()) {
    errors.name = 'Customer name is required.'; valid = false;
  } else if (form.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters.'; valid = false;
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required.'; valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'; valid = false;
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.'; valid = false;
  } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
    errors.phone = 'Enter a valid 10-digit phone number.'; valid = false;
  }

  if (!form.property) {
    errors.property = 'Please select a property type.'; valid = false;
  }

  if (!form.budget) {
    errors.budget = 'Budget is required.'; valid = false;
  } else if (isNaN(Number(form.budget)) || Number(form.budget) <= 0) {
    errors.budget = 'Budget must be a positive number.'; valid = false;
  }

  if (!form.source) {
    errors.source = 'Please select a lead source.'; valid = false;
  }

  return { errors, valid };
};

// ─── Format budget preview ──────────────────────────────────────────────────
const previewBudget = (val) => {
  const n = Number(val);
  if (!val || isNaN(n)) return '';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

// ─── AddLead Page ────────────────────────────────────────────────────────────
const AddLead = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e, clearAfter = false) => {
    e.preventDefault();
    const { errors: newErrors, valid } = validate(form);
    if (!valid) {
      setErrors(newErrors);
      // Scroll to first error
      const el = document.querySelector('[aria-invalid="true"]');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    // Simulate async submission
    await new Promise(r => setTimeout(r, 600));
    setSubmitting(false);

    setToast({
      type: 'success',
      message: 'Lead Added Successfully',
      subtitle: `${form.name} has been added to the CRM.`,
    });

    if (clearAfter) {
      setForm(INITIAL_FORM);
      setErrors(INITIAL_ERRORS);
    } else {
      setTimeout(() => navigate('/leads'), 1800);
    }
  };

  const charCount = form.notes.length;
  const charLeft = 500 - charCount;

  return (
    <div className="space-y-6 pb-10 animate-fadeIn">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeInUp">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/leads')}
            aria-label="Back to Leads"
            className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#F5F5F5] text-sm
              transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/40 rounded-lg p-1 -ml-1"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Leads</span>
          </button>
          <div className="w-px h-5 bg-[#2A2A2D] hidden sm:block" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] leading-tight">
              Add New Lead
            </h1>
            <p className="text-[#A0A0A0] text-sm mt-0.5">
              Capture and organize new real estate opportunities efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <form
        onSubmit={(e) => handleSubmit(e, false)}
        noValidate
        className="space-y-5"
        aria-label="Add lead form"
      >

        {/* ── Section 1: Customer Information ──────────────────────── */}
        <SectionCard icon={User} title="Customer Information" delay={60}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <FieldWrapper label="Customer Name" required error={errors.name}>
              <input
                id="lead-name"
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Enter customer name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'err-name' : undefined}
                className={inputClass(errors.name)}
              />
            </FieldWrapper>

            {/* Email */}
            <FieldWrapper label="Email Address" required error={errors.email}>
              <input
                id="lead-email"
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="Enter email address"
                aria-invalid={!!errors.email}
                className={inputClass(errors.email)}
              />
            </FieldWrapper>

            {/* Phone */}
            <FieldWrapper label="Phone Number" required error={errors.phone}
              hint="Enter 10-digit mobile number">
              <input
                id="lead-phone"
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="e.g. 9876543210"
                maxLength={15}
                aria-invalid={!!errors.phone}
                className={inputClass(errors.phone)}
              />
            </FieldWrapper>
          </div>
        </SectionCard>

        {/* ── Section 2: Property Details ───────────────────────────── */}
        <SectionCard icon={Home} title="Property Details" accent="#A78BFA" delay={120}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Property Interest */}
            <FieldWrapper label="Property Interest" required error={errors.property}>
              <div className="relative">
                <select
                  id="lead-property"
                  value={form.property}
                  onChange={e => handleChange('property', e.target.value)}
                  aria-invalid={!!errors.property}
                  className={selectClass(errors.property)}
                >
                  <option value="">Select property type</option>
                  {PROPERTY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5D]">▾</div>
              </div>
            </FieldWrapper>

            {/* Budget */}
            <FieldWrapper label="Budget (INR)" required error={errors.budget}
              hint={form.budget ? `Preview: ${previewBudget(form.budget)}` : 'Example: 4500000'}>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5D] pointer-events-none" />
                <input
                  id="lead-budget"
                  type="number"
                  min="1"
                  value={form.budget}
                  onChange={e => handleChange('budget', e.target.value)}
                  placeholder="e.g. 4500000"
                  aria-invalid={!!errors.budget}
                  className={inputClass(errors.budget) + ' pl-8'}
                />
              </div>
            </FieldWrapper>
          </div>
        </SectionCard>

        {/* ── Section 3: Lead Information ───────────────────────────── */}
        <SectionCard icon={Tag} title="Lead Information" accent="#60A5FA" delay={180}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Source */}
            <FieldWrapper label="Lead Source" required error={errors.source}>
              <div className="relative">
                <select
                  id="lead-source"
                  value={form.source}
                  onChange={e => handleChange('source', e.target.value)}
                  aria-invalid={!!errors.source}
                  className={selectClass(errors.source)}
                >
                  {SOURCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5D]">▾</div>
              </div>
            </FieldWrapper>

            {/* Status */}
            <FieldWrapper label="Lead Status">
              <div className="relative">
                <select
                  id="lead-status"
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className={selectClass(false)}
                >
                  {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5D]">▾</div>
              </div>
            </FieldWrapper>
          </div>
        </SectionCard>

        {/* ── Section 4: Notes ──────────────────────────────────────── */}
        <SectionCard icon={FileText} title="Additional Notes" accent="#FB923C" delay={240}>
          <FieldWrapper label="Notes">
            <textarea
              id="lead-notes"
              value={form.notes}
              onChange={e => {
                if (e.target.value.length <= 500) handleChange('notes', e.target.value);
              }}
              placeholder="Add important notes about the lead..."
              rows={4}
              className={
                'w-full px-3 py-2.5 rounded-lg bg-[#1E1E21] border text-sm text-[#F5F5F5] placeholder-[#4A4A4D] resize-none ' +
                'border-[#2A2A2D] hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10 ' +
                'transition-all duration-150 outline-none'
              }
            />
            <div className="flex justify-end mt-1">
              <span className={`text-[11px] tabular-nums ${charLeft <= 50 ? 'text-orange-400' : 'text-[#5A5A5D]'}`}>
                {charLeft} characters remaining
              </span>
            </div>
          </FieldWrapper>
        </SectionCard>

        {/* ── Section 5: Follow-Up ──────────────────────────────────── */}
        <SectionCard icon={Calendar} title="Follow-Up Details" accent="#34D399" delay={300}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Follow-Up Date */}
            <FieldWrapper label="Follow-Up Date" hint="Cannot select past dates">
              <input
                id="lead-followup-date"
                type="date"
                value={form.followUpDate}
                min={todayStr()}
                onChange={e => handleChange('followUpDate', e.target.value)}
                className={
                  inputClass(false) +
                  ' [color-scheme:dark] cursor-pointer'
                }
              />
            </FieldWrapper>

            {/* Follow-Up Time */}
            <FieldWrapper label="Follow-Up Time">
              <input
                id="lead-followup-time"
                type="time"
                value={form.followUpTime}
                onChange={e => handleChange('followUpTime', e.target.value)}
                className={inputClass(false) + ' [color-scheme:dark] cursor-pointer'}
              />
            </FieldWrapper>
          </div>
        </SectionCard>

        {/* ── Action Buttons ────────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3
            bg-[#151517] border border-[#2A2A2D] rounded-xl px-6 py-4 animate-fadeInUp"
          style={{ animationDelay: '360ms' }}
        >
          {/* Cancel */}
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="h-10 px-5 rounded-lg text-sm text-[#A0A0A0] border border-[#2A2A2D]
              hover:border-[#3A3A3D] hover:text-[#F5F5F5] hover:bg-[#1E1E21]
              transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/30 order-last sm:order-first"
          >
            Cancel
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Save & Add Another */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={submitting}
              className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-medium
                border border-[#2A2A2D] text-[#A0A0A0]
                hover:border-[#C6FF00]/40 hover:text-[#C6FF00] hover:bg-[#1E1E21]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/30"
            >
              <Plus size={15} />
              Save &amp; Add Another
            </button>

            {/* Save Lead */}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold
                bg-[#C6FF00] text-[#0B0B0D]
                hover:bg-[#D7FF4A]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:ring-offset-2 focus:ring-offset-[#0B0B0D]"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-[#0B0B0D]/30 border-t-[#0B0B0D] rounded-full animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {submitting ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </div>
      </form>

      {/* ── Toast ────────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          subtitle={toast.subtitle}
          type={toast.type}
          onClose={dismissToast}
        />
      )}
    </div>
  );
};

export default AddLead;
