"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarHeaderSharedProps {
  title: string | React.ReactNode;
  href: string;
  showMobileToggle?: boolean;
  onLinkClick?: () => void;
  enableShortcuts?: boolean;
}

export function SidebarHeaderShared({
  href,
  onLinkClick,
  enableShortcuts = false,
}: SidebarHeaderSharedProps) {
  const { toggleSidebar, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const currentPath = useRef<string | null>(null);

  // Handle shortcuts (only for main app sidebar)
  useEffect(() => {
    if (!enableShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, enableShortcuts]);

  useEffect(() => {
    if (pathname === currentPath.current) return;
    if (isMobile) {
      setOpenMobile(false);
    }
    currentPath.current = pathname;
  }, [pathname, isMobile, setOpenMobile]);

  const handleLinkClick = (e: React.MouseEvent) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick();
    }
  };

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-0.5 mb-1">
          <SidebarMenuButton 
            asChild 
            className="hover:bg-transparent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
          >
            <Link href={href} onClick={handleLinkClick} className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
              <Image 
                src="/AJ.svg" 
                alt="AJ GPT Logo" 
                width={32} 
                height={32} 
                className="rounded-full flex-shrink-0"
              />
              <span className="font-bold text-lg group-data-[collapsible=icon]:hidden text-orange-600 dark:text-orange-400">
                AJ GPT
              </span>
            </Link>
          </SidebarMenuButton>
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden" />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}