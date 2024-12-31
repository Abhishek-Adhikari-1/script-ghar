"use client";
import { listIdentitiesAppwrite } from "@/server/actions/user.actions";
import { Button } from "../ui/button";

const ListIdentitiesAp = () => {
  return (
    <Button
      onClick={async () => {
        const response = await listIdentitiesAppwrite();
        console.log(response);
      }}
    >
      List Identities
    </Button>
  );
};

export default ListIdentitiesAp;
