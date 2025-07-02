"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "./trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const trpc = useTRPC();

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Project created");
        router.push(`/projects/${data.id}`);
      },
      onError: () => {
        toast.error("Error creating project");
      },
    })
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="max-w-sm pb-3">
        <Input
          className="w-full"
          value={value}
          onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        />
      </div>
      <Button
        onClick={() => createProject.mutate({ value: value })}
        disabled={createProject.isPending}
        className="cursor-pointer"
      >
        Invoke Background Job
      </Button>
    </div>
  );
}
