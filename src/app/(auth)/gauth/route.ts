import { envVariables } from "./../../../lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId")!;
  const secret = request.nextUrl.searchParams.get("secret")!;

  const { account, users } = await createAdminClient();
  const session = await account
    .createSession(userId, secret)
    .then(async (response) => {
      const user = await users.get(userId);

      await users.updateLabels(user.$id, ["user"]);

      await users.updatePrefs(user.$id, {
        firstName: user.name.trim().split(" ")[0],
        lastName: user.name.trim().split(" ").slice(1).join(" "),
      });
      return response;
    });

  cookies().set("session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${envVariables.homepageUrl}/`);
}
