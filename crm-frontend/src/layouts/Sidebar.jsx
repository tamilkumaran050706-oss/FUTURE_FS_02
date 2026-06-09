import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  X 
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Add Lead', path: '/leads/new', icon: UserPlus },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile Drawer (Aside overlay-based drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0B0B0D] border-r border-[#2A2A2D] h-screen transition-transform duration-300 md:hidden w-64 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Branding & Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2D] h-16 bg-[#151517]">
          <div className="flex flex-col">
            <span className="text-[#F5F5F5] font-bold text-base leading-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF00]" />
              LeadEstate CRM
            </span>
            <span className="text-[#A0A0A0] text-[9px] font-medium tracking-wide">
              Real Estate Lead Management
            </span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded text-[#A0A0A0] hover:text-[#F5F5F5] focus:outline-none focus:ring-1 focus:ring-[#C6FF00] transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-[#151517] text-[#C6FF00] border-l-2 border-[#C6FF00]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#151517]/50'
                  }`
                }
              >
                <Icon size={18} className="transition-colors duration-200 group-hover:text-[#D7FF4A]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Sidebar (Fixed and Collapsible) */}
      <aside
        className={`hidden md:flex flex-col bg-[#0B0B0D] border-r border-[#2A2A2D] h-screen transition-all duration-300 ease-in-out shrink-0 relative ${sidebarWidth}`}
        aria-label="Sidebar Navigation"
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-full bg-[#151517] border border-[#2A2A2D] text-[#A0A0A0] hover:text-[#C6FF00] flex items-center justify-center shadow transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#C6FF00]"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Branding Section */}
        <div className={`flex flex-col justify-center p-4 border-b border-[#2A2A2D] h-16 bg-[#151517] overflow-hidden transition-all duration-300 ${isCollapsed ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#C6FF00] flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-[#F5F5F5] font-bold text-base tracking-tight whitespace-nowrap">
                LeadEstate CRM
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[#A0A0A0] text-[9px] font-medium tracking-wide uppercase mt-0.5 ml-5.5 whitespace-nowrap">
              Real Estate Lead Management
            </span>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-lg text-sm font-medium transition-all group relative outline-none focus-visible:ring-1 focus-visible:ring-[#C6FF00] ${
                    isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
                  } ${
                    isActive
                      ? 'bg-[#151517] text-[#C6FF00] border-l-2 border-[#C6FF00]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#151517]/50'
                  }`
                }
              >
                <Icon size={18} className="transition-colors duration-200 group-hover:text-[#D7FF4A] flex-shrink-0" />
                
                {/* Text Label */}
                {!isCollapsed && (
                  <span className="whitespace-nowrap transition-opacity duration-200">
                    {item.name}
                  </span>
                )}

                {/* Tooltip on hover (only when collapsed) */}
                {isCollapsed && (
                  <div
                    className="absolute left-full ml-3 px-2 py-1 rounded bg-[#151517] text-[#F5F5F5] border border-[#2A2A2D] text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 shadow-md z-30"
                    role="tooltip"
                  >
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
