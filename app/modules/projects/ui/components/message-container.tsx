"use client";

import { useTRPC } from "@/app/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useEffect, useRef } from "react";
import { Fragment } from "@/lib/generated/prisma";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (Fragment: Fragment | null) => void;
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const trpc = useTRPC();
  const { data: messages } = useQuery(
    trpc.messages.getMany.queryOptions({ projectId }, { refetchInterval: 5000 })
  );

  useEffect(() => {
    const lastAssistantMessageWithFragment = messages?.findLast(
      (message) => message.role === "ASSISTANT" && !!message.fragment
    );

    if (lastAssistantMessageWithFragment) {
      setActiveFragment(lastAssistantMessageWithFragment.fragment);
    }
  }, [messages, setActiveFragment]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages?.length]);

  const lastMessage = messages?.[messages?.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  // if (Array.isArray(messages) && messages.length === 0) {
  //   return (
  //     <>
  //       <div className="flex flex-col min-h-0 flex-1">
  //         <div className="flex min-h-0 overflow-y-auto flex-1">
  //           <div className="pt-2 pr-1 text-gray-500">No messages yet.</div>
  //         </div>
  //       </div>
  //       <div className="relative p-3 pt-1">
  //         <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
  //         <MessageForm projectId={projectId}></MessageForm>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      <div className="flex flex-col min-h-0 flex-1">
        <div className="flex min-h-0 overflow-y-auto">
          <div className="pt-2 pr-1 w-full">
            {messages?.map((message) => (
              <MessageCard
                key={message.id}
                role={message.role}
                fragment={message.fragment}
                createdAt={message.createdAt}
                content={message.content}
                type={message.type}
                onFragmentClick={() => setActiveFragment(message.fragment)}
                isActiveFragment={activeFragment?.id === message.fragment?.id}
              ></MessageCard>
            ))}
            {isLastMessageUser && <MessageLoading />}
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
