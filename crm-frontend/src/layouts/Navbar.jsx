import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ isSidebarCollapsed, setIsMobileOpen }) => {
  return (
    <nav className="bg-[#151517] border-b border-[#2A2A2D] p-4 flex justify-between items-center h-16 shrink-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger menu toggle */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 rounded text-[#A0A0A0] hover:text-[#F5F5F5] md:hidden focus:outline-none focus:ring-1 focus:ring-[#C6FF00] transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu size={20} />
        </button>
        
        <h1 className="text-[#F5F5F5] font-semibold text-base">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-[#A0A0A0]">
        <span>User Profile</span>
      </div>
    </nav>
  );
};

export default Navbar;
