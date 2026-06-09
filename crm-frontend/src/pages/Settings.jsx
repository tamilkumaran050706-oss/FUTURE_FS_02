import { useState } from 'react';
import {
  User, Bell, Palette, Shield, Database, Save,
  Camera, Mail, Phone, Building2, Globe, Check,
  Eye, EyeOff, Lock, Trash2, Download, Upload,
  Sun, Moon, Monitor, ChevronRight, AlertTriangle,
  CheckCircle2, X, ToggleLeft, ToggleRight, Sliders,
} from 'lucide-react';

// ─── Toast Component ─────────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeInUp" role="alert">
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#C6FF00]/40 bg-[#151517] shadow-2xl max-w-sm">
        <CheckCircle2 size={18} className="text-[#C6FF00] flex-shrink-0" />
        <p className="text-[#F5F5F5] text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors ml-1"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────
const Toggle = ({ enabled, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={enabled}
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF00]/50 ${
      enabled ? 'bg-[#C6FF00] border-[#C6FF00]' : 'bg-[#2A2A2D] border-[#2A2A2D]'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full shadow transform transition-transform duration-200 ${
        enabled
          ? 'translate-x-4 bg-[#0B0B0D]'
          : 'translate-x-0 bg-[#5A5A5D]'
      }`}
    />
  </button>
);

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const SettingsSection = ({ icon: Icon, title, description, children, delay = 0 }) => (
  <section
    className="bg-[#151517] border border-[#2A2A2D] rounded-xl overflow-hidden hover:border-[#3A3A3D] transition-colors duration-200 animate-fadeInUp"
    style={{ animationDelay: `${delay}ms` }}
    aria-labelledby={`section-${title.toLowerCase().replace(/\s/g, '-')}`}
  >
    {/* Section Header */}
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2A2A2D] bg-[#0F0F11]">
      <div className="w-8 h-8 rounded-lg bg-[#C6FF00]/10 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-[#C6FF00]" />
      </div>
      <div>
        <h2
          id={`section-${title.toLowerCase().replace(/\s/g, '-')}`}
          className="text-sm font-semibold text-[#F5F5F5]"
        >
          {title}
        </h2>
        {description && (
          <p className="text-[11px] text-[#5A5A5D] mt-0.5">{description}</p>
        )}
      </div>
    </div>

    {/* Section Body */}
    <div className="p-6">{children}</div>
  </section>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const InputField = ({ label, id, type = 'text', value, onChange, placeholder, hint, icon: Icon, readOnly = false }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-medium text-[#A0A0A0]">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5D] pointer-events-none">
          <Icon size={14} />
        </span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full h-10 ${Icon ? 'pl-9' : 'pl-3'} pr-3 rounded-lg bg-[#1E1E21] border text-sm text-[#F5F5F5] placeholder-[#4A4A4D] transition-all duration-200 outline-none
          ${readOnly
            ? 'border-[#2A2A2D] text-[#5A5A5D] cursor-not-allowed'
            : 'border-[#2A2A2D] hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10'
          }`}
      />
    </div>
    {hint && <p className="text-[11px] text-[#5A5A5D]">{hint}</p>}
  </div>
);

// ─── Notification Row ─────────────────────────────────────────────────────────
const NotificationRow = ({ label, description, enabled, onChange, id }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#1E1E21] last:border-0">
    <div className="flex-1 min-w-0 pr-4">
      <p className="text-sm font-medium text-[#F5F5F5]">{label}</p>
      <p className="text-[11px] text-[#5A5A5D] mt-0.5">{description}</p>
    </div>
    <Toggle id={id} enabled={enabled} onChange={onChange} />
  </div>
);

// ─── Theme Option Card ────────────────────────────────────────────────────────
const ThemeCard = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer focus:outline-none
      ${active
        ? 'border-[#C6FF00] bg-[#C6FF00]/5'
        : 'border-[#2A2A2D] bg-[#1E1E21] hover:border-[#3A3A3D]'
      }`}
    aria-pressed={active}
    aria-label={`${label} theme`}
  >
    <Icon size={20} className={active ? 'text-[#C6FF00]' : 'text-[#5A5A5D]'} />
    <span className={`text-xs font-medium ${active ? 'text-[#C6FF00]' : 'text-[#A0A0A0]'}`}>
      {label}
    </span>
    {active && (
      <span className="w-4 h-4 rounded-full bg-[#C6FF00] flex items-center justify-center">
        <Check size={10} className="text-[#0B0B0D]" />
      </span>
    )}
  </button>
);

// ─── Accent Color Swatch ──────────────────────────────────────────────────────
const ColorSwatch = ({ color, label, active, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 group"
    aria-label={`Select ${label} accent color`}
    aria-pressed={active}
  >
    <div
      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
        active ? 'border-white scale-110' : 'border-transparent hover:scale-105'
      }`}
      style={{ backgroundColor: color }}
    />
    <span className="text-[10px] text-[#5A5A5D] group-hover:text-[#A0A0A0] transition-colors">
      {label}
    </span>
  </button>
);

// ─── Danger Zone Action ───────────────────────────────────────────────────────
const DangerAction = ({ icon: Icon, title, description, actionLabel, onClick, color = 'red' }) => {
  const colorMap = {
    red:    { bg: 'bg-red-500/5 hover:bg-red-500/10', border: 'border-red-900/30', icon: 'text-red-400', btn: 'bg-red-950/60 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-900/40' },
    yellow: { bg: 'bg-yellow-500/5 hover:bg-yellow-500/10', border: 'border-yellow-900/30', icon: 'text-yellow-400', btn: 'bg-yellow-950/60 hover:bg-yellow-900/60 text-yellow-400 hover:text-yellow-300 border border-yellow-900/40' },
  };
  const c = colorMap[color];

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${c.border} ${c.bg} transition-colors duration-200`}>
      <div className="flex items-start gap-3">
        <Icon size={16} className={`${c.icon} flex-shrink-0 mt-0.5`} />
        <div>
          <p className="text-sm font-medium text-[#F5F5F5]">{title}</p>
          <p className="text-[11px] text-[#5A5A5D] mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`ml-4 flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${c.btn}`}
      >
        {actionLabel}
      </button>
    </div>
  );
};

// ─── Main Settings Component ──────────────────────────────────────────────────
const Settings = () => {
  // ── Profile State ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name: 'Tamil Kumaran',
    email: 'tamil@crm.com',
    phone: '+91 98765 43210',
    company: 'LeadEstate Realty Pvt. Ltd.',
    website: 'www.leadestate.in',
    bio: 'Senior Real Estate Agent specializing in premium residential and commercial properties across Bangalore.',
  });

  // ── Password State ─────────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  // ── Notification State ─────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState({
    newLead:      true,
    followUpDue:  true,
    dealClosed:   true,
    emailDigest:  false,
    smsAlerts:    false,
    browserPush:  true,
    weeklyReport: true,
    systemAlerts: true,
  });

  // ── Appearance State ──────────────────────────────────────────────────────
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#C6FF00');
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [sidebarCollapsedDefault, setSidebarCollapsedDefault] = useState(false);

  // ── Preferences ───────────────────────────────────────────────────────────
  const [prefs, setPrefs] = useState({
    defaultLeadsView: 'table',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    language: 'en',
    leadsPerPage: '25',
  });

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile updated successfully.');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!password.current) return showToast('Please enter your current password.');
    if (password.new !== password.confirm) return showToast('New passwords do not match.');
    setPassword({ current: '', new: '', confirm: '' });
    showToast('Password changed successfully.');
  };

  const handleSaveNotifications = () => showToast('Notification preferences saved.');
  const handleSaveAppearance = () => showToast('Appearance settings applied.');
  const handleSavePreferences = () => showToast('Preferences saved successfully.');

  const accents = [
    { color: '#C6FF00', label: 'Lime' },
    { color: '#60A5FA', label: 'Blue' },
    { color: '#A78BFA', label: 'Violet' },
    { color: '#F43F5E', label: 'Rose' },
    { color: '#34D399', label: 'Emerald' },
    { color: '#FBBF24', label: 'Amber' },
  ];

  // ── Nav Tabs ──────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'profile',       label: 'Profile',       icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance',    label: 'Appearance',    icon: Palette },
    { id: 'preferences',   label: 'Preferences',   icon: Sliders },
    { id: 'security',      label: 'Security',      icon: Shield },
    { id: 'data',          label: 'Data & Privacy', icon: Database },
  ];
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 pb-16 animate-fadeIn text-[#F5F5F5]">

      {/* ─── PAGE HEADER ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#2A2A2D] pb-5 animate-fadeInUp">
        <div className="space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-xs text-[#A0A0A0]">Manage your account, preferences, and CRM configuration.</p>
        </div>

        {/* CRM Version Badge */}
        <div className="flex items-center gap-2 bg-[#151517] border border-[#2A2A2D] rounded-lg px-3 py-2 text-xs text-[#5A5A5D] self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-pulseSlow" />
          LeadEstate CRM &mdash; v1.0.0
        </div>
      </header>

      {/* ─── LAYOUT: TAB SIDEBAR + CONTENT ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Tab Navigation (vertical on desktop, horizontal scroll on mobile) ── */}
        <nav
          aria-label="Settings navigation"
          className="lg:w-52 flex-shrink-0 animate-slideInLeft"
        >
          {/* Mobile: horizontal scrollable pill tabs */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150
                  ${activeTab === id
                    ? 'bg-[#C6FF00] text-[#0B0B0D]'
                    : 'bg-[#151517] border border-[#2A2A2D] text-[#A0A0A0] hover:text-[#F5F5F5]'
                  }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Desktop: vertical sidebar tabs */}
          <div className="hidden lg:flex flex-col bg-[#151517] border border-[#2A2A2D] rounded-xl overflow-hidden">
            {tabs.map(({ id, label, icon: Icon }, idx) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-150 text-left group
                  ${idx !== tabs.length - 1 ? 'border-b border-[#1E1E21]' : ''}
                  ${activeTab === id
                    ? 'bg-[#C6FF00]/8 text-[#C6FF00] border-l-2 !border-l-[#C6FF00]'
                    : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1E1E21]'
                  }`}
                aria-current={activeTab === id ? 'page' : undefined}
              >
                <Icon size={15} className={`flex-shrink-0 ${activeTab === id ? 'text-[#C6FF00]' : 'text-[#5A5A5D] group-hover:text-[#A0A0A0]'}`} />
                <span>{label}</span>
                {activeTab === id && (
                  <ChevronRight size={13} className="ml-auto text-[#C6FF00]" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Settings Content ──────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* ════════════════════════════════════════════════════════════════
              PROFILE TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <>
              {/* Profile Card */}
              <SettingsSection
                icon={User}
                title="Public Profile"
                description="Your name and info visible to team members."
                delay={0}
              >
                {/* Avatar Row */}
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#2A2A2D]">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C6FF00] to-[#7AC800] flex items-center justify-center shadow-lg shadow-[#C6FF00]/10">
                      <span className="text-[#0B0B0D] text-xl font-bold">TK</span>
                    </div>
                    <button
                      aria-label="Change profile photo"
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2A2A2D] border border-[#3A3A3D] flex items-center justify-center hover:bg-[#3A3A3D] transition-colors"
                    >
                      <Camera size={11} className="text-[#A0A0A0]" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F5F5F5]">Tamil Kumaran</p>
                    <p className="text-xs text-[#5A5A5D] mt-0.5">Admin — LeadEstate CRM</p>
                    <button className="mt-2 text-xs text-[#C6FF00] hover:text-[#D7FF4A] transition-colors font-medium">
                      Upload new photo
                    </button>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      id="profile-name"
                      label="Full Name"
                      icon={User}
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Your full name"
                    />
                    <InputField
                      id="profile-email"
                      label="Email Address"
                      type="email"
                      icon={Mail}
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="you@example.com"
                    />
                    <InputField
                      id="profile-phone"
                      label="Phone Number"
                      icon={Phone}
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 00000 00000"
                    />
                    <InputField
                      id="profile-company"
                      label="Company"
                      icon={Building2}
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      placeholder="Your company name"
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        id="profile-website"
                        label="Website"
                        icon={Globe}
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        placeholder="www.yourwebsite.com"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label htmlFor="profile-bio" className="text-xs font-medium text-[#A0A0A0]">Bio</label>
                      <textarea
                        id="profile-bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                        placeholder="Brief bio about yourself..."
                        className="w-full px-3 py-2.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] placeholder-[#4A4A4D] outline-none resize-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm hover:bg-[#D7FF4A] active:scale-[0.98] transition-all duration-150"
                    >
                      <Save size={14} />
                      Save Profile
                    </button>
                  </div>
                </form>
              </SettingsSection>

              {/* Role info card */}
              <SettingsSection icon={Shield} title="Account Role" description="Your access level and permissions." delay={80}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C6FF00]/10 flex items-center justify-center">
                      <Shield size={18} className="text-[#C6FF00]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F5F5F5]">Administrator</p>
                      <p className="text-[11px] text-[#5A5A5D]">Full access to all modules and settings</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C6FF00]/10 text-[#C6FF00] border border-[#C6FF00]/20">
                    Admin
                  </span>
                </div>
              </SettingsSection>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              NOTIFICATIONS TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'notifications' && (
            <SettingsSection
              icon={Bell}
              title="Notification Preferences"
              description="Control which alerts and updates you receive."
              delay={0}
            >
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A5D] mb-3">
                  Lead Activity
                </p>
                <NotificationRow
                  id="notif-new-lead"
                  label="New Lead Assigned"
                  description="Notify when a new lead is assigned to you."
                  enabled={notifications.newLead}
                  onChange={(v) => setNotifications({ ...notifications, newLead: v })}
                />
                <NotificationRow
                  id="notif-followup"
                  label="Follow-Up Reminders"
                  description="Alert when a follow-up task is due today."
                  enabled={notifications.followUpDue}
                  onChange={(v) => setNotifications({ ...notifications, followUpDue: v })}
                />
                <NotificationRow
                  id="notif-closed"
                  label="Deal Closed Confirmation"
                  description="Notify when a lead is marked as Closed Deal."
                  enabled={notifications.dealClosed}
                  onChange={(v) => setNotifications({ ...notifications, dealClosed: v })}
                />

                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A5D] mb-3 mt-5">
                  Communication Channels
                </p>
                <NotificationRow
                  id="notif-email"
                  label="Email Digest"
                  description="Daily summary of leads and pipeline activity."
                  enabled={notifications.emailDigest}
                  onChange={(v) => setNotifications({ ...notifications, emailDigest: v })}
                />
                <NotificationRow
                  id="notif-sms"
                  label="SMS Alerts"
                  description="Receive critical alerts via SMS."
                  enabled={notifications.smsAlerts}
                  onChange={(v) => setNotifications({ ...notifications, smsAlerts: v })}
                />
                <NotificationRow
                  id="notif-push"
                  label="Browser Push Notifications"
                  description="Desktop notifications in your browser."
                  enabled={notifications.browserPush}
                  onChange={(v) => setNotifications({ ...notifications, browserPush: v })}
                />

                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A5D] mb-3 mt-5">
                  Reports
                </p>
                <NotificationRow
                  id="notif-weekly"
                  label="Weekly Performance Report"
                  description="Automated report sent every Monday morning."
                  enabled={notifications.weeklyReport}
                  onChange={(v) => setNotifications({ ...notifications, weeklyReport: v })}
                />
                <NotificationRow
                  id="notif-system"
                  label="System & Security Alerts"
                  description="Important CRM system and login notifications."
                  enabled={notifications.systemAlerts}
                  onChange={(v) => setNotifications({ ...notifications, systemAlerts: v })}
                />
              </div>

              <div className="flex justify-end pt-5 mt-4 border-t border-[#2A2A2D]">
                <button
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm hover:bg-[#D7FF4A] active:scale-[0.98] transition-all duration-150"
                >
                  <Save size={14} />
                  Save Preferences
                </button>
              </div>
            </SettingsSection>
          )}

          {/* ════════════════════════════════════════════════════════════════
              APPEARANCE TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'appearance' && (
            <SettingsSection
              icon={Palette}
              title="Appearance & Theme"
              description="Personalize the look and feel of your CRM."
              delay={0}
            >
              {/* Theme Selector */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#A0A0A0] mb-3">Color Mode</p>
                <div className="grid grid-cols-3 gap-3">
                  <ThemeCard icon={Sun}     label="Light"  active={theme === 'light'}  onClick={() => setTheme('light')} />
                  <ThemeCard icon={Moon}    label="Dark"   active={theme === 'dark'}   onClick={() => setTheme('dark')} />
                  <ThemeCard icon={Monitor} label="System" active={theme === 'system'} onClick={() => setTheme('system')} />
                </div>
                {theme === 'light' && (
                  <p className="mt-2 text-[11px] text-[#FBBF24] flex items-center gap-1">
                    <AlertTriangle size={11} />
                    Light mode is coming soon. Dark mode is currently active.
                  </p>
                )}
              </div>

              {/* Accent Color */}
              <div className="mb-6 pb-5 border-b border-[#2A2A2D]">
                <p className="text-xs font-semibold text-[#A0A0A0] mb-3">Accent Color</p>
                <div className="flex items-center gap-4">
                  {accents.map(({ color, label }) => (
                    <ColorSwatch
                      key={color}
                      color={color}
                      label={label}
                      active={accentColor === color}
                      onClick={() => setAccentColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* UI Preferences */}
              <div className="space-y-0">
                <p className="text-xs font-semibold text-[#A0A0A0] mb-3">Interface Options</p>
                <NotificationRow
                  id="compact-mode"
                  label="Compact Mode"
                  description="Reduce spacing for a denser information layout."
                  enabled={compactMode}
                  onChange={setCompactMode}
                />
                <NotificationRow
                  id="animations"
                  label="Enable Animations"
                  description="Smooth transitions and micro-interactions across the app."
                  enabled={animationsEnabled}
                  onChange={setAnimationsEnabled}
                />
                <NotificationRow
                  id="sidebar-collapsed"
                  label="Collapsed Sidebar by Default"
                  description="Open with icon-only sidebar on every visit."
                  enabled={sidebarCollapsedDefault}
                  onChange={setSidebarCollapsedDefault}
                />
              </div>

              {/* Preview Banner */}
              <div className="mt-4 p-4 rounded-xl border border-[#C6FF00]/20 bg-[#C6FF00]/5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
                  <p className="text-xs font-semibold text-[#C6FF00]">Live Preview</p>
                </div>
                <p className="text-[11px] text-[#A0A0A0]">
                  Your current theme is <strong className="text-[#F5F5F5]">Dark</strong> with a{' '}
                  <strong style={{ color: accentColor }}>custom accent</strong>. Animations are{' '}
                  <strong className="text-[#F5F5F5]">{animationsEnabled ? 'enabled' : 'disabled'}</strong>.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveAppearance}
                  className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm hover:bg-[#D7FF4A] active:scale-[0.98] transition-all duration-150"
                >
                  <Save size={14} />
                  Apply Changes
                </button>
              </div>
            </SettingsSection>
          )}

          {/* ════════════════════════════════════════════════════════════════
              PREFERENCES TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'preferences' && (
            <SettingsSection
              icon={Sliders}
              title="CRM Preferences"
              description="Configure default views, locale, and workflow settings."
              delay={0}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Default Leads View */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pref-leads-view" className="text-xs font-medium text-[#A0A0A0]">
                    Default Leads View
                  </label>
                  <select
                    id="pref-leads-view"
                    value={prefs.defaultLeadsView}
                    onChange={(e) => setPrefs({ ...prefs, defaultLeadsView: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 appearance-none cursor-pointer"
                  >
                    <option value="table">Table View</option>
                    <option value="kanban">Kanban Board</option>
                    <option value="list">List View</option>
                  </select>
                </div>

                {/* Leads Per Page */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pref-per-page" className="text-xs font-medium text-[#A0A0A0]">
                    Leads Per Page
                  </label>
                  <select
                    id="pref-per-page"
                    value={prefs.leadsPerPage}
                    onChange={(e) => setPrefs({ ...prefs, leadsPerPage: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 appearance-none cursor-pointer"
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pref-timezone" className="text-xs font-medium text-[#A0A0A0]">
                    Timezone
                  </label>
                  <select
                    id="pref-timezone"
                    value={prefs.timezone}
                    onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 appearance-none cursor-pointer"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+8)</option>
                  </select>
                </div>

                {/* Date Format */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pref-date-format" className="text-xs font-medium text-[#A0A0A0]">
                    Date Format
                  </label>
                  <select
                    id="pref-date-format"
                    value={prefs.dateFormat}
                    onChange={(e) => setPrefs({ ...prefs, dateFormat: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 appearance-none cursor-pointer"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  </select>
                </div>

                {/* Currency */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pref-currency" className="text-xs font-medium text-[#A0A0A0]">
                    Currency
                  </label>
                  <select
                    id="pref-currency"
                    value={prefs.currency}
                    onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 appearance-none cursor-pointer"
                  >
                    <option value="INR">₹ Indian Rupee (INR)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ Euro (EUR)</option>
                    <option value="AED">د.إ UAE Dirham (AED)</option>
                    <option value="SGD">S$ Singapore Dollar (SGD)</option>
                  </select>
                </div>

                {/* Language */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pref-language" className="text-xs font-medium text-[#A0A0A0]">
                    Language
                  </label>
                  <select
                    id="pref-language"
                    value={prefs.language}
                    onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 appearance-none cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="kn">Kannada</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-5 mt-2">
                <button
                  onClick={handleSavePreferences}
                  className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm hover:bg-[#D7FF4A] active:scale-[0.98] transition-all duration-150"
                >
                  <Save size={14} />
                  Save Preferences
                </button>
              </div>
            </SettingsSection>
          )}

          {/* ════════════════════════════════════════════════════════════════
              SECURITY TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <>
              <SettingsSection
                icon={Lock}
                title="Change Password"
                description="Update your login password regularly to stay secure."
                delay={0}
              >
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="relative">
                    <label htmlFor="current-password" className="text-xs font-medium text-[#A0A0A0] block mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5D] pointer-events-none" />
                      <input
                        id="current-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password.current}
                        onChange={(e) => setPassword({ ...password, current: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full h-10 pl-9 pr-10 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] placeholder-[#4A4A4D] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="new-password" className="text-xs font-medium text-[#A0A0A0]">New Password</label>
                      <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password.new}
                        onChange={(e) => setPassword({ ...password, new: e.target.value })}
                        placeholder="Minimum 8 characters"
                        className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] placeholder-[#4A4A4D] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="confirm-password" className="text-xs font-medium text-[#A0A0A0]">Confirm Password</label>
                      <input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password.confirm}
                        onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                        placeholder="Repeat new password"
                        className="w-full h-10 px-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] text-sm text-[#F5F5F5] placeholder-[#4A4A4D] outline-none transition-all hover:border-[#3A3A3D] focus:border-[#C6FF00]/60 focus:ring-2 focus:ring-[#C6FF00]/10"
                      />
                    </div>
                  </div>

                  {/* Password strength hints */}
                  <div className="p-3 rounded-lg bg-[#1E1E21] border border-[#2A2A2D] space-y-1.5">
                    {[
                      'At least 8 characters long',
                      'Contains uppercase and lowercase letters',
                      'Includes at least one number or special character',
                    ].map((hint) => (
                      <div key={hint} className="flex items-center gap-2 text-[11px] text-[#5A5A5D]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3A3A3D]" />
                        {hint}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm hover:bg-[#D7FF4A] active:scale-[0.98] transition-all duration-150"
                    >
                      <Lock size={14} />
                      Update Password
                    </button>
                  </div>
                </form>
              </SettingsSection>

              <SettingsSection icon={Shield} title="Active Sessions" description="Devices currently logged into your account." delay={80}>
                <div className="space-y-3">
                  {[
                    { device: 'Windows 11 — Chrome 124', location: 'Bangalore, IN', time: 'Active now', current: true },
                    { device: 'iPhone 15 — Safari', location: 'Bangalore, IN', time: '2 hours ago', current: false },
                    { device: 'MacBook Pro — Firefox', location: 'Chennai, IN', time: '3 days ago', current: false },
                  ].map((s) => (
                    <div key={s.device} className="flex items-center justify-between p-3.5 rounded-lg bg-[#1E1E21] border border-[#2A2A2D]">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#F5F5F5]">{s.device}</p>
                          {s.current && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#C6FF00]/10 text-[#C6FF00] border border-[#C6FF00]/20">
                              This device
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5A5A5D] mt-0.5">{s.location} · {s.time}</p>
                      </div>
                      {!s.current && (
                        <button
                          className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
                          onClick={() => showToast('Session revoked successfully.')}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </SettingsSection>
            </>
          )}

          {/* ════════════════════════════════════════════════════════════════
              DATA & PRIVACY TAB
          ════════════════════════════════════════════════════════════════ */}
          {activeTab === 'data' && (
            <SettingsSection
              icon={Database}
              title="Data & Privacy"
              description="Manage your data exports, imports, and account actions."
              delay={0}
            >
              <div className="space-y-3">
                <DangerAction
                  icon={Download}
                  title="Export All Data"
                  description="Download all your leads, contacts, and analytics as a CSV file."
                  actionLabel="Export CSV"
                  color="yellow"
                  onClick={() => showToast('Export started. Your CSV will be ready shortly.')}
                />
                <DangerAction
                  icon={Upload}
                  title="Import Leads"
                  description="Bulk import leads from a CSV file into your CRM pipeline."
                  actionLabel="Import CSV"
                  color="yellow"
                  onClick={() => showToast('Import feature will be available in v1.1.')}
                />

                <div className="my-4 border-t border-[#2A2A2D]" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A5A5D] mb-2">Danger Zone</p>

                <DangerAction
                  icon={Trash2}
                  title="Clear All Leads"
                  description="Permanently delete all leads. This cannot be undone."
                  actionLabel="Clear Leads"
                  color="red"
                  onClick={() => showToast('This action is restricted in demo mode.')}
                />
                <DangerAction
                  icon={AlertTriangle}
                  title="Delete Account"
                  description="Permanently close your account and remove all associated data."
                  actionLabel="Delete Account"
                  color="red"
                  onClick={() => showToast('Please contact support to delete your account.')}
                />
              </div>
            </SettingsSection>
          )}

        </div>
      </div>

      {/* ─── Toast ─────────────────────────────────────────────────────────── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Settings;
