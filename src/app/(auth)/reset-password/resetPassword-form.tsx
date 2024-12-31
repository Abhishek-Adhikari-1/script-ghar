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
import { TbEye, TbEyeClosed, TbLoader2 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { resetPasswordFormSchema } from "@/lib/zod-auth-schema";
import { changeForgotPassword } from "@/server/actions/auth.actions";

export const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [formState, setFormState] = useState({
    error: "",
    success: "",
  });
  const [passwordType, setPasswordType] = useState<{
    newPassword: "password" | "text";
    confirmPassword: "password" | "text";
  }>({
    newPassword: "password",
    confirmPassword: "password",
  });

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = form.watch("newPassword");
  const confirmPasswordValue = form.watch("confirmPassword");

  function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    startTransition(async () => {
      setFormState({
        error: "",
        success: "",
      });
      try {
        const response = await changeForgotPassword(values);

        if (response.error) {
          if (response.error.fields) {
            Object.entries(response.error.fields).forEach(
              ([field, message]) => {
                form.setError(field as keyof typeof values, {
                  type: "server",
                  message: message as string,
                });
              }
            );
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
          return router.push("/sign-in");
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <>
      <CardWrapper
        title="Reset Your Password"
        description="Enter a new strong password for your account."
        footer="Remembered your password?"
        footerLink="Sign in"
        footerHref="/sign-in"
        isPending={isPending}
        showSocial={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={passwordType.newPassword || "password"}
                        className="pr-8"
                        disabled={isPending}
                        {...field}
                      />
                      {newPasswordValue !== "" && (
                        <>
                          {passwordType.newPassword === "password" && (
                            <TbEye
                              onClick={() =>
                                setPasswordType({
                                  ...passwordType,
                                  newPassword: "text",
                                })
                              }
                              className="absolute right-2 top-[50%] -translate-y-[55%] rounded-full cursor-pointer text-zinc-500 dark:text-zinc-400"
                              size={22}
                            />
                          )}
                          {passwordType.newPassword === "text" && (
                            <TbEyeClosed
                              onClick={() =>
                                setPasswordType({
                                  ...passwordType,
                                  newPassword: "password",
                                })
                              }
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="********"
                        type={passwordType.confirmPassword || "password"}
                        className="pr-8"
                        disabled={isPending}
                        {...field}
                      />
                      {confirmPasswordValue !== "" && (
                        <>
                          {passwordType.confirmPassword === "password" && (
                            <TbEye
                              onClick={() =>
                                setPasswordType({
                                  ...passwordType,
                                  confirmPassword: "text",
                                })
                              }
                              className="absolute right-2 top-[50%] -translate-y-[55%] rounded-full cursor-pointer text-zinc-500 dark:text-zinc-400"
                              size={22}
                            />
                          )}
                          {passwordType.confirmPassword === "text" && (
                            <TbEyeClosed
                              onClick={() =>
                                setPasswordType({
                                  ...passwordType,
                                  confirmPassword: "password",
                                })
                              }
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
