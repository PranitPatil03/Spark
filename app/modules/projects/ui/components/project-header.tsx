"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/app/trpc/client";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "@/components/ui/theme-toggle";

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: project, isLoading } = useQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  return (
    <header className="px-3 py-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="spark"
            width={90}
            height={90}
            className="dark:hidden cursor-pointer"
            onClick={() => router.push("/projects")}
          />
          <Image
            src="/logo-light.svg"
            alt="spark"
            width={90}
            height={90}
            className="hidden dark:block cursor-pointer"
            onClick={() => router.push("/projects")}
          />
        </div>
        <nav className="flex items-center text-sm font-medium text-muted-foreground space-x-2">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/projects")}
          >
            Projects
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-foreground font-semibold">
            {isLoading ? "Loading..." : project?.name || "Untitled Project"}
          </span>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
          onClick={() => router.push("/pricing")}
        >
          Buy
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};
