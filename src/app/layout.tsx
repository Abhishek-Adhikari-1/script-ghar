import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { getLoggedInUser } from "@/server/actions/user.actions";
import { AuthProvider } from "@/hooks/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Abhishek",
  description: "Made by Abhishek Adhikari",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getUser = await getLoggedInUser();
  const currentUser = getUser?.success ? getUser?.user : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} --font-poppins antialiased relative bg-background`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <EdgeStoreProvider>
            <AuthProvider initialUser={currentUser}>{children}</AuthProvider>
          </EdgeStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
