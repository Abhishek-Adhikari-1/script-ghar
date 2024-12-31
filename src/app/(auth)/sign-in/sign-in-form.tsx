"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signInFormSchema } from "@/lib/zod-auth-schema";
import { TbEye, TbEyeClosed, TbLoader2 } from "react-icons/tb";
import Link from "next/link";
import { loginAccount } from "@/server/actions/auth.actions";

export const SignInForm = () => {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({
    error: "",
    success: "",
  });
  const [passwordType, setPasswordType] = useState<"text" | "password">(
    "password"
  );

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const passwordValue = form.watch("password");

  function onSubmit(values: z.infer<typeof signInFormSchema>) {
    startTransition(async () => {
      setFormState({
        error: "",
        success: "",
      });

      const response = await loginAccount(values);

      if (response.error) {
        if (response.error.fields) {
          Object.entries(response.error.fields).forEach(([field, message]) => {
            form.setError(field as keyof typeof values, {
              type: "server",
              message: message as string,
            });
          });
        } else {
          setFormState({
            error: response.error.message!,
            success: "",
          });
        }
        return;
      }

      if (response?.success) {
        return setFormState({
          success: response.success.message,
          error: "",
        });
      }
    });
  }

  return (
    <>
      <CardWrapper
        title="Login"
        description="Enter your email below to login to your account"
        footer="Don't have an account?"
        footerLink="Sign up"
        footerHref="/sign-up"
        isPending={isPending}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example209@gmail.com"
                      type="email"
                      disabled={isPending}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="forgot-password"
                      tabIndex={-1}
                      className="ml-auto inline-block text-xs hover:underline"
                    >
                      Forgot password
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={passwordType || "password"}
                        className="pr-8"
                        disabled={isPending}
                        {...field}
                      />
                      {passwordValue !== "" && (
                        <>
                          {passwordType === "password" && (
                            <TbEye
                              onClick={() => setPasswordType("text")}
                              className="absolute right-2 top-[50%] -translate-y-[55%] rounded-full cursor-pointer text-zinc-500 dark:text-zinc-400"
                              size={22}
                            />
                          )}
                          {passwordType === "text" && (
                            <TbEyeClosed
                              onClick={() => setPasswordType("password")}
                              className="absolute right-2 top-[50%] -translate-y-[55%] rounded-full cursor-pointer text-zinc-500 dark:text-zinc-400"
                              size={22}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formState.error.trim() && (
              <div className="break-all bg-red-200 dark:bg-red-900/35 text-red-800 dark:text-red-500 px-2 py-1 rounded-sm text-xs">
                {formState.error}
              </div>
            )}
            {formState.success.trim() && (
              <div className="break-all bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-500 px-2 py-1 rounded-sm text-xs">
                {formState.success}
              </div>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full select-none"
            >
              Submit
              {isPending && (
                <>
                  ing
                  <TbLoader2 className="animate-spin" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};
