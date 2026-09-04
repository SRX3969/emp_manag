import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { GlobalSearchModal } from './GlobalSearchModal';
import { RoleSwitcherBar } from './RoleSwitcherBar';

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#171717] dark:bg-[#101113] dark:text-[#F5F5F5] flex flex-col antialiased">
      {/* Role Switcher Simulator for testing full RBAC */}
      <RoleSwitcherBar />

      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Command Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
