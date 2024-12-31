import { ModeToggle } from "@/components/theme/theme-toggle";
import { getLoggedInUser } from "@/server/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Auth || Abhishek",
  description: "Made by abhishek adhikari",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getUser = await getLoggedInUser();
  const currentUser = getUser?.success ? getUser?.user : null;

  if (currentUser) {
    return redirect("/");
  }

  return (
    <main className="w-full h-full">
      <div className="absolute right-3 top-3">
        <ModeToggle />
      </div>
      <div className="h-full flex justify-center items-center mx-1">
        {children}
      </div>
    </main>
  );
}
