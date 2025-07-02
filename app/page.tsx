"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "./trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.message("Message Created...");
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
        onClick={() => createMessage.mutate({ value: value })}
        disabled={createMessage.isPending}
      >
        Invoke Background Job
      </Button>
      <div>{JSON.stringify(messages)}</div>
    </div>
  );
}
