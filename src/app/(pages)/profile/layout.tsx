import { Metadata } from "next";
import { getLoggedInUser } from "@/server/actions/user.actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile Setup || Abhishek",
  description: "Made by Abhishek Adhikari",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return <div>{children}</div>;
}
