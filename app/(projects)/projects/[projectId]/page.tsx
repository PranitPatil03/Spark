import { Suspense } from "react";
import { getQueryClient, trpc } from "@/app/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProjectView } from "@/app/modules/projects/ui/views/project-view";
import SidebarHoverWrapper from "@/app/modules/projects/ui/components/sidebar-hover-warapper";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({
      projectId,
    })
  );
  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <SidebarHoverWrapper>
          <ProjectView projectId={projectId} />
        </SidebarHoverWrapper>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
