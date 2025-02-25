import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import GoogleAuthButton from "./button-google-auth";
import GithubAuthButton from "./button-github-auth";

interface CardContentProps {
  children: React.ReactNode;
  title: string;
  description: string;
  showSocial?: boolean;
  footer: string;
  footerHref?: string;
  footerLink?: string;
  isPending: boolean;
}

export const CardWrapper = ({
  children,
  title = "Title",
  description,
  showSocial = true,
  footer,
  footerHref,
  footerLink,
  isPending,
}: CardContentProps) => {
  return (
    <Card className="mx-auto max-w-sm w-full shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {children}
          {showSocial && (
            <div className="w-full flex gap-2">
              <GoogleAuthButton isSignPending={isPending} />
              <GithubAuthButton isSignPending={isPending} />
            </div>
          )}
        </div>
        {footer && (
          <div className="mt-4 text-center text-sm">
            {footer}{" "}
            <Link href={footerHref || "#"} className="underline">
              {footerLink}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
