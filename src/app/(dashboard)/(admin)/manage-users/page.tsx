"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import ContainerPage from "./container-page";
import { Query } from "node-appwrite";

export type PropsUserList = {
  $id: string;
  $createdAt: string;
  email: string;
  labels: string[];
  fullName: string;
  phone: string;
  registrationDate: string;
  accessDate: string;
  accountType: string[];
  avatar: string;
};

const ManageUsersPage = async () => {
  const getAllUsers = async () => {
    try {
      const { users } = await createAdminClient();
      const { account } = await createSessionClient();

      const currentUser = await account.get();
      const { total, users: userList } = await users.list([
        Query.notEqual("$id", currentUser.$id),
      ]);
      const { identities } = await users.listIdentities([
        Query.notEqual("$id", currentUser.$id),
      ]);

      const mergedUsers = userList.map((user) => {
        const userIdentities = identities
          .filter((identity) => identity.userId === user.$id)
          .map((identity) => identity.provider);
        return {
          $id: user.$id,
          $createdAt: user.$createdAt,
          email: user.email,
          labels: user.labels || [],
          fullName: user.name,
          phone: user.phone,
          registrationDate: user.registration || "",
          accessDate: user.accessedAt || "",
          avatar: user.prefs.avatar,
          accountType: userIdentities.length > 0 ? userIdentities : ["email"],
        };
      });

      return {
        success: true,
        total,
        userList: mergedUsers,
      };
    } catch {
      return {
        success: false,
        userList: [],
      };
    }
  };

  const allUsers = await getAllUsers();

  return (
    <div>
      <ContainerPage
        userList={allUsers.success === true ? allUsers.userList : []}
      />
    </div>
  );
};

export default ManageUsersPage;
