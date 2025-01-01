"use server";

import { z } from "zod";
import {
  forgotPasswordEmailFormSchema,
  forgotPasswordPhoneFormSchema,
  resetPasswordFormSchema,
  signInFormSchema,
  signUpFormSchema,
  verifyOtpFormSchema,
} from "@/lib/zod-auth-schema";
import { AppwriteException, ID, OAuthProvider, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies, headers } from "next/headers";
import * as jwt from "jsonwebtoken";
import {
  decodeSecretCode,
  generateSecretCode,
  getTimeAfterFiveMinutes,
} from "../utils.actions";
import { appwriteConfig } from "@/lib/appwrite/config";

export const loginAccount = async (
  values: z.infer<typeof signInFormSchema>
) => {
  try {
    const validatedFields = signInFormSchema.safeParse(values);

    // Checking validation for fields
    if (!validatedFields.success) {
      return {
        error: {
          fields: validatedFields.error.flatten().fieldErrors,
          message: "Invalid Fields.",
        },
      };
    }

    const { email, password } = validatedFields.data;

    const { account, users } = await createAdminClient();

    // Logging user information or checking user information
    const session = await account.createEmailPasswordSession(email, password);

    const userList = await users.list([Query.equal("email", email)]);
    // Checking if already exists user is verified or not
    if (userList.total > 0 && !userList.users[0].emailVerification) {
      await users.deleteSession(userList.users[0].$id, session.$id);
      account.createMagicURLToken(
        userList.users[0].$id,
        email,
        process.env.APP_VERIFY_URL!,
        true
      );
      return {
        error: {
          message:
            "Please verify your email before logging in. Verification email has been sent to your email.",
          statusCode: 403,
          cause: "UNVERIFIED_EMAIL",
        },
      };
    }

    // If user is verified then assigning new session to client cookies
    if (session && session.current) {
      const cookieStore = cookies();

      cookieStore.set("session", session.secret, {
        secure: process.env?.NODE_ENV === "production",
        expires: new Date(session.expire),
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });
    }

    return {
      success: {
        session,
        message: "Successfully logged in.",
        statusCode: 200,
        email: email,
        password: password,
      },
    };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return {
        error: {
          message: e.message,
          statusCode: e.code,
          cause: "INVALID_CREDENTIALS",
        },
      };
    }
    return {
      error: {
        message: "An error occurred while trying to login.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
        fields: {
          email: "Email is required.",
          password: "Password is required.",
        },
      },
    };
  }
};

export const createAccount = async (
  values: z.infer<typeof signUpFormSchema>
) => {
  try {
    const validatedFields = signUpFormSchema.safeParse(values);

    // Checking validation for fields
    if (!validatedFields.success) {
      return {
        error: {
          fields: validatedFields.error.flatten().fieldErrors,
          message: "Invalid Fields.",
        },
      };
    }

    const { firstName, lastName, email, password } = validatedFields.data;

    const { account, users } = await createAdminClient();

    // Checking if user already exists with the same email
    const userList = await users.list([Query.equal("email", email)]);
    // If unverified user exists then deleting that user
    if (userList.total > 0 && !userList.users[0].emailVerification) {
      await users.delete(userList.users[0].$id);
    }

    // Creating new user with given email and password
    const session = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    // Sending verification email to the user MAGIC URL
    await account.createMagicURLToken(
      session.$id,
      session.email,
      process.env.APP_VERIFY_URL!,
      true
    );

    return {
      success: {
        statusCode: 200,
        message: `Account created successfully! Please check your inbox and verify your email ${session.email}.`,
        cause: "SIGNUP_SUCCESSFUL",
        session,
      },
    };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return {
        error: {
          message: e.message,
          statusCode: e.code,
          cause: "INVALID_CREDENTIALS",
        },
      };
    }
    return {
      error: {
        message: "An error occurred while trying to signup.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
        fields: {
          firstName: "First Name is required.",
          lastName: "Last Name is required.",
          email: "Email is required.",
          password: "Password is required.",
        },
      },
    };
  }
};

export const googleLogin = async () => {
  try {
    const { account } = await createAdminClient();

    const origin = headers().get("origin");

    const redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Google,
      `${origin}/oauth`,
      `${origin}/sign-up`
    );

    return { redirectUrl };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return {
        error: {
          message: e.message,
          statusCode: e.code,
          cause: "UNEXPECTED_ERROR",
        },
      };
    }
    return {
      error: {
        message: "An error occurred while trying to login with google.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};

export const githubLogin = async () => {
  try {
    const { account } = await createAdminClient();

    const origin = headers().get("origin");

    const redirectUrl = await account.createOAuth2Token(
      OAuthProvider.Github,
      `${origin}/gauth`,
      `${origin}/sign-up`
    );

    return { redirectUrl };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return {
        error: {
          message: e.message,
          statusCode: e.code,
          cause: "UNEXPECTED_ERROR",
        },
      };
    }
    return {
      error: {
        message: "An error occurred while trying to login with google.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
      },
    };
  }
};

export const forgotPasswordEmail = async (
  values: z.infer<typeof forgotPasswordEmailFormSchema>
) => {
  try {
    const validatedFields = forgotPasswordEmailFormSchema.safeParse(values);

    // Checking validation for fields
    if (!validatedFields.success) {
      return {
        error: {
          fields: validatedFields.error.flatten().fieldErrors,
          message: "Invalid email address.",
        },
      };
    }

    const { email } = validatedFields.data;
    const { users, account } = await createAdminClient();

    // Checking if user exists with the given email
    const userList = await users.list([Query.equal("email", email)]);

    // If user does not exists
    if (userList.total == 0) {
      return {
        error: {
          fields: {
            email: "Provided email is invalid! Please check the email.",
          },
          message: "Invalid Email Address.",
        },
      };
    }

    // Throwing error having null password Assuming they are social accounts
    if (!userList.users[0].password) {
      return {
        error: {
          fields: {
            email: "Provided email is invalid! Please check the email.",
          },
          message: "Invalid Email Address.",
        },
      };
    }

    // Sending password reset OTP to the user's Email account
    const token = await account.createEmailToken(
      userList?.users[0]?.$id,
      userList?.users[0]?.email,
      true
    );

    // Creating JWT token for the user
    const jwtToken = await jwt.sign(
      {
        userId: userList?.users[0]?.$id,
        email: userList?.users[0]?.email,
        name: userList?.users[0]?.name,
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "15m",
      }
    );

    const cookieStore = cookies();

    // Setting JWT token to the user's cookie for user verification
    cookieStore.set("swt", jwtToken, {
      secure: process.env.NODE_ENV === "production",
      expires: new Date(token.expire),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });

    // Setting user's email to the user's cookie for displaying email on the OTP page
    cookieStore.set("email", userList?.users[0]?.email, {
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      expires: new Date(token.expire),
    });

    return {
      success: {
        statusCode: 200,
        message: `Password reset OTP has been sent to ${email}.`,
        cause: "FORGOT_PASSWORD_EMAIL_SUCCESSFULL",
      },
    };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return {
        error: {
          message: e.message,
          statusCode: e.code,
          cause: "INVALID_EMAIL",
        },
      };
    }
    return {
      error: {
        message: "An error occurred while trying to send OTP.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
        fields: {
          email: "Email is required.",
        },
      },
    };
  }
};

export const forgotPasswordPhone = async (
  values: z.infer<typeof forgotPasswordPhoneFormSchema>
) => {
  try {
    const validatedFields = forgotPasswordPhoneFormSchema.safeParse(values);

    // Checking validation for fields
    if (!validatedFields.success) {
      return {
        error: {
          fields: validatedFields.error.flatten().fieldErrors,
          message: "Invalid email address.",
        },
      };
    }

    const { phone } = validatedFields.data;
    const { users, account } = await createAdminClient();

    // Checking if user exists with the given phone number
    const userList = await users.list([
      Query.equal("phone", `${process.env.PHONE_NUMBER_COUNTRY_CODE!}${phone}`),
    ]);

    // If user does not exists
    if (userList.total == 0) {
      return {
        error: {
          fields: {
            phone: "Provided phone number doesnot exists.",
          },
          message: "Invalid Phone Number.",
        },
      };
    }

    // Throwing error having null password Assuming they are social accounts
    if (!userList.users[0].password) {
      return {
        error: {
          fields: {
            phone: "Provided phone number is invalid!",
          },
          message: "Invalid Phone Number.",
        },
      };
    }

    // Sending password reset OTP to the user's Phone number
    const token = await account.createPhoneToken(
      userList?.users[0]?.$id,
      userList?.users[0]?.phone
    );

    // Creating JWT token for the user
    const jwtToken = await jwt.sign(
      {
        userId: userList?.users[0]?.$id,
        email: userList?.users[0]?.email,
        name: userList?.users[0]?.name,
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "15m",
      }
    );

    const cookieStore = cookies();

    // Setting JWT token to the user's cookie for user verification
    cookieStore.set("swt", jwtToken, {
      secure: process.env.NODE_ENV === "production",
      expires: new Date(token.expire),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });

    // Setting user's email to the user's cookie for displaying email on the OTP page
    cookieStore.set("email", userList?.users[0]?.email, {
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      expires: new Date(token.expire),
    });

    return {
      success: {
        statusCode: 200,
        message: `Password reset OTP has been sent to ${phone}.`,
        cause: "FORGOT_PASSWORD_PHONE_SUCCESSFULL",
      },
    };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return {
        error: {
          message: e.message,
          statusCode: e.code,
          cause: "INVALID_PHONE_NUMBER",
        },
      };
    }
    return {
      error: {
        message: "An error occurred while trying to send OTP.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
        fields: {
          phone: "Phone Number is required.",
        },
      },
    };
  }
};

export const verifyOTP = async (
  values: z.infer<typeof verifyOtpFormSchema>
) => {
  try {
    const validatedFields = verifyOtpFormSchema.safeParse(values);

    // Checking validation for fields
    if (!validatedFields.success) {
      return {
        error: {
          fields: validatedFields.error.flatten().fieldErrors,
          message: "Invalid email address.",
        },
      };
    }

    const { pin } = validatedFields.data;
    const { users, account, databases } = await createAdminClient();
    const cookie = cookies().get("swt")?.value;

    // Verifying JWT token for the user
    const jwtInfo = jwt.verify(cookie!, process.env.JWT_SECRET_KEY!);

    // Verifying OTP with the provided PIN
    const session = await account.createSession(
      (jwtInfo as jwt.JwtPayload).userId,
      pin
    );

    // Deleting users session
    await users.deleteSession(session.userId, session.$id);

    // Checking if user exists in the database or in the Authentication collection
    const { documents: auth, total } = await databases.listDocuments(
      appwriteConfig.generalDatabaseId,
      appwriteConfig.authenticationCollectionId,
      [Query.equal("userId", (jwtInfo as jwt.JwtPayload).userId)]
    );

    const expireDate = new Date(
      (await getTimeAfterFiveMinutes(session.$createdAt)).toString()
    );

    //If the user exists in the database
    if (total > 0 || auth.length > 0) {
      await databases.updateDocument(
        appwriteConfig.generalDatabaseId,
        appwriteConfig.authenticationCollectionId,
        auth[0].$id,
        {
          createdAt: session.$createdAt,
          expiresAt: expireDate,
          secret: pin,
        }
      );
    }
    // If user does not exists then creating a new document
    else {
      await databases.createDocument(
        appwriteConfig.generalDatabaseId,
        appwriteConfig.authenticationCollectionId,
        ID.unique(),
        {
          userId: session.userId,
          createdAt: session.$createdAt,
          expiresAt: expireDate,
          secret: pin,
        }
      );
    }

    // Generating JWT token for the user
    const jwtToken = jwt.sign(
      {
        userId: session.userId + "." + generateSecretCode(pin),
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "5m",
      }
    );

    // Setting and Deleting users session cookies
    const cookieStore = await cookies();
    cookieStore.set("npw", jwtToken, {
      secure: process.env.NODE_ENV === "production",
      expires: new Date(expireDate),
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });
    cookieStore.delete("swt");
    cookieStore.delete("email");

    return {
      success: {
        statusCode: 200,
        message: "OTP Vefified Successfully",
        cause: "OTP_VERIFIED_SUCCESSFULL",
      },
    };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return {
        error: {
          message: e.message,
          statusCode: e.code,
          cause: "INVALID_PIN_NUMBER",
        },
      };
    }
    return {
      error: {
        message: "An error occurred while trying to verify OTP.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
        fields: {
          phone: "Pin is required.",
        },
      },
    };
  }
};

export const changeForgotPassword = async (
  values: z.infer<typeof resetPasswordFormSchema>
) => {
  try {
    const validatedFields = resetPasswordFormSchema.safeParse(values);

    // Checking validation for fields
    if (!validatedFields.success) {
      return {
        error: {
          fields: validatedFields.error.flatten().fieldErrors,
          message: "Invalid email address.",
        },
      };
    }

    const { newPassword, confirmPassword } = validatedFields.data;

    // Checking if new password and confirm password matches
    if (newPassword !== confirmPassword)
      return {
        error: {
          message: "Passwords does not match!",
          statusCode: 400,
          cause: "PASSWORD_NOT_MATCH",
          fields: {
            confirmPassword: "Confirm Password must be same as New Password.",
          },
        },
      };

    // Getting JWT token from the user's cookie
    const cookieStore = await cookies();
    const npwCookie = cookieStore.get("npw")?.value;

    const jwtInfo = jwt.verify(npwCookie || "", process.env.JWT_SECRET_KEY!);

    const decodedPin = decodeSecretCode(
      (jwtInfo as jwt.JwtPayload).userId.split(".").pop()
    );
    const decodedUserId = (jwtInfo as jwt.JwtPayload).userId.split(".")[0];

    const { databases, users } = await createAdminClient();

    // Checking if user exists in the database or in the Authentication collection
    const { documents: auth, total } = await databases.listDocuments(
      appwriteConfig.generalDatabaseId,
      appwriteConfig.authenticationCollectionId,
      [Query.equal("userId", decodedUserId)]
    );

    if (total <= 0 || auth.length <= 0)
      return {
        error: {
          message: "OTP expired or invalid.",
          statusCode: 400,
          cause: "INVALID_OTP",
        },
      };

    // If user exists in the database
    if (total > 0 || AuthenticatorAssertionResponse.length > 0) {
      // If secret code did not match
      if (auth[0].secret !== decodedPin) {
        cookieStore.delete("npw");
        return {
          error: {
            message: "Invalid OTP.",
            statusCode: 400,
            cause: "INVALID_OTP",
          },
        };
      }

      // Checking if OTP is expired or not
      if (new Date(auth[0].expire) < new Date()) {
        cookieStore.delete("npw");
        return {
          error: {
            message: "OTP expired. Please try again",
            statusCode: 400,
            cause: "OTP_EXPIRED",
          },
        };
      }
    }

    // If everything is fine
    await users.updatePassword(decodedUserId, newPassword);
    await databases.deleteDocument(
      appwriteConfig.generalDatabaseId,
      appwriteConfig.authenticationCollectionId,
      auth[0].$id
    );
    cookieStore.delete("npw");

    return {
      success: {
        statusCode: 200,
        message: "Password changed successfully.",
        cause: "PASSWORD_CHANGED_SUCCESSFULL",
      },
    };
  } catch (e) {
    if (e instanceof AppwriteException) {
      return {
        error: {
          message: e.message,
          statusCode: e.code,
          cause: "INVALID_DATA_TYPES",
        },
      };
    }
    return {
      error: {
        message: "An error occurred while trying to change password.",
        statusCode: 500,
        cause: "INTERNAL_SERVER_ERROR",
        fields: {
          newPassword: "Invalid Data Types",
          confirmPassword: "Invalid Data Types",
        },
      },
    };
  }
};

export const signOut = async () => {
  try {
    const { account } = await createSessionClient();

    await account.deleteSessions();

    const cookieStore = await cookies();
    cookieStore.delete("session");

    return {
      success: true,
      message: "Logged out successfully.",
      cause: "SIGNOUT_SUCCESSFUL",
    };
  } catch (error) {
    if (error) {
      const cookieStore = await cookies();
      cookieStore.delete("session");
      return {
        success: true,
        message: "Logged out successfully.",
        cause: "SIGNOUT_SUCCESSFUL",
      };
    }
  }
};
