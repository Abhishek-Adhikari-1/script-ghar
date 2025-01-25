import { envVariables } from "./../../../lib/appwrite/config";
import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId")!;
  const secret = request.nextUrl.searchParams.get("secret")!;

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  cookies().set("session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return NextResponse.redirect(`${envVariables.homepageUrl}/`);
}
