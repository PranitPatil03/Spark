"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Fragment } from "@/lib/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { Suspense, useState } from "react";
import { MessagesContainer } from "../components/message-container";
import { PreviewAndCode } from "../components/preview-and-code";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  return (
    <div className="flex flex-col h-screen w-screen">
      <ProjectHeader projectId={projectId} />
      <div className="flex-1 overflow-auto">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={30}
            minSize={30}
            maxSize={30}
            className="flex flex-col min-h-0 p-2"
          >
            <Suspense fallback={<p>loading message....</p>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ResizablePanel>
          <ResizableHandle className="" />
          <ResizablePanel
            defaultSize={65}
            minSize={50}
            className="flex flex-col p-2"
          >
            <Suspense fallback={<p>loading preview....</p>}>
              <PreviewAndCode activeFragment={activeFragment} />
            </Suspense>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
