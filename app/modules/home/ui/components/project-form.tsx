"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/app/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "@/lib/constants";

export const ProjectForm = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const formSchema = z.object({
    value: z
      .string()
      .min(1, { message: "Value is required" })
      .max(1000, { message: "Value is too long" }),
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createProject.mutateAsync({
      value: values.value,
    });
  };

  const [isFoused, setIsFoused] = useState(false);
  const isPending = createProject.isPending;
  const isDisabled = isPending || !form.formState.isValid;

  return (
    <>
      <Form {...form}>
        <section className="space-y-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar shadow-md transition-all",
              isFoused && "shadow-md"
            )}
          >
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                  disabled={isPending}
                  onFocus={() => setIsFoused(true)}
                  onBlur={() => setIsFoused(false)}
                  minRows={2}
                  maxRows={6}
                  className="pt-3 resize-none border-none w-full outline-none bg-transparent text-gray-700 dark:text-white text-sm font-medium"
                  placeholder="What would you like to build"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)(e);
                    }
                  }}
                />
              )}
            />

            <div className="flex gap-x-2 items-end justify-between pt-2">
              <div className="text-[10px] text-muted-foreground">
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium">
                  <span>&#8984;</span>Enter
                </kbd>
                &nbsp; to submit
              </div>
              <Button
                className={cn(
                  "size-8 rounded-full",
                  isDisabled && "bg-muted-foreground border"
                )}
                disabled={isDisabled}
              >
                {isPending ? (
                  <Loader2Icon className="animate-spin size-4" />
                ) : (
                  <ArrowUpIcon />
                )}
              </Button>
            </div>
          </form>
          <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
            {PROJECT_TEMPLATES.map((template) => (
              <Button
                key={template.title}
                variant="outline"
                size="sm"
                className="bg-white dark:bg-sidebar text-gray-700 dark:text-white font-medium"
                onClick={() => onSelect(template.prompt)}
              >
                {template.emoji} {template.title}
              </Button>
            ))}
          </div>
        </section>
      </Form>
    </>
  );
};
