"use client";
import { Menu } from "@/components/menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Home() {
  return (
    <main>
      <Menu />
      <Body />
    </main>
  );
}

function Body() {
  return (
    <div className="grid lg:grid-cols-5">
      <ScrollArea
        className="col-span-1"
        style={{
          height: "calc(100vh - 3rem)",
        }}
      >
        <Sidebar />
      </ScrollArea>
      <ScrollArea
        className="col-span-3 lg:col-span-4 lg:border-l"
        style={{
          height: "calc(100vh - 3rem)",
        }}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
      </ScrollArea>
    </div>
  );
}

const sidebarNav = [
  {
    title: "Dashboard",
    href: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 h-4 w-4"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  {
    title: "Videos",
    href: "/videos",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 h-4 w-4"
      >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
  },
];

function SidebarLink({
  title,
  href,
  icon,
  isActive,
}: {
  title: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link href={href}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start"
      >
        {icon}
        {title}
      </Button>
    </Link>
  );
}

function Sidebar() {
  const currentRoute = usePathname();
  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            {sidebarNav.map((item) => (
              <SidebarLink
                key={item.title}
                title={item.title}
                href={item.href}
                icon={item.icon}
                isActive={currentRoute === item.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
