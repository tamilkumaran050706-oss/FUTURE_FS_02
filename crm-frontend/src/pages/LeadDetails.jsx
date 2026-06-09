import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Trash2, CalendarPlus, BadgeCheck, CheckCircle2,
  AlertCircle, AlertTriangle, X, Mail, Phone, Home, IndianRupee, Tag,
  FileText, Calendar, Clock, User, Smartphone, Sparkles, MapPin, Flag,
  CalendarDays, ClipboardList, ShieldAlert
} from 'lucide-react';
import { MOCK_LEADS, formatBudget, formatDate } from '../data/mockLeads';

// ─── Status Config ─────────────────────────────────────────────────────────
const statusConfig = {
  'New':                  { cls: 'bg-blue-500/15 text-blue-400 border-blue-500/30', label: 'New Lead' },
  'Contacted':            { cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', label: 'Contacted' },
  'Site Visit Scheduled': { cls: 'bg-purple-500/15 text-purple-400 border-purple-500/30', label: 'Site Visit' },
  'Negotiating':          { cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30', label: 'Negotiating' },
  'Closed Deal':          { cls: 'bg-green-500/15 text-green-400 border-green-500/30', label: 'Closed Deal' },
  'Not Interested':       { cls: 'bg-red-500/15 text-red-400 border-red-500/30', label: 'Not Interested' },
};

const priorityConfig = {
  High:   'text-red-400 bg-red-500/10 border-red-500/25',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25',
  Low:    'text-green-400 bg-green-500/10 border-green-500/25',
};

// ─── Toast Component ────────────────────────────────────────────────────────
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
          {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#F5F5F5] text-sm font-semibold">{title}</p>
          {message && <p className="text-[#A0A0A0] text-xs mt-0.5">{message}</p>}
        </div>
        <button onClick={onClose} aria-label="Dismiss Notification"
          className="text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors flex-shrink-0 mt-0.5">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Loading Skeleton Component ──────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`bg-[#1E1E21] rounded-lg animate-pulse ${className}`} />
);

const DetailSkeleton = () => (
  <div className="space-y-6 pb-12 animate-fadeIn">
    {/* Breadcrumb & Header Skeleton */}
    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>

    {/* Overview Card Skeleton */}
    <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>

    {/* Main Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Info Card Skeleton */}
        <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
        {/* Property Card Skeleton */}
        <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </div>
      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        <div className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Delete Confirmation Modal ───────────────────────────────────────────────
const DeleteModal = ({ leadName, onCancel, onConfirm }) => {
  const cancelRef = useRef(null);
  useEffect(() => { cancelRef.current?.focus(); }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="delete-title">
      <div className="absolute inset-0 bg-transparent" onClick={onCancel} />
      <div className="w-full max-w-md bg-[#151517] border border-[#2A2A2D] rounded-2xl shadow-2xl animate-fadeInUp p-6 relative z-10">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h3 id="delete-title" className="text-lg font-semibold text-[#F5F5F5] mb-2">Delete Lead</h3>
        <p className="text-sm text-[#A0A0A0] mb-6">
          Are you sure you want to delete <span className="text-[#F5F5F5] font-semibold">{leadName}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[#2A2A2D] text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1E1E21] text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-red-600 text-white hover:bg-red-500 text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Schedule Follow-Up Modal ────────────────────────────────────────────────
const ScheduleModal = ({ currentVal, onCancel, onConfirm }) => {
  const [date, setDate] = useState(currentVal?.date || '');
  const [time, setTime] = useState(currentVal?.time || '');
  const [task, setTask] = useState(currentVal?.task || '');
  const [error, setError] = useState('');
  const firstInputRef = useRef(null);

  useEffect(() => { firstInputRef.current?.focus(); }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      setError('Please select a date.');
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      setError('Follow-up date cannot be in the past.');
      return;
    }

    onConfirm({ date, time: time || '10:00', task: task || 'Call client to follow up' });
  };

  const getTodayStr = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="schedule-title">
      <div className="absolute inset-0 bg-transparent" onClick={onCancel} />
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#151517] border border-[#2A2A2D] rounded-2xl shadow-2xl animate-fadeInUp p-6 relative z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-3">
          <h3 id="schedule-title" className="text-lg font-semibold text-[#F5F5F5] flex items-center gap-2">
            <CalendarPlus size={20} className="text-[#C6FF00]" /> Schedule Follow-Up
          </h3>
          <button type="button" onClick={onCancel} className="text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A0A0A0]">Follow-Up Date *</label>
            <input
              ref={firstInputRef}
              type="date"
              min={getTodayStr()}
              value={date}
              onChange={(e) => { setDate(e.target.value); setError(''); }}
              className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] placeholder-[#4A4A4D] transition-all outline-none focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10 [color-scheme:dark] cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A0A0A0]">Preferred Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] transition-all outline-none focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10 [color-scheme:dark] cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#A0A0A0]">Next Action / Task Description</label>
            <input
              type="text"
              placeholder="e.g. Call to discuss layout, schedule site visit"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] placeholder-[#4A4A4D] transition-all outline-none focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-10 rounded-lg border border-[#2A2A2D] text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1E1E21] text-sm font-medium transition-all duration-150 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-10 rounded-lg bg-[#C6FF00] text-[#0B0B0D] hover:bg-[#D7FF4A] text-sm font-semibold transition-all duration-150 focus:outline-none"
          >
            Save Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Helper Component: Section Card ──────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, badge, children }) => (
  <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 hover:border-[#3A3A3D] transition-colors duration-200">
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2A2A2D]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#C6FF00]/10 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-[#C6FF00]" />
        </div>
        <h2 className="text-[#F5F5F5] text-sm font-semibold">{title}</h2>
      </div>
      {badge}
    </div>
    {children}
  </section>
);

// ─── Main LeadDetails Page ──────────────────────────────────────────────────
const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Notes state
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState([]);

  // Fetch / Enrich mock data
  useEffect(() => {
    let active = true;

    // Reset loading state asynchronously to avoid synchronous setState inside effect body
    const loadTimer = setTimeout(() => {
      if (active) setLoading(true);
    }, 0);

    const timer = setTimeout(() => {
      if (!active) return;
      const found = MOCK_LEADS.find((l) => l.id === Number(id));
      if (found) {
        // Enrich lead fields if missing
        const createdDay = 10 + (found.id % 15);
        const updatedDay = 1 + (found.id % 8);
        const createdAt = found.createdAt || `2026-05-${String(createdDay).padStart(2, '0')}`;
        const updatedAt = found.updatedAt || `2026-06-0${updatedDay}`;

        const agents = ['Rajesh Kumar', 'Anjali Deshmukh', 'Vikram Rathore', 'Neha Sen'];
        const assignedAgent = found.assignedAgent || agents[found.id % agents.length];

        const priorities = ['High', 'Medium', 'Low'];
        const priority = found.priority || priorities[found.id % priorities.length];

        const methods = ['WhatsApp', 'Phone', 'Email'];
        const preferredContactMethod = found.preferredContactMethod || methods[found.id % methods.length];

        const followUpTask = found.followUpTask || 'Follow up call on budget approval';

        const enrichedLead = {
          ...found,
          createdAt,
          updatedAt,
          assignedAgent,
          priority,
          preferredContactMethod,
          followUpTask,
        };

        setLead(enrichedLead);

        // Preload notes
        const defaultNotes = found.notes
          ? found.notes.split('\n').filter((n) => n.trim().length > 0)
          : ['Interested in premium amenities.', 'Requires home loan assistance.', 'Prefers weekend site visits.'];
        setNotesList(defaultNotes);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 600);

    return () => {
      active = false;
      clearTimeout(loadTimer);
      clearTimeout(timer);
    };
  }, [id]);

  const handleDismissToast = () => setToast(null);

  // ─── Actions ──────────────────────────────────────────────────────────────

  // Close Deal
  const handleMarkAsClosed = () => {
    if (!lead) return;

    // Mutate MOCK_LEADS in-memory
    const idx = MOCK_LEADS.findIndex((l) => l.id === lead.id);
    const todayStr = new Date().toISOString().split('T')[0];
    if (idx !== -1) {
      MOCK_LEADS[idx].status = 'Closed Deal';
      MOCK_LEADS[idx].updatedAt = todayStr;
    }

    setLead((prev) => ({
      ...prev,
      status: 'Closed Deal',
      updatedAt: todayStr,
    }));

    setToast({
      title: 'Deal Closed successfully',
      message: 'Congratulations! This lead is now marked as a Closed Deal.',
      type: 'success',
    });
  };

  // Schedule Follow Up
  const handleScheduleFollowUp = (scheduleData) => {
    if (!lead) return;

    // Mutate MOCK_LEADS in-memory
    const idx = MOCK_LEADS.findIndex((l) => l.id === lead.id);
    if (idx !== -1) {
      MOCK_LEADS[idx].followUp = scheduleData.date;
      MOCK_LEADS[idx].followUpTask = scheduleData.task;
    }

    setLead((prev) => ({
      ...prev,
      followUp: scheduleData.date,
      followUpTask: scheduleData.task,
      followUpTime: scheduleData.time,
      updatedAt: new Date().toISOString().split('T')[0],
    }));

    setShowScheduleModal(false);

    setToast({
      title: 'Follow-Up Scheduled',
      message: `Task scheduled for ${formatDate(scheduleData.date)} at ${scheduleData.time}.`,
      type: 'success',
    });
  };

  // Delete Lead
  const handleConfirmDelete = () => {
    if (!lead) return;

    // Splice in-memory
    const idx = MOCK_LEADS.findIndex((l) => l.id === lead.id);
    if (idx !== -1) {
      MOCK_LEADS.splice(idx, 1);
    }

    setShowDeleteModal(false);
    navigate('/leads', { replace: true });
  };

  // Add Note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const updatedNotes = [newNote.trim(), ...notesList];
    setNotesList(updatedNotes);

    // Save back to in-memory MOCK_LEADS
    const idx = MOCK_LEADS.findIndex((l) => l.id === lead.id);
    if (idx !== -1) {
      MOCK_LEADS[idx].notes = updatedNotes.join('\n');
    }

    setNewNote('');
    setToast({
      title: 'Note Added',
      message: 'Customer interaction notes have been updated successfully.',
      type: 'success',
    });
  };

  // ─── Formatting / Computing Helpers ──────────────────────────────────────────

  const isFollowUpOverdue = () => {
    if (!lead?.followUp) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateVal = new Date(lead.followUp);
    return dateVal < today;
  };

  const getTimelineStages = () => {
    if (!lead) return [];

    const defaultStages = [
      { key: 'New', label: 'Lead Created', date: lead.createdAt, icon: Sparkles, desc: 'Lead logged in CRM and assigned.' },
      { key: 'Contacted', label: 'Customer Contacted', date: '2026-05-18', icon: Phone, desc: 'Contacted. Customer requested brochures.' },
      { key: 'Site Visit Scheduled', label: 'Site Visit Scheduled', date: '2026-05-22', icon: Calendar, desc: 'Scheduled visit to check location & amenities.' },
      { key: 'Negotiating', label: 'Negotiation Started', date: '2026-05-28', icon: Pencil, desc: 'Detailed pricing discussions and customization choices.' },
      { key: 'Closed Deal', label: 'Deal Finalized', date: 'Pending', icon: BadgeCheck, desc: 'Deal closed and agreement finalized.' }
    ];

    if (lead.status === 'Not Interested') {
      return [
        { key: 'New', label: 'Lead Created', date: lead.createdAt, icon: Sparkles, desc: 'Lead logged in CRM.', state: 'done' },
        { key: 'Not Interested', label: 'Not Interested', date: lead.updatedAt, icon: ShieldAlert, desc: 'Customer marked as not interested in current deals.', state: 'current' }
      ];
    }

    const order = ['New', 'Contacted', 'Site Visit Scheduled', 'Negotiating', 'Closed Deal'];
    const currentIdx = order.indexOf(lead.status);

    return defaultStages.map((stage, idx) => {
      const state = idx < currentIdx ? 'done' : idx === currentIdx ? 'current' : 'pending';
      let dateVal = 'Pending';

      if (state === 'done') {
        // Adjust dates chronologically relative to lead.createdAt
        const baseDate = new Date(lead.createdAt);
        if (idx > 0) {
          const calculatedDate = new Date(baseDate);
          calculatedDate.setDate(baseDate.getDate() + idx * 3);
          const yyyy = calculatedDate.getFullYear();
          const mm = String(calculatedDate.getMonth() + 1).padStart(2, '0');
          const dd = String(calculatedDate.getDate()).padStart(2, '0');
          dateVal = `${yyyy}-${mm}-${dd}`;
        } else {
          dateVal = lead.createdAt;
        }
      } else if (state === 'current') {
        dateVal = lead.updatedAt;
      }

      if (dateVal !== 'Pending' && dateVal) {
        dateVal = formatDate(dateVal);
      }

      return {
        ...stage,
        state,
        date: dateVal
      };
    });
  };

  // Render Loading
  if (loading) {
    return <DetailSkeleton />;
  }

  // Render Not Found
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-5">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <h1 className="text-[#F5F5F5] text-xl font-bold mb-2">Lead Not Found</h1>
        <p className="text-[#A0A0A0] text-sm mb-6 max-w-sm">
          The lead with ID <span className="text-[#F5F5F5] font-semibold">#{id}</span> was not found in our records or has been deleted.
        </p>
        <Link to="/leads"
          className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm
            hover:bg-[#D7FF4A] transition-colors duration-150">
          <ArrowLeft size={16} /> Back to Leads
        </Link>
      </div>
    );
  }

  const timelineStages = getTimelineStages();

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-[#F5F5F5]">

      {/* ─── PAGE HEADER ───────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2D] pb-5">
        <div className="space-y-1">
          <Link to="/leads"
            className="inline-flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-[#C6FF00] transition-colors group mb-1">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Leads</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Lead Details</h1>
          <p className="text-xs text-[#A0A0A0]">View complete lead information and customer journey.</p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            to={`/leads/edit/${lead.id}`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-[#2A2A2D] hover:border-[#C6FF00]/40 text-[#A0A0A0] hover:text-[#C6FF00] text-sm font-semibold bg-[#151517] hover:bg-[#1E1E21] transition-all duration-200"
          >
            <Pencil size={14} /> Edit Lead
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-red-950/40 border border-red-900/30 hover:bg-red-900/40 text-red-400 text-sm font-semibold transition-all duration-200"
            aria-label="Delete Lead Profile"
          >
            <Trash2 size={14} /> Delete Lead
          </button>
        </div>
      </header>

      {/* ─── LEAD OVERVIEW CARD ─────────────────────────────────────────────── */}
      <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 relative overflow-hidden group hover:border-[#3A3A3D] transition-colors duration-200 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C6FF00] via-[#8EEA00] to-[#55B300]" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#C6FF00] to-[#7AC800] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#C6FF00]/10">
              <span className="text-[#0B0B0D] text-lg font-bold">
                {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-[#F5F5F5] text-lg font-bold leading-none">{lead.name}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${statusConfig[lead.status]?.cls || 'bg-[#2A2A2D] text-[#A0A0A0] border-[#3A3A3D]'}`}>
                  {lead.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A0A0A0]">
                <span>Lead ID:</span>
                <span className="text-white font-mono font-bold">#{lead.id.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>

          {/* Quick Overview Meta Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2.5 border-t md:border-t-0 border-[#2A2A2D] pt-4 md:pt-0 w-full md:w-auto">
            <div>
              <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold">Budget</p>
              <p className="text-sm font-bold text-[#C6FF00] tabular-nums mt-0.5">{formatBudget(lead.budget)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold">Source</p>
              <p className="text-sm font-semibold text-[#F5F5F5] mt-0.5">{lead.source}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold">Created On</p>
              <p className="text-sm font-medium text-[#F5F5F5] mt-0.5">{formatDate(lead.createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold">Last Update</p>
              <p className="text-sm font-medium text-[#F5F5F5] mt-0.5">{formatDate(lead.updatedAt)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN 2-COLUMN LAYOUT ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── COLUMN 1 & 2: DETAILED INFORMATION SECTIONS (LEFT) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* CUSTOMER INFORMATION SECTION */}
          <SectionCard icon={User} title="Customer Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold tracking-wider">Full Name</p>
                <p className="text-sm font-bold text-[#F5F5F5] mt-1">{lead.name}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] hover:border-[#C6FF00]/25 transition-all">
                <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold tracking-wider">Email Address</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C6FF00] hover:underline mt-1 break-all"
                  aria-label={`Send email to ${lead.email}`}
                >
                  <Mail size={13} className="flex-shrink-0" />
                  <span>{lead.email}</span>
                </a>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] hover:border-[#C6FF00]/25 transition-all">
                <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold tracking-wider">Phone Number</p>
                <a
                  href={`tel:${lead.phone}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C6FF00] hover:underline mt-1"
                  aria-label={`Call ${lead.name} phone number`}
                >
                  <Phone size={13} className="flex-shrink-0" />
                  <span>{lead.phone}</span>
                </a>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold tracking-wider">Preferred Contact Method</p>
                <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#F5F5F5] mt-1">
                  <Smartphone size={13} className="text-[#A0A0A0] flex-shrink-0" />
                  <span>{lead.preferredContactMethod}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* PROPERTY INTEREST SECTION */}
          <SectionCard icon={Home} title="Property Interest">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold tracking-wider">Property Type</p>
                <p className="text-sm font-bold text-[#F5F5F5] mt-1">{lead.property}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold tracking-wider">Preferred Area</p>
                <div className="inline-flex items-center gap-1 text-sm font-bold text-[#F5F5F5] mt-1">
                  <MapPin size={12} className="text-red-400" />
                  <span>{lead.location}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold tracking-wider">Budget Range</p>
                <div className="inline-flex items-center gap-1 text-sm font-bold text-[#C6FF00] mt-1">
                  <IndianRupee size={12} />
                  <span className="tabular-nums">{lead.budget.toLocaleString('en-IN')} ({formatBudget(lead.budget)})</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold tracking-wider">Additional Requirements</p>
                <p className="text-xs text-[#A0A0A0] mt-1 italic">
                  {lead.notes?.toLowerCase().includes('loan') ? 'Requires home loan financing support.' : 'Prefers immediate possession and premium specifications.'}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* NOTES & RECENT COMMENTS SECTION */}
          <SectionCard icon={FileText} title="Customer Interaction Notes">
            <div className="space-y-4">
              {/* Form to add note */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a new customer interaction note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 h-10 px-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-xs text-[#F5F5F5] placeholder-[#4A4A4D] transition-all outline-none focus:border-[#C6FF00]/60 focus:ring-1 focus:ring-[#C6FF00]/30"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-[#C6FF00] text-[#0B0B0D] hover:bg-[#D7FF4A] text-xs font-bold transition-all flex items-center justify-center flex-shrink-0"
                  aria-label="Add Interaction Note"
                >
                  Add Note
                </button>
              </form>

              {/* Scrollable list of notes */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#2A2A2D]">
                {notesList.length === 0 ? (
                  <p className="text-xs text-[#5A5A5D] italic">No notes logged for this customer.</p>
                ) : (
                  notesList.map((note, index) => (
                    <div key={index} className="p-3 rounded-lg bg-[#1E1E21]/60 border border-[#2A2A2D]/80 flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-[#A0A0A0] leading-relaxed">{note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SectionCard>

          {/* ACTIVITY PROGRESS TIMELINE */}
          <SectionCard icon={ClipboardList} title="Sales Pipeline Progression">
            <div className="relative border-l-2 border-[#2A2A2D] ml-4 pl-6 space-y-6 pt-2 pb-1">
              {timelineStages.map((stage, idx) => {
                const Icon = stage.icon;
                const isCurrent = stage.state === 'current';
                const isDone = stage.state === 'done';

                return (
                  <div key={stage.key} className="relative group/step animate-fadeInUp" style={{ animationDelay: `${idx * 80}ms` }}>
                    {/* Ring Indicator */}
                    <span className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                      ${isCurrent
                        ? 'bg-[#C6FF00] border-[#C6FF00] text-[#0B0B0D] scale-105 shadow-md shadow-[#C6FF00]/20'
                        : isDone
                          ? 'bg-[#C6FF00]/10 border-[#C6FF00]/50 text-[#C6FF00]'
                          : 'bg-[#151517] border-[#2A2A2D] text-[#5A5A5D]'}`}
                    >
                      <Icon size={12} />
                    </span>

                    {/* Step Content */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                        <h4 className={`text-xs font-bold ${isCurrent ? 'text-[#C6FF00]' : isDone ? 'text-[#F5F5F5]' : 'text-[#5A5A5D]'}`}>
                          {stage.label}
                        </h4>
                        <span className="text-[10px] text-[#5A5A5D] font-medium tabular-nums">{stage.date}</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isCurrent ? 'text-[#A0A0A0]' : isDone ? 'text-[#8A8A8D]' : 'text-[#4A4A4D]'}`}>
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

        </div>

        {/* ── COLUMN 3: SIDEBAR MANAGEMENT & QUICK ACTIONS (RIGHT) ── */}
        <div className="space-y-6">

          {/* QUICK ACTIONS PANEL */}
          <section className="bg-[#151517] border border-[#2A2A2D] rounded-xl p-5 space-y-3">
            <h3 className="text-[#F5F5F5] text-xs font-bold uppercase tracking-wider mb-2 text-[#5A5A5D]">Quick Actions</h3>
            
            <button
              onClick={handleMarkAsClosed}
              disabled={lead.status === 'Closed Deal'}
              className={`w-full flex items-center justify-center gap-2.5 h-10 px-4 rounded-lg text-xs font-bold transition-all duration-200
                ${lead.status === 'Closed Deal'
                  ? 'bg-green-950/20 border border-green-900/10 text-green-500/60 cursor-not-allowed'
                  : 'bg-[#C6FF00] text-[#0B0B0D] hover:bg-[#D7FF4A] shadow-md shadow-[#C6FF00]/5'}`}
            >
              <BadgeCheck size={15} />
              {lead.status === 'Closed Deal' ? 'Deal Already Closed' : 'Mark as Closed Deal'}
            </button>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="w-full flex items-center justify-center gap-2.5 h-10 px-4 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] hover:border-[#C6FF00]/40 text-[#A0A0A0] hover:text-[#C6FF00] text-xs font-bold transition-all duration-200"
            >
              <CalendarPlus size={15} /> Schedule Follow-Up
            </button>

            <Link
              to={`/leads/edit/${lead.id}`}
              className="w-full flex items-center justify-center gap-2.5 h-10 px-4 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] hover:border-[#C6FF00]/40 text-[#A0A0A0] hover:text-[#C6FF00] text-xs font-bold transition-all duration-200"
            >
              <Pencil size={14} /> Edit Lead Profile
            </Link>
          </section>

          {/* LEAD MANAGEMENT METADATA */}
          <SectionCard icon={Tag} title="Lead Management">
            <div className="space-y-3.5">
              <div className="flex justify-between items-center border-b border-[#2A2A2D]/40 pb-2">
                <span className="text-xs text-[#5A5A5D]">Lead Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig[lead.status]?.cls || 'bg-[#2A2A2D] text-[#A0A0A0] border-[#3A3A3D]'}`}>
                  {lead.status}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#2A2A2D]/40 pb-2">
                <span className="text-xs text-[#5A5A5D]">Priority Level</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityConfig[lead.priority] || ''}`}>
                  <Flag size={9} />
                  {lead.priority}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-[#2A2A2D]/40 pb-2">
                <span className="text-xs text-[#5A5A5D]">Lead Source</span>
                <span className="text-xs font-semibold text-[#F5F5F5]">{lead.source}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-[#5A5A5D]">Assigned Agent</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#C6FF00]/15 flex items-center justify-center flex-shrink-0">
                    <User size={10} className="text-[#C6FF00]" />
                  </div>
                  <span className="text-xs font-semibold text-[#F5F5F5]">{lead.assignedAgent}</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* UPCOMING FOLLOW-UP CARD */}
          <SectionCard
            icon={CalendarDays}
            title="Follow-Up Schedule"
            badge={
              isFollowUpOverdue() && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-950 border border-red-800 text-red-400">
                  <AlertCircle size={10} /> Overdue
                </span>
              )
            }
          >
            {lead.followUp ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                  <Calendar size={15} className="text-[#C6FF00] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold">Scheduled Date</p>
                    <p className="text-xs font-bold text-[#F5F5F5] mt-0.5">{formatDate(lead.followUp)}</p>
                  </div>
                </div>

                {lead.followUpTime && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                    <Clock size={15} className="text-[#C6FF00] flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold">Scheduled Time</p>
                      <p className="text-xs font-bold text-[#F5F5F5] mt-0.5">{lead.followUpTime}</p>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                  <p className="text-[10px] text-[#5A5A5D] uppercase font-semibold">Task Description</p>
                  <p className="text-xs text-[#A0A0A0] font-medium mt-1 leading-relaxed">
                    {lead.followUpTask}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-[#2A2A2D] rounded-lg p-4 bg-[#1E1E21]/20">
                <CalendarPlus size={20} className="text-[#5A5A5D] mb-2" />
                <p className="text-xs font-bold text-[#A0A0A0]">No follow-up scheduled</p>
                <p className="text-[10px] text-[#5A5A5D] mt-1 mb-3">Keep track of this lead by scheduling a follow-up.</p>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="h-8 px-3 rounded bg-[#C6FF00]/10 hover:bg-[#C6FF00]/20 text-[#C6FF00] border border-[#C6FF00]/30 hover:border-[#C6FF00]/60 text-xs font-bold transition-all"
                >
                  Schedule Now
                </button>
              </div>
            )}
          </SectionCard>

        </div>

      </div>

      {/* ─── MODALS & TOAST ─────────────────────────────────────────────────── */}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          leadName={lead.name}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Schedule Follow-up Modal */}
      {showScheduleModal && (
        <ScheduleModal
          currentVal={{ date: lead.followUp || '', time: lead.followUpTime || '', task: lead.followUpTask || '' }}
          onCancel={() => setShowScheduleModal(false)}
          onConfirm={handleScheduleFollowUp}
        />
      )}

      {/* Toast Feedback */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={handleDismissToast}
        />
      )}

    </div>
  );
};

export default LeadDetails;
