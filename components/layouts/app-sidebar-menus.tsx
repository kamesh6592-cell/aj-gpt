"use client";
import {
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarGroupContent } from "@/components/ui/sidebar";
import { SidebarGroup } from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

export function AppSidebarMenus() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
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
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}