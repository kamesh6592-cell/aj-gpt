"use client";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

import { AppSidebarMenus } from "./app-sidebar-menus";
import { AppSidebarThreads } from "./app-sidebar-threads";
import { SidebarHeaderShared } from "./sidebar-header";
import { AppSidebarUser } from "./app-sidebar-user";

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

export function AppSidebar({
  user,
}: {
  user?: User;
}) {
  const router = useRouter();

  // Handle new chat shortcut (specific to main app)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        router.push("/");
        router.refresh();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/80"
    >
      <SidebarHeaderShared
        title="AJ GPT"
        href="/"
        enableShortcuts={true}
        onLinkClick={() => {
          router.push("/");
          router.refresh();
        }}
      />

      <SidebarContent className="mt-2 overflow-hidden relative">
        <div className="flex flex-col overflow-y-auto">
          <AppSidebarMenus />
          <AppSidebarThreads />
        </div>
      </SidebarContent>
      <SidebarFooter className="flex flex-col items-stretch space-y-2">
        <AppSidebarUser user={user} />
        
        {/* AJ STUDIOZ Branding */}
        <div className="px-3 py-2 border-t border-sidebar-border/50 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:border-t-0">
          <div className="flex items-center justify-center gap-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:gap-0">
            <span className="group-data-[collapsible=icon]:hidden">Designed by</span>
            <span className="animate-pulse text-red-500 group-data-[collapsible=icon]:hidden">♥</span>
            <div className="flex items-center gap-1 group-data-[collapsible=icon]:gap-0">
              <Image src="/AJ.svg" alt="AJ STUDIOZ" width={16} height={16} className="w-4 h-4" />
              <span className="font-semibold text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden">AJ STUDIOZ</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}