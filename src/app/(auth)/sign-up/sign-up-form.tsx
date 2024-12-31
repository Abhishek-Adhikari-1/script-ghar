"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { signUpFormSchema } from "@/lib/zod-auth-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TbEye, TbEyeClosed, TbLoader2 } from "react-icons/tb";
import { createAccount } from "@/server/actions/auth.actions";

export const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({
    error: "",
    success: "",
  });
  const [passwordType, setPasswordType] = useState<"text" | "password">(
    "password"
  );

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = form.watch("password");

  function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    startTransition(async () => {
      setFormState({
        error: "",
        success: "",
      });

      const response = await createAccount(values);

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
        setFormState({
          success: response.success.message,
          error: "",
        });
      }
    });
  }

  return (
    <>
      <CardWrapper
        title="Register"
        description="Enter your information to create an account"
        footer="Already have an account?"
        footerLink="Sign In"
        footerHref="/sign-in"
        isPending={isPending}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-2 flex flex-col sm:flex-row sm:space-x-2 sm:space-y-0">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        type="text"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        type="text"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={passwordType || "password"}
                        className="pr-8"
                        disabled={isPending}
                        autoComplete="new-password"
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
