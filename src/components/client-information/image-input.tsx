"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEdgeStore } from "@/lib/edgestore";
import { useEffect, useRef, useState } from "react";
import { PropsImageInput } from "./profile-page";

export const ImageInput = ({
  newUser = false,
  editMode = false,
  isSubmitting = false,
  image,
  setImage,
}: {
  newUser?: boolean;
  editMode?: boolean;
  isSubmitting: boolean;
  image: PropsImageInput | undefined;
  setImage: React.Dispatch<React.SetStateAction<PropsImageInput | undefined>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number>(100);
  // const [image, setImage] = useState<{
  //   url: string | null;
  //   thumbnailUrl: string | null;
  // }>();

  const { edgestore } = useEdgeStore();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setProgress((prevProgress) => prevProgress - 100);
  //   }, 1000);

  //   if (progress === 0) {
  //     clearInterval(interval);
  //   }

  //   return () => clearInterval(interval);
  // }, [progress]);

  useEffect(() => {
    const storedImage = localStorage.getItem("image");
    if (image?.url) {
      localStorage.removeItem("image");
    } else {
      if (storedImage) {
        try {
          const img = JSON.parse(storedImage);
          if (img)
            setImage({ message: "This image is not uploaded yet", ...img });
        } catch (error) {
          localStorage.removeItem("image");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isSubmitting || !image?.url) return;

    edgestore.myProfileImages
      .confirmUpload({ url: image.url })
      .then(() => {
        localStorage.removeItem("image");
      })
      .catch((error) => console.error("Error confirming upload:", error));
  }, [isSubmitting]);

  return (
    <div>
      <div>
        <div className="flex flex-row w-max gap-3">
          <div className="relative size-14">
            <svg
              className="size-full -rotate-90"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-gray-200/80 dark:text-neutral-800/80"
                strokeWidth="2"
              ></circle>
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-slate-500 dark:text-slate-500 progress-circle"
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.4s ease",
                }}
              ></circle>
            </svg>
            <Avatar
              className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 "
              onClick={() => setProgress(0)}
            >
              <AvatarImage
                src={image?.url || ""}
                alt=""
                className="h-full w-full rounded-full object-cover select-none"
              />
              <AvatarFallback className="select-none">
                <div className="text-[11px]">{progress}%</div>
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <Button
              title={"Add Profile Picture"}
              type="button"
              variant={"outline"}
              tabIndex={newUser === true ? 0 : editMode === true ? 0 : -1}
              onClick={() => fileInputRef?.current?.click()}
              className="select-none aria-readonly:text-zinc-500 aria-readonly:hover:text-zinc-500 dark:aria-readonly:text-zinc-400 bg-secondary"
            >
              Change Avatar
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, JPEG, PNG or GIF.
            </p>
          </div>
        </div>
        {image?.message && (
          <p className="text-xs text-muted-foreground ml-4">
            **{image.message}**
          </p>
        )}
      </div>

      <Input
        type="file"
        id="avatar-input"
        name="profilePic"
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
        hidden={true}
        disabled={newUser ? false : !editMode}
        {...((newUser || editMode) === true && {
          onChange: async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
              const reader = new FileReader();

              reader.readAsDataURL(file);
              const res = await edgestore.myProfileImages.upload({
                file,
                input: { type: "user/profile" },
                options: {
                  temporary: true,
                  replaceTargetUrl: image?.url,
                },
                onProgressChange(progress) {
                  setProgress(progress);
                },
              });

              setImage(() => {
                const newImage = {
                  url: res.url,
                  thumbnailUrl: res?.thumbnailUrl || "",
                  status: false,
                };
                localStorage.setItem("image", JSON.stringify(newImage));
                return newImage;
              });
            }
          },
        })}
      />
    </div>
  );
};
