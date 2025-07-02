"use client";

import { useTRPC } from "@/app/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";

interface Props {
  projectId: string;
}

export const MessagesContainer = ({ projectId }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const trpc = useTRPC();
  const {
    data: messages,
    error: messagesError,
    isLoading: messagesLoading,
  } = useQuery(trpc.messages.getMany.queryOptions({ projectId }));

  useEffect(() => {
    const lastAssistantMessage = messages?.findLast(
      (message) => message.role === "ASSISTANT"
    );

    if (lastAssistantMessage) {
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages?.length]);

  if (messagesLoading || typeof messages === "undefined")
    return <div>Loading...</div>;
  if (messagesError)
    return <div>Error loading messages: {messagesError.message}</div>;
  if (Array.isArray(messages) && messages.length === 0) {
    return (
      <>
        <div className="flex flex-col min-h-0 flex-1">
          <div className="flex min-h-0 overflow-y-auto">
            <div className="pt-2 pr-1 text-gray-500">No messages yet.</div>
          </div>
        </div>
        <div className="relative p-3 pt-1">
          <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
          <MessageForm projectId={projectId}></MessageForm>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-0 flex-1">
        <div className="flex min-h-0 overflow-y-auto">
          <div className="pt-2 pr-1">
            {messages?.map((message) => (
              <MessageCard
                key={message.id}
                role={message.role}
                fragment={message.fragment}
                createdAt={message.createdAt}
                content={message.content}
                type={message.type}
                onFragmentClick={() => {}}
                isActiveFragment={false}
              ></MessageCard>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <MessageForm projectId={projectId}></MessageForm>
      </div>
    </>
  );
};
