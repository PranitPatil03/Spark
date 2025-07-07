"use client";

import Image from "next/image";

import { z } from "zod";
import { OctagonAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { DotBackground } from "@/components/Background";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is require" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setError(error.message);
        },
      }
    );
  };

  const onSoical = async (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setError(error.message);
        },
      }
    );
  };

  return (
    <DotBackground>
      <div className="h-screen w-full flex items-center justify-center max-w-5xl">
        <div className="flex-1 flex items-center justify-center p-3 w-full">
          <div className="w-full max-w-md rounded-2xl">
            <div className="grid p-0">
              <Form {...form}>
                <form className="p-6" onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-light text-neutral-900 dark:text-white">
                          Let&apos;s get with
                        </h1>
                        <Image
                          src="/logo.svg"
                          alt="logo"
                          width={100}
                          height={100}
                          className="dark:hidden"
                        />
                        <Image
                          src="/logo-light.svg"
                          alt="logo"
                          width={100}
                          height={100}
                          className="hidden dark:block"
                        />
                      </div>
                      <p className="text-neutral-500 text-balance text-sm font-medium">
                        Create your account
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="john"
                                className="dark:text-white h-11 px-4 rounded-xl bg-white/80 border border-neutral-200 shadow focus:shadow-md transition-all duration-200 placeholder:text-neutral-400 text-neutral-900 outline-none dark:border-accent"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@mail.com"
                                className="dark:border-accent dark:text-white h-11 px-4 rounded-xl bg-white/80 border border-neutral-200 shadow focus:shadow-md transition-all duration-200 placeholder:text-neutral-400 text-neutral-900 outline-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="********"
                                  className="dark:border-accent h-11 px-4 rounded-xl bg-white/80 border border-neutral-200 shadow focus:shadow-md transition-all duration-200 placeholder:text-neutral-400 text-neutral-900 outline-none pr-10 dark:text-white"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                                  onClick={() => setShowPassword((v) => !v)}
                                >
                                  {showPassword ? (
                                    <EyeIcon className="w-5 h-5" />
                                  ) : (
                                    <EyeOffIcon className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="********"
                                  className="dark:border-accent dark:text-white h-11 px-4 rounded-xl bg-white/80 border border-neutral-200 shadow focus:shadow-md transition-all duration-200 placeholder:text-neutral-400 text-neutral-900 outline-none pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  tabIndex={-1}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                                  onClick={() =>
                                    setShowConfirmPassword((v) => !v)
                                  }
                                >
                                  {showConfirmPassword ? (
                                    <EyeIcon className="w-5 h-5" />
                                  ) : (
                                    <EyeOffIcon className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {!!error && (
                      <Alert className="bg-destructive/10 border-none">
                        <OctagonAlertIcon className="h-4 w-4 !text-destructive"></OctagonAlertIcon>
                        <AlertTitle>{error}</AlertTitle>
                      </Alert>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-xl text-white dark:text-black font-semibold shadow-lg transition-all duration-200 focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                      disabled={pending}
                    >
                      Register
                    </Button>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-sidebar text-muted-foreground relative z-10 px-2">
                        Or continue with
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/80 border border-neutral-200 shadow hover:bg-neutral-100 transition-all duration-200 cursor-pointer"
                        disabled={pending}
                        onClick={() => onSoical("google")}
                      >
                        <Image
                          src="/google.svg"
                          alt="Google"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/80 border border-neutral-200 shadow hover:bg-neutral-100 transition-all duration-200 cursor-pointer"
                        disabled={pending}
                      >
                        <Image
                          src="/github.svg"
                          alt="GitHub"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                          onClick={() => onSoical("github")}
                        />
                        Github
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <Link
                        href="/sign-in"
                        className="underline underline-offset-4"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </DotBackground>
  );
};
