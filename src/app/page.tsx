import LogoutButton from "@/components/auth/button-logout";
import Link from "next/link";

const Home = async () => {
  return (
    <div className="flex flex-col gap-3">
      Home Page
      <LogoutButton />
      <Link href="/sign-in">Sign In</Link>
      <Link href="/dashboard">Go to dashboard</Link>
    </div>
  );
};
export default Home;
