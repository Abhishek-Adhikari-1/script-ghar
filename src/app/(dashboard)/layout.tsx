import { Metadata } from "next";
import { getLoggedInUser } from "@/server/actions/user.actions";
import { AppSidebar } from "@/components/dashboard/sidebar/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
// import SideTriggerMbl from "@/components/dashboard/sidebar/sidebar-trigger-mobile";
import { redirect } from "next/navigation";
import Navbar from "@/components/dashboard/navbar/navbar";

export const metadata: Metadata = {
  title: "Dashboard || Abhishek",
  description: "Made by abhishek adhikari",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getUser = await getLoggedInUser();
  const currentUser = getUser?.success ? getUser?.user : null;

  if (!currentUser) {
    return redirect("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        variant="floating"
        user={{
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          roles: currentUser?.labels || [],
        }}
      />
      <main className="relative w-full">
        <div className=" md:pt-2 sticky top-0 z-50 md:pr-2 backdrop-blur-md">
          <Navbar className="md:rounded-lg shadow md:border" />
        </div>
        <div className="px-2 w-full md:px-0 py-2 md:pt-4 md:pr-2">{children}</div>
      </main>
    </SidebarProvider>
  );
}
