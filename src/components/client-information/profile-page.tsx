"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { profileInformationSchema } from "@/lib/zod-auth-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { ImageInput } from "@/components/client-information/image-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TbLoader2 } from "react-icons/tb";
import { PhoneInput } from "./phone-input";
import { useAuth } from "@/hooks/AuthContext";
import { cn } from "@/lib/utils";
import { submitUserInfo } from "@/server/actions/user.actions";

type PropsProfilePage = {
  newUser?: boolean;
};

export interface PropsImageInput {
  url: string;
  thumbnailUrl: string;
  status: boolean;
  message?: string;
}

export const ProfilePage = ({ newUser }: PropsProfilePage) => {
  const { currentUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState<PropsImageInput | undefined>({
    url: currentUser?.prefs?.avatar,
    thumbnailUrl: "",
    status: false,
    message: "",
  });

  const form = useForm<z.infer<typeof profileInformationSchema>>({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: {
      firstName: currentUser?.prefs?.firstName || "",
      lastName: currentUser?.prefs?.lastName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      imageUrl: currentUser?.prefs?.avatar || "",
    },
  });

  function onSubmit(values: z.infer<typeof profileInformationSchema>) {
    startTransition(async () => {
      try {
        console.log(values);
        const res = await submitUserInfo(values);

        setImage((prev) => ({ ...prev, status: true } as PropsImageInput));
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    });
  }

  useEffect(() => {
    form.setValue("imageUrl", image?.url || "");
  }, [image]);

  return (
    <div className="bg-card rounded-lg w-full px-6 py-4">
      <div className="flex justify-between">
        {newUser ? (
          <h1 className="mb-5">
            Please fill all the required information to access your account
          </h1>
        ) : (
          <h1>My Profile</h1>
        )}
        {!newUser && (
          <Button
            className="select-none"
            variant={"link"}
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Cancel" : "Edit"}
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 space-x-2">
            <ImageInput
              editMode={editMode}
              newUser={newUser}
              isSubmitting={image?.status || false}
              image={image}
              setImage={setImage}
            />

            <div className="flex gap-3 *:w-full flex-col sm:flex-row">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>First Name {newUser && "*"}</FormLabel>
                    <FormControl>
                      <Input
                        id="first-name"
                        type="text"
                        placeholder={"John"}
                        readOnly={!newUser && !editMode}
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
                    <FormLabel>Last Name {newUser && "*"}</FormLabel>
                    <FormControl>
                      <Input
                        id="last-name"
                        type="text"
                        placeholder={"Doe"}
                        readOnly={!newUser && !editMode}
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
                  <FormLabel>Email {newUser && "*"}</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      title={
                        newUser || editMode
                          ? "Primary Email cannot be changed"
                          : ""
                      }
                      type="email"
                      placeholder={"johndoe@me.com"}
                      className={cn(
                        "read-only:text-neutral-700 dark:read-only:text-neutral-300",
                        editMode
                          ? "cursor-not-allowed"
                          : "read-only:text-zinc-500 dark:read-only:text-zinc-400"
                      )}
                      readOnly={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Phone Number {newUser && "*"}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      id="phone"
                      type="phone"
                      autoComplete={"tel"}
                      defaultCountry="NP"
                      readOnly={!newUser && !editMode}
                      placeholder={"98 XXXX XXXX"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex items-end justify-end">
            <Button
              type="submit"
              disabled={newUser ? false : editMode ? isPending : true}
              className="w-max select-none"
            >
              Submit
              {isPending && (
                <>
                  ing
                  <TbLoader2 className="animate-spin" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
