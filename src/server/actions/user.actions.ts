"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    return {
      success: true,
      user,
    };
  } catch (error) {
    if (error)
      return {
        success: false,
        error: {
          message: "An error occurred while getting user info.",
          statusCode: 500,
          cause: "INTERNAL_SERVER_ERROR",
        },
      };
  }
};

export const listIdentitiesAppwrite = async () => {
  try {
    const { users } = await createAdminClient();
    const identities = await users.listIdentities([]);
    // const identities = await users.deleteIdentity("6773c3400cc3f522d21b");

    return {
      success: true,
      identities,
    };
  } catch (error: any) {
    if (error)
      return {
        success: false,
        error: {
          message:
            error?.message ||
            "An error occurred while getting user identities.",
          statusCode: 500,
          cause: "INTERNAL_SERVER_ERROR",
        },
      };
  }
};
