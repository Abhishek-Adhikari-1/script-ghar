import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { TbLoader2 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { googleLogin } from "@/server/actions/auth.actions";

type Props = {
  isSignPending: boolean;
};

const GoogleAuthButton = ({ isSignPending }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      try {
        const data = await googleLogin();

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
      onClick={handleGoogleLogin}
      variant="outline"
      disabled={isSignPending || isPending || false}
      className="w-full disabled:opacity-100"
    >
      {isPending ? <TbLoader2 className="animate-spin" /> : <FcGoogle />}
    </Button>
  );
};

export default GoogleAuthButton;
