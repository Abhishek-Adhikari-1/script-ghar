import LogoutButton from "@/components/auth/button-logout";
import { ModeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-3">
      Home Page
      <LogoutButton />
      <Link href="/sign-in">Sign In</Link>
      <Link href="/dashboard">Go to dashboard</Link>
      <ModeToggle />
    </div>
  );
}
