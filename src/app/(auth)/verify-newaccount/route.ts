import { createAdminClient } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { account, users } = await createAdminClient();

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId")!;
    const secret = url.searchParams.get("secret")!;

    const user = await account.createSession(userId, secret);

    await users.updateLabels(user.userId, ["user"]);

    const response = NextResponse.redirect(`${request.nextUrl.origin}/`);
    response.cookies.set("session", user.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return response;
  } catch (error) {
    if (error) return NextResponse.redirect(`${request.nextUrl.origin}/`);
  }
}
