import { getLoggedInUser } from "@/server/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin || Dashboard || Abhishek",
  description: "Made by abhishek adhikari",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getUser = await getLoggedInUser();
  const currentUser = getUser?.success ? getUser?.user : null;

  if (
    !currentUser?.labels.includes("mvp") &&
    !currentUser?.labels.includes("admin")
  )
    return redirect("/dashboard");

  return <>{children}</>;
}
