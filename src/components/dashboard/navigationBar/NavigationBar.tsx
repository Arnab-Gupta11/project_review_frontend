"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import RightSection from "./_components/RightSection/RightSection";
import { useEffect, useState } from "react";

export default function NavigationBar() {
  const user = useAppSelector((state: any) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
    } else if (hour >= 21 || hour < 5) {
      setGreeting("Good Night");
    }
  }, []);

  const name = user?.name || "Guest";

  return (
    <header className="sticky top-0 z-40 flex w-full shrink-0 items-center border-b border-white/[0.08] bg-[rgba(4,20,28,0.72)] backdrop-blur-xl px-4 py-3.5 lg:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-primary hover:text-primary bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-primary/40 h-9 w-9 cursor-pointer rounded-xl transition-all shadow-sm active:scale-95" />
          <div className="text-primary-text hidden text-base font-medium md:block">
            {mounted ? (
              <>
                <span className="text-secondary-text">{greeting},</span>{" "}
                <span className="font-semibold text-white tracking-tight">{name}</span>
              </>
            ) : (
              <Skeleton className="h-6 w-48 rounded-md bg-white/[0.06]" />
            )}
          </div>
        </div>

        <RightSection />
      </div>
    </header>
  );
}
