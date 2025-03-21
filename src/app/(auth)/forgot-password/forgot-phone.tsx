"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { TbLoader2 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { ForgotPasswordFormProps } from "./forgot-password-form";
import { forgotPasswordPhoneFormSchema } from "@/lib/zod-auth-schema";
import { forgotPasswordPhone } from "@/server/actions/auth.actions";
import { PhoneInput } from "@/components/client-information/phone-input";

export const ForgotPasswordPhoneForm = ({
  setToggleFormState,
}: ForgotPasswordFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [formState, setFormState] = useState({
    error: "",
    success: "",
  });

  const form = useForm<z.infer<typeof forgotPasswordPhoneFormSchema>>({
    resolver: zodResolver(forgotPasswordPhoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof forgotPasswordPhoneFormSchema>) {
    startTransition(async () => {
      try {
        const response = await forgotPasswordPhone(values);

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
            ...formState,
            success: response.success.message,
            error: "",
          });
          return router.push("/verify-otp");
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center">
                  <FormLabel>Phone Number</FormLabel>
                  <Button
                    variant={"link"}
                    type="button"
                    className="ml-auto inline-block text-xs p-0 h-full font-bold"
                    onClick={() => {
                      setToggleFormState({
                        usePhone: false,
                        useEmail: true,
                      });
                    }}
                  >
                    Use Email Address
                  </Button>
                </div>
                <FormControl>
                  <PhoneInput
                    id="phone"
                    type="phone"
                    autoComplete={"tel"}
                    defaultCountry="NP"
                    placeholder={"98 XXXX XXXX"}
                    {...field}
                  />
                  {/* <Input
                      placeholder={"98 XXXX XXXX"}
                      type="number"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={isPending}
                      readOnly={!editMode}
                      autoComplete={"tel"}
                      {...field}
                    /> */}
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
            {isPending ? (
              <>
                Sending OTP
                <TbLoader2 className="animate-spin" />
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
