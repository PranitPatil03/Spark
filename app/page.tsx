"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "./trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {

  const [value,setValue]=useState("")

  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.message("Background Job Started...");
      },
    })
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="max-w-sm pb-3">
        <Input
          className="w-full"
          value={value}
          onChange={e => setValue((e.target as HTMLInputElement).value)}
        />
      </div>
      <Button
        onClick={() => invoke.mutate({ value:value })}
        disabled={invoke.isPending}
      >
        Invoke Background Job
      </Button>
    </div>
  );
}
