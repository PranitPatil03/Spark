"use client";

import { Fragment } from "@/lib/generated/prisma";

import { FragmentWeb } from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, EyeIcon } from "lucide-react";
import { FileExplorer } from "@/components/file-explorer";
import { useState } from "react";
export const PreviewAndCode = ({
  activeFragment,
}: {
  activeFragment: Fragment | null;
}) => {
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  return (
    <div className="h-full flex flex-col border rounded-xl">
      <Tabs
        className="h-full flex flex-col"
        defaultValue="preview"
        value={tabState}
        onValueChange={(value) => setTabState(value as "preview" | "code")}
      >
        <div className="w-full flex items-center p-2 border-b gap-x-2">
          <TabsList className="h-8 p-0 rounded-md bg-transparent border-muted-foreground/20">
            <TabsTrigger
              value="preview"
              className="
                rounded-md px-4 py-1.5 transition
                data-[state=active]:bg-[#232325]
                data-[state=active]:text-white
                data-[state=inactive]:text-gray-400
                font-medium
                border-none
              "
            >
              <EyeIcon className="mr-1 w-4 h-4" />
              <span>Preview</span>
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="
                rounded-md px-4 py-1.5 transition
                data-[state=active]:bg-[#232325]
                data-[state=active]:text-white
                data-[state=inactive]:text-gray-400
                font-medium
                border-none
              "
            >
              <CodeIcon className="mr-1 w-4 h-4" />
              <span>Code</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 overflow-auto rounded-b-xl">
          <TabsContent value="preview" className="h-full">
            {!!activeFragment && <FragmentWeb data={activeFragment} />}
          </TabsContent>
          <TabsContent value="code" className="h-full">
            {!!activeFragment?.files && (
              <FileExplorer
                files={activeFragment.files as { [path: string]: string }}
              ></FileExplorer>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
