import type React from "react";
import { DotBackground } from "@/components/Background";
import { RecentProjectsSidebar } from "../../modules/projects/ui/components/recent-projects-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RecentProjectsSidebar />
        <SidebarInset className="flex-1">
          <DotBackground>
            <main className="flex items-center justify-center min-h-screen w-full px-4">
              {children}
            </main>
          </DotBackground>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
