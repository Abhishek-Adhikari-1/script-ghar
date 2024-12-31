import { IoLogoGithub } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { TbLoader2 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { githubLogin } from "@/server/actions/auth.actions";

type Props = {
  isSignPending: boolean;
};

const GithubAuthButton = ({ isSignPending }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGithubLogin = () => {
    startTransition(async () => {
      try {
        const data = await githubLogin();

        if (data) {
          router.push(data?.redirectUrl || "");
          router.refresh();
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Button
      onClick={handleGithubLogin}
      variant="outline"
      disabled={isSignPending || isPending || false}
      className="w-full disabled:opacity-100"
    >
      {isPending ? <TbLoader2 className="animate-spin" /> : <IoLogoGithub />}
    </Button>
  );
};

export default GithubAuthButton;
