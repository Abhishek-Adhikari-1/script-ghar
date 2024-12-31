"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState, useTransition } from "react";
import { TbLoader2 } from "react-icons/tb";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { verifyOtpFormSchema } from "@/lib/zod-auth-schema";
import { useRouter } from "next/navigation";
import { verifyOTP } from "@/server/actions/auth.actions";

export function VerifyOTPForm() {
  const [cookieValue, setCookieValue] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [formState, setFormState] = useState({
    error: "",
    success: "",
  });

  const form = useForm<z.infer<typeof verifyOtpFormSchema>>({
    resolver: zodResolver(verifyOtpFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    const cookies = document.cookie
      .split("; ")
      .reduce((acc: Record<string, string>, current) => {
        const [key, value] = current.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});

    setCookieValue(cookies["email"] || null);
  }, []);

  function onSubmit(values: z.infer<typeof verifyOtpFormSchema>) {
    startTransition(async () => {
      setFormState({
        error: "",
        success: "",
      });
      try {
        const response = await verifyOTP(values);

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
          return router.push("/reset-password");
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <>
      <CardWrapper
        title="Verify Account"
        description={`Enter otp to verify and continue to ${
          cookieValue ? cookieValue : "your account"
        }`}
        footer="Already verified an account?"
        footerLink="Sign In"
        footerHref="/sign-in"
        isPending={isPending}
        showSocial={false}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>One Time Password</FormLabel>
                  <FormControl>
                    <InputOTP className="w-full" maxLength={6} {...field}>
                      <InputOTPGroup className="w-full max-w-[170px]">
                        <InputOTPSlot className="w-full h-9" index={0} />
                        <InputOTPSlot className="w-full h-9" index={1} />
                        <InputOTPSlot className="w-full h-9" index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="w-full max-w-[170px]">
                        <InputOTPSlot className="w-full h-9" index={3} />
                        <InputOTPSlot className="w-full h-9" index={4} />
                        <InputOTPSlot className="w-full h-9" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Please enter the one-time password (OTP) sent to your email.
                  </FormDescription>
                </FormItem>
              )}
            />
            {formState.error.trim() && (
              <div className="bg-red-200 dark:bg-red-900/35 text-red-800 dark:text-red-500 px-2 py-1 rounded-sm text-xs">
                {formState.error}
              </div>
            )}
            {formState.success.trim() && (
              <div className="bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-500 px-2 py-1 rounded-sm text-xs">
                {formState.success}
              </div>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="select-none w-full"
            >
              Verify
              {isPending && (
                <>
                  ing OTP
                  <TbLoader2 className="animate-spin" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
}
