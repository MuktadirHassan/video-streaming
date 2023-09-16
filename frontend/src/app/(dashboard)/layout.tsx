import { ThemeProvider } from "@/components/theme-provider";
import "../global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Menu } from "@/components/menu";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./_components/sidebar";
import Main from "./_components/main";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-background")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>
            <Menu />
            <div className="grid lg:grid-cols-5">
              <Sidebar />
              <Main>{children}</Main>
              <Toaster />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
