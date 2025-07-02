"use client";

// import { useTRPC } from "@/app/trpc/client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
// import { useQuery } from "@tanstack/react-query";
import { MessagesContainer } from "../components/message-container";
import { Suspense } from "react";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  // const trpc = useTRPC();
  // const {
  //   data: project,
  //   error: projectError,
  //   isLoading: projectLoading,
  // } = useQuery(trpc.projects.getOne.queryOptions({ id: projectId }));

  // if (projectLoading) return <div>Loading...</div>;
  // if (projectError)
  //   return <div>Project not found or error: {projectError.message}</div>;

  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>Loading messages...</p>}>
            <MessagesContainer projectId={projectId}></MessagesContainer>
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <div>
            <h1>Messages</h1>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
