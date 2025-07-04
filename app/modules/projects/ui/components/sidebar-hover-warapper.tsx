"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RecentProjectsSidebar } from "../components/recent-projects-sidebar";

export default function SidebarHoverWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="relative h-screen w-screen">
        <div
          className="fixed top-0 left-0 h-full w-2 z-40"
          onMouseEnter={() => setSidebarOpen(true)}
        />
        <div
          className={`fixed top-0 left-0 h-full z-50 transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onMouseLeave={() => setSidebarOpen(false)}
          style={{ width: 280 }}
        >
          <RecentProjectsSidebar />
        </div>
        <div className="h-full w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
