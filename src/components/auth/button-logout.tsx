"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/server/actions/auth.actions";

const LogoutButton = () => {
  return (
    <Button className="w-max" onClick={async () => await signOut()}>
      Log Out
    </Button>
  );
};

export default LogoutButton;
