import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hints";
import { Fragment } from "@/lib/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: Fragment;
}
export const FragmentWeb = ({ data }: Props) => {
  const [copied, setCopied] = useState(false);
  const [fragmentKey, setFragment] = useState(0);

  const onRefresh = () => {
    setFragment((prev) => prev + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint side="bottom" align="center" text="refresh">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          disabled={!data.sandboxUrl || copied}
          className="flex-1 justify-start text-start font-nomal"
        >
          <span className="truncate">{data.sandboxUrl}</span>
        </Button>
        <Hint side="bottom" align="center" text="open in new tab">
          <Button
            size="sm"
            disabled={!data.sandboxUrl}
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_black");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentKey}
        className="h-full w-full"
        sandbox="allow-forms allows-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
};
