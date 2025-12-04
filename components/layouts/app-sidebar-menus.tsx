"use client";
import {
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarGroupContent } from "@/components/ui/sidebar";
import { SidebarGroup } from "@/components/ui/sidebar";
import { SettingsModal } from "@/components/ui/settings-modal";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusIcon, Settings } from "lucide-react";

export function AppSidebarMenus() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <TooltipProvider>
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem className="mb-1">
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setOpenMobile(false);
                router.push(`/`);
                router.refresh();
              }}
            >
              <SidebarMenuButton 
                tooltip="New Chat"
                className="flex font-semibold group/new-chat bg-input/20 border border-border/40"
              >
                <PlusIcon className="size-4" />
                New Chat
                <div className="flex items-center gap-1 text-xs font-medium ml-auto opacity-0 group-hover/new-chat:opacity-100 transition-opacity">
                  <span className="border w-5 h-5 flex items-center justify-center bg-accent rounded">
                    ⌘
                  </span>
                  <span className="border w-5 h-5 flex items-center justify-center bg-accent rounded">
                    N
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem className="mb-1">
            <SidebarMenuButton 
              tooltip="Settings"
              className="flex font-medium group/settings cursor-pointer"
              onClick={() => {
                setOpenMobile(false);
                setSettingsOpen(true);
              }}
            >
              <Settings className="size-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </SidebarGroup>
    </TooltipProvider>
  );
}