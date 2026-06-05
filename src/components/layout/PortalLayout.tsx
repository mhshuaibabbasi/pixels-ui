import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/portal/Sidebar";
import { PortalHeader } from "@/components/portal/PortalHeader";

const PortalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen bg-[#070b14] overflow-hidden flex">
      {/* Sidebar — mobile overlay */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={false}
        />
      </div>

      {/* Sidebar — desktop inline */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PortalHeader
          onMenuToggle={() => setSidebarOpen(true)}
          onCollapseToggle={() => setSidebarCollapsed(c => !c)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-5 sm:px-6 sm:py-6 w-full max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
