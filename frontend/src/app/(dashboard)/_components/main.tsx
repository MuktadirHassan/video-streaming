"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollArea
        className="col-span-3 lg:col-span-4 lg:border-l p-4"
        style={{
          height: "calc(100vh - 3rem)",
        }}
      >
        {children}
      </ScrollArea>
    </>
  );
}
