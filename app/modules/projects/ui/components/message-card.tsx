"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Code2Icon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/lib/generated/prisma";

interface UserMessageProps {
  content: string;
}

interface MessageCardProps {
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  content: string;
  type: MessageType;
  onFragmentClick: (fragment: Fragment) => void;
  isActiveFragment: boolean;
}

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  type: MessageType;
  onFragmentClick: (fragment: Fragment) => void;
  isActiveFragment: boolean;
}

interface FragmentProps {
  fragment: Fragment | null;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  onFragmentClick,
  isActiveFragment,
}: FragmentProps) => {
  return (
    <button
      className={cn(
        "flex items-center text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
        isActiveFragment &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      disabled={!fragment}
      onClick={() => fragment && onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5"></Code2Icon>
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment?.title}
        </span>
        <span className="text-sm">Preview</span>
      </div>
    </button>
  );
};

const AssistantMessage = ({
  fragment,
  type,
  isActiveFragment,
  createdAt,
  content,
  onFragmentClick,
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image src="/logo.svg" alt="logo" height={65} width={65} />
        {/* <span className="text-sm font-medium">Vibe</span> */}
        <span className="text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MM dd,yyyy")}
        </span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <span>{content}</span>
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            onFragmentClick={onFragmentClick}
            isActiveFragment={isActiveFragment}
          />
        )}
      </div>
    </div>
  );
};

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
        {content}
      </Card>
    </div>
  );
};

export const MessageCard = ({
  role,
  fragment,
  content,
  createdAt,
  type,
  onFragmentClick,
  isActiveFragment,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        fragment={fragment}
        type={type}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        createdAt={createdAt}
        content={content}
      ></AssistantMessage>
    );
  }

  return (
    <>
      <UserMessage content={content}></UserMessage>
    </>
  );
};
