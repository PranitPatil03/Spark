"use client";

import { useTRPC } from "./trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: "world" }));
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
}
