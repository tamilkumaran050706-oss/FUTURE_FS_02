import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0B0D] text-[#F5F5F5] font-sans">
      {/* Sidebar (Desktop and Mobile drawer) */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />
      
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar 
          isSidebarCollapsed={isSidebarCollapsed}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />
        
        <main
          className="flex-1 overflow-y-auto bg-[#0B0B0D] p-4 sm:p-6 focus:outline-none"
          tabIndex={-1}
        >
          <div
            key={location.pathname}
            className="max-w-7xl mx-auto page-enter"
          >
            <Outlet />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;

