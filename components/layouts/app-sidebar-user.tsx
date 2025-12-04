"use client";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenu } from "@/components/ui/sidebar";
import {
  ChevronsUpDown,
  LogOutIcon,
  Settings2,
  Sun,
  MoonStar,
} from "lucide-react";
import { useTheme } from "next-themes";

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

export function AppSidebarUser({
  user,
}: {
  user?: User;
}) {
  const { theme, setTheme } = useTheme();

  // Mock user data if no user provided
  const mockUser = user || {
    name: "Guest User",
    email: "guest@ajgpt.com",
    avatar: "/AJ.svg"
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-input/30 border"
              size={"lg"}
            >
              <Avatar className="rounded-full size-8 border">
                <AvatarImage
                  className="object-cover"
                  src={mockUser.avatar}
                  alt={mockUser.name || "User"}
                />
                <AvatarFallback>{mockUser.name?.slice(0, 1) || "G"}</AvatarFallback>
              </Avatar>
              <span className="truncate">
                {mockUser.email}
              </span>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="bg-background w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-lg"
            align="center"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={mockUser.avatar}
                    alt={mockUser.name || "User"}
                  />
                  <AvatarFallback className="rounded-lg">
                    {mockUser.name?.slice(0, 1) || "G"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {mockUser.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {mockUser.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <Settings2 className="size-4 text-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
              <div className="flex items-center">
                {theme === "dark" ? (
                  <Sun className="size-4 text-foreground" />
                ) : (
                  <MoonStar className="size-4 text-foreground" />
                )}
              </div>
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer">
              <LogOutIcon className="size-4 text-foreground" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}