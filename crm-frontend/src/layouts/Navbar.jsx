import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Home,
  Users,
  BarChart3,
  UserCircle,
} from 'lucide-react';

// ─── Route → Page Title / Breadcrumb Map ─────────────────────────────────────
const getPageMeta = (pathname) => {
  if (pathname === '/') return { title: 'Dashboard', breadcrumbs: [{ label: 'Dashboard', path: '/' }] };
  if (pathname === '/leads') return { title: 'Leads', breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Leads', path: '/leads' }] };
  if (pathname === '/leads/new' || pathname === '/leads/add') return { title: 'Add Lead', breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Leads', path: '/leads' }, { label: 'Add Lead', path: '/leads/new' }] };
  if (/^\/leads\/edit\//.test(pathname)) return { title: 'Edit Lead', breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Leads', path: '/leads' }, { label: 'Edit Lead', path: pathname }] };
  if (/^\/leads\//.test(pathname)) return { title: 'Lead Details', breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Leads', path: '/leads' }, { label: 'Lead Details', path: pathname }] };
  if (pathname === '/analytics') return { title: 'Analytics', breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Analytics', path: '/analytics' }] };
  if (pathname === '/settings') return { title: 'Settings', breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Settings', path: '/settings' }] };
  return { title: 'Not Found', breadcrumbs: [{ label: 'Dashboard', path: '/' }] };
};

// ─── Notification Badge ───────────────────────────────────────────────────────
const NotificationBell = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const MOCK_COUNT = 3;

  return (
    <div className="relative">
      <button
        aria-label={`Notifications — ${MOCK_COUNT} unread`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1E1E21] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/50"
      >
        <Bell size={18} />
        {/* Badge */}
        <span className="absolute top-1 right-1 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white leading-none select-none">
          {MOCK_COUNT}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-[#1E1E21] border border-[#2A2A2D] text-[#A0A0A0] text-xs rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-xl">
            {MOCK_COUNT} unread notifications
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Profile Dropdown ─────────────────────────────────────────────────────────
const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const menuItems = [
    { icon: UserCircle, label: 'Profile', action: () => { setOpen(false); } },
    { icon: Settings, label: 'Settings', action: () => { navigate('/settings'); setOpen(false); } },
    { icon: LogOut, label: 'Logout', action: () => { setOpen(false); }, danger: true },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        id="profile-menu-btn"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User profile menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl border border-transparent hover:border-[#2A2A2D] hover:bg-[#1E1E21] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/50 group"
      >
        {/* Initials Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C6FF00] to-[#7AC800] flex items-center justify-center flex-shrink-0">
          <span className="text-[#0B0B0D] text-xs font-bold tracking-wide">TK</span>
        </div>

        {/* Name + Role (hidden on mobile) */}
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-[#F5F5F5] text-sm font-medium">Tamil Kumaran</span>
          <span className="text-[#A0A0A0] text-[11px]">Admin</span>
        </div>

        {/* Chevron */}
        <ChevronRight
          size={14}
          className={`hidden sm:block text-[#A0A0A0] transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#2A2A2D] bg-[#151517] shadow-2xl shadow-black/60 z-50
            origin-top-right animate-dropdownFadeIn"
          role="menu"
          aria-labelledby="profile-menu-btn"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-[#2A2A2D]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C6FF00] to-[#7AC800] flex items-center justify-center flex-shrink-0">
                <span className="text-[#0B0B0D] text-xs font-bold">TK</span>
              </div>
              <div>
                <p className="text-[#F5F5F5] text-sm font-semibold leading-tight">Tamil Kumaran</p>
                <p className="text-[#A0A0A0] text-[11px]">tamil@crm.com</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1.5">
            {menuItems.map(({ icon: Icon, label, action, danger }) => (
              <button
                key={label}
                role="menuitem"
                onClick={action}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 focus:outline-none focus:bg-[#1E1E21]
                  ${danger
                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                    : 'text-[#A0A0A0] hover:bg-[#1E1E21] hover:text-[#F5F5F5]'
                  }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[#2A2A2D]">
            <p className="text-[#3A3A3D] text-[10px]">Real Estate CRM v1.0</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Search Bar ───────────────────────────────────────────────────────────────
const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div
      className={`relative flex items-center transition-all duration-200
        w-[240px] lg:w-[320px]`}
    >
      <Search
        size={15}
        className={`absolute left-3 pointer-events-none transition-colors duration-200 ${focused ? 'text-[#C6FF00]' : 'text-[#A0A0A0]'}`}
      />
      <input
        type="text"
        id="global-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search leads, customers..."
        aria-label="Search leads and customers"
        className={`w-full h-9 pl-9 pr-4 rounded-lg bg-[#1E1E21] border text-sm text-[#F5F5F5] placeholder-[#4A4A4D]
          transition-all duration-200 outline-none
          ${focused
            ? 'border-[#C6FF00]/60 ring-2 ring-[#C6FF00]/10'
            : 'border-[#2A2A2D] hover:border-[#3A3A3D]'
          }`}
      />
    </div>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────
const Navbar = ({ isSidebarCollapsed, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, breadcrumbs } = getPageMeta(location.pathname);

  return (
    <header
      role="banner"
      className="sticky top-0 z-30 flex items-center justify-between h-[72px] px-4 sm:px-6
        bg-[#0B0B0D] border-b border-[#2A2A2D] shrink-0"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* ── LEFT: Hamburger + Title + Breadcrumbs ─────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open sidebar menu"
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg
            text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1E1E21]
            transition-colors duration-200 md:hidden
            focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/50"
        >
          <Menu size={20} />
        </button>

        {/* Title + breadcrumbs */}
        <div className="flex flex-col justify-center min-w-0">
          {/* Breadcrumb — only shows if more than 1 crumb */}
          {breadcrumbs.length > 1 && (
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 mb-0.5">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.path}>
                    {idx > 0 && (
                      <ChevronRight size={11} className="text-[#3A3A3D] flex-shrink-0" />
                    )}
                    {isLast ? (
                      <span className="text-[#A0A0A0] text-[11px]">{crumb.label}</span>
                    ) : (
                      <button
                        onClick={() => navigate(crumb.path)}
                        className="text-[11px] text-[#5A5A5D] hover:text-[#A0A0A0] transition-colors duration-150"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          {/* Page Title */}
          <h1 className="text-[#F5F5F5] font-semibold text-[17px] leading-tight tracking-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* ── CENTER: Search (hidden on mobile) ─────────────────────────── */}
      <div className="hidden md:flex flex-1 justify-center px-6">
        <SearchBar />
      </div>

      {/* ── RIGHT: Actions + Profile ───────────────────────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Notifications */}
        <NotificationBell />

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-[#2A2A2D] mx-1" aria-hidden="true" />

        {/* Quick Add Lead */}
        <button
          id="quick-add-lead-btn"
          onClick={() => navigate('/leads/new')}
          aria-label="Add new lead"
          className="flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-lg
            bg-[#C6FF00] text-[#0B0B0D] font-semibold text-sm
            hover:bg-[#D7FF4A] active:scale-[0.98]
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-[#C6FF00]/60 focus:ring-offset-2 focus:ring-offset-[#0B0B0D]
            whitespace-nowrap"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Lead</span>
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-[#2A2A2D] mx-1" aria-hidden="true" />

        {/* Profile */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
