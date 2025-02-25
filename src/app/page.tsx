import LogoutButton from "@/components/auth/button-logout";
// import { getLoggedInUser } from "@/server/actions/user.actions";
import Link from "next/link";
// import { redirect } from "next/navigation";

const Home = async () => {
  // const getUser = await getLoggedInUser();
  // const currentUser = getUser?.success ? getUser?.user : null;

  // if (currentUser) return redirect("/dashboard");

  return (
    <div className="flex flex-col gap-3">
      Home Page
      <LogoutButton />
      <Link href="/sign-in" className="hover:underline max-w-fit">Sign In</Link>
      <Link href="/dashboard" className="hover:underline max-w-fit">Go to dashboard</Link>
    </div>
  );
};
export default Home;
