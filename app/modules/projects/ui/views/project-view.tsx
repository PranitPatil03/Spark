"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense, useState } from "react";
import { Fragment } from "@/lib/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { MessagesContainer } from "../components/message-container";
import { FragmentWeb } from "../components/fragment-web";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setIsActiveFragment] = useState<Fragment | null>(null);

  return (
    <div className="h-screen w-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={30}
          minSize={30}
          maxSize={30}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<p>loading project....</p>}>
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense fallback={<p>loading message....</p>}>
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setIsActiveFragment}
            ></MessagesContainer>
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          {!!activeFragment && <FragmentWeb data={activeFragment} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
