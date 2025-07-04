import { ProjectForm } from "@/app/modules/home/ui/components/project-form";
import Image from "next/image";

const PromptInput = () => {
  return (
    <>
      <div className="flex flex-col max-w-5xl w-full ml-auto">
        <section className="space-y-6 py-[16vh] 2xl:py-48">
          <div className="flex flex-col items-center">
            <Image
              src="/logo.svg"
              alt="spark"
              width={120}
              height={120}
              className="dark:hidden"
            />
            <Image
              src="/logo-light.svg"
              alt="spark"
              width={120}
              height={120}
              className="hidden dark:block"
            />
          </div>
          <h1 className="text-2xl md:text-5xl text-center font-medium text-shadow-neutral-900">
            Turn prompts into code with Spark
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-center font-light">
            Create app & website by chatting with Spark
          </p>
          <div className="max-w-3xl mx-auto w-full">
            <ProjectForm />
          </div>
        </section>
      </div>
    </>
  );
};

export default PromptInput;
