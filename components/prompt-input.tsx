"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/app/modules/home/ui/components/project-form";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const PromptInput = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <>
      <header className="w-full flex flex-col md:flex-row items-center md:items-end justify-between md:px-6 py-2 md:py-7 mx-auto">
        <div className="flex flex-row items-center justify-between w-full md:w-auto mb-4 md:mb-0 gap-2">
          <Image
            src="/logo.svg"
            alt="spark"
            width={120}
            height={120}
            className="dark:hidden cursor-pointer object-contain"
          />
          <Image
            src="/logo-light.svg"
            alt="spark"
            width={120}
            height={120}
            className="hidden dark:block cursor-pointer object-contain"
          />
          {!user && (
            <Link href="/sign-up" className="md:hidden ml-2">
              <Button
                variant="default"
                className="px-5 py-2 rounded-xl font-semibold text-base shadow-lg"
              >
                Get Started
              </Button>
            </Link>
          )}
        </div>
        <div className="hidden md:flex items-center gap-3 justify-end w-full md:w-auto">
          {!user ? (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="px-5 py-2 rounded-xl font-semibold text-base border"
                >
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="default"
                  className="px-5 py-2 rounded-xl font-semibold text-base shadow-lg ml-2"
                >
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 rounded-full border-none focus:ring-0 focus:outline-none"
                >
                  <Avatar>
                    {user.image ? (
                      <AvatarImage
                        src={user.image}
                        alt={user.name || "Profile"}
                      />
                    ) : (
                      <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="font-semibold text-base">
                    {user.name || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/billing")}>
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/settings/theme")}
                >
                  Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
      <div className="flex flex-col max-w-6xl w-full ml-auto">
        <section className="space-y-6 py-[24vh] md:py-[16vh]">
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