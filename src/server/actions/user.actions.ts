"use server";

import { PropsUserList } from "@/app/(dashboard)/(admin)/manage-users/page";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { profileInformationSchema } from "@/lib/zod-auth-schema";
import { z } from "zod";

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

export const deleteIdentity = async (userInfo: PropsUserList) => {
  try {
    const { users } = await createAdminClient();
    const { account } = await createSessionClient();
    const currentUser = await account.get();
    const secondUser = await users.get(userInfo.$id);

    if (
      currentUser.emailVerification !== true ||
      userInfo.$id === currentUser.$id
    ) {
      return {
        success: false,
        error: {
          message: "You can't delete this user.",
          statusCode: 400,
          cause: "BAD_REQUEST",
        },
      };
    }

    const isCurrentUserMVP = currentUser.labels.includes("mvp");
    const isCurrentUserAdmin = currentUser.labels.includes("admin");
    const isTargetUserAdmin = secondUser.labels.includes("admin");
    const isTargetUserMvp = secondUser.labels.includes("mvp");

    if (!isCurrentUserMVP && !isCurrentUserAdmin) {
      return {
        success: false,
        error: {
          message: "You don't have permission to delete users.",
          statusCode: 403,
          cause: "FORBIDDEN",
        },
      };
    }

    if (isCurrentUserAdmin && (isTargetUserAdmin || isTargetUserMvp)) {
      return {
        success: false,
        error: {
          message: "Admins cannot delete other admins.",
          statusCode: 403,
          cause: "FORBIDDEN",
        },
      };
    }

    await users.delete(userInfo.$id);

    return {
      success: true,
      message: "Identity deleted successfully.",
      user: currentUser,
      userInfo: {
        name: userInfo.fullName,
        email: userInfo.email,
      },
    };
  } catch {
    return {
      success: false,
      error: {
        message: "An error occurred while getting user identity.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};

export const submitUserInfo = async (
  values: z.infer<typeof profileInformationSchema>
) => {
  try {
    const validatedFields = profileInformationSchema.safeParse(values);

    // Checking validation for fields
    if (!validatedFields.success) {
      return {
        error: {
          fields: validatedFields.error.flatten().fieldErrors,
          message: "Invalid Fields.",
        },
      };
    }

    const { firstName, lastName, phone, imageUrl } = validatedFields.data;

    const { account } = await createSessionClient();
    const { users } = await createAdminClient();
    const user = await account.updateName(`${firstName} ${lastName}`);
    await account.updatePrefs({
      firstName,
      lastName,
      avatar: imageUrl,
    });
    await users.updatePhone(user.$id, phone);

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: {
        message: "An error occurred while setting user info.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};
