"use client";

import Link from "next/link";
import { useState } from "react";
import { useTRPC } from "@/app/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
};

const MAX_PROJECTS = 6;

export function RecentProjectsSidebar() {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: projects, isLoading } = useQuery(
    trpc.projects.getMany.queryOptions()
  );
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = projects
    ? showAll
      ? projects
      : projects.slice(0, MAX_PROJECTS)
    : [];

  return (
    <Sidebar className="border overflow-hidden shadow-md">
      <div className="flex items-start justify-start p-3 border-b">
        <Image
          src="/logo.svg"
          alt="spark"
          width={120}
          height={120}
          className="dark:hidden cursor-pointer"
          onClick={() => router.push("/projects")}
          priority 
          onError={(e) => console.log("Logo failed to load:", e)}
        />
        <Image
          src="/logo-light.svg"
          alt="spark"
          width={120}
          height={120}
          className="hidden dark:block cursor-pointer"
          onClick={() => router.push("/projects")}
          priority 
          onError={(e) => console.log("Logo-light failed to load:", e)}
        />
      </div>

      <div className="flex justify-center p-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              aria-label="Create Project"
              onClick={() => {
                {
                  router.push("/projects");
                }
              }}
              className="w-full rounded bg-sidebar-accent hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground text-white"
            >
              New Project
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recent Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && (
                <SidebarMenuItem>
                  <div className="px-4 py-2 text-muted-foreground animate-pulse">
                    Loading...
                  </div>
                </SidebarMenuItem>
              )}

              {!isLoading && visibleProjects.length === 0 && (
                <SidebarMenuItem>
                  <div className="px-4 py-2 text-muted-foreground">
                    No projects yet.
                  </div>
                </SidebarMenuItem>
              )}

              {!isLoading &&
                visibleProjects.map((project: Project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/projects/${project.id}`}>
                        <span className="truncate">{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {!isLoading && projects && projects.length > MAX_PROJECTS && (
                <SidebarMenuItem>
                  <div className="border-b opacity-55 mb-2"></div>
                  {showAll ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-2"
                      onClick={() => setShowAll(false)}
                    >
                      Show less
                      <ChevronDownIcon size={16} className="rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-2"
                      onClick={() => setShowAll(true)}
                    >
                      Show more
                      <ChevronDownIcon size={16} />
                    </Button>
                  )}
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
