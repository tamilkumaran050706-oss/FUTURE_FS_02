import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, Heart } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const links = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Leads',     path: '/leads', icon: Users },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings',  path: '/settings', icon: Settings },
  ];

  return (
    <footer
      role="contentinfo"
      className="flex-shrink-0 border-t border-[#2A2A2D] bg-[#0B0B0D] px-4 sm:px-6 py-3"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left — Branding */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C6FF00]" aria-hidden="true" />
          <span className="text-[#5A5A5D] text-[11px] font-medium">
            LeadEstate CRM
          </span>
          <span className="text-[#3A3A3D] text-[11px] hidden sm:inline">·</span>
          <span className="text-[#3A3A3D] text-[10px] hidden sm:inline font-mono">v1.0.0</span>
        </div>

        {/* Center — Nav Links */}
        <nav aria-label="Footer navigation" className="hidden md:flex items-center gap-4">
          {links.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="text-[11px] text-[#3A3A3D] hover:text-[#A0A0A0] transition-colors duration-150"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right — Copyright */}
        <p className="text-[#3A3A3D] text-[10px] flex items-center gap-1">
          Made with{' '}
          <Heart size={10} className="text-red-500/60 fill-red-500/60" aria-hidden="true" />
          {' '}© {new Date().getFullYear()} LeadEstate
        </p>
      </div>
    </footer>
  );
};

export default Footer;

