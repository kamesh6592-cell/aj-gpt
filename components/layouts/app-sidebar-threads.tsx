"use client";

import { SidebarGroupLabel, SidebarMenuSub } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  SidebarMenuButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SidebarGroupContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarGroup } from "@/components/ui/sidebar";
import { useState } from "react";

// Using the existing conversation history from your current app
const conversationHistory = [
  {
    period: "Today",
    conversations: [
      {
        id: "t1",
        title: "Project Roadmap Discussion",
        lastMessage:
          "Let's prioritize the authentication features for the next sprint.",
        timestamp: new Date().setHours(new Date().getHours() - 2),
      },
      {
        id: "t2",
        title: "API Documentation Review",
        lastMessage:
          "The endpoint descriptions need more detail about rate limiting.",
        timestamp: new Date().setHours(new Date().getHours() - 5),
      },
      {
        id: "t3",
        title: "Database Schema Planning",
        lastMessage:
          "We should normalize the user preferences table structure.",
        timestamp: new Date().setHours(new Date().getHours() - 8),
      },
    ],
  },
  {
    period: "Yesterday",
    conversations: [
      {
        id: "y1",
        title: "Code Review Session",
        lastMessage:
          "The new authentication flow looks solid, just minor adjustments needed.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
      {
        id: "y2",
        title: "Performance Optimization",
        lastMessage:
          "Implementing lazy loading reduced the initial bundle size significantly.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
    ],
  },
  {
    period: "This Week",
    conversations: [
      {
        id: "w1",
        title: "Design System Updates",
        lastMessage:
          "The new color palette enhances accessibility across all components.",
        timestamp: new Date().setDate(new Date().getDate() - 3),
      },
      {
        id: "w2",
        title: "Component Library",
        lastMessage:
          "These new UI components follow the design system guidelines perfectly.",
        timestamp: new Date().setDate(new Date().getDate() - 5),
      },
    ],
  },
];

export function AppSidebarThreads() {
  const [currentThreadId] = useState<string | null>(null);

  return (
    <>
      {conversationHistory.map((group) => {
        return (
          <SidebarGroup key={group.period}>
            <SidebarGroupContent className="group-data-[collapsible=icon]:hidden group/threads">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarGroupLabel className="">
                    <h4 className="text-xs text-muted-foreground group-hover/threads:text-foreground transition-colors">
                      {group.period}
                    </h4>
                    <div className="flex-1" />
                  </SidebarGroupLabel>

                  {group.conversations.map((thread) => (
                    <SidebarMenuSub
                      key={thread.id}
                      className={"group/thread mr-0"}
                    >
                      <SidebarMenuSubItem>
                        <div className="flex items-center group-hover/thread:bg-input rounded-lg">
                          <SidebarMenuButton
                            asChild
                            className="group-hover/thread:bg-transparent"
                            isActive={currentThreadId === thread.id}
                          >
                            <Link
                              href={`#${thread.id}`}
                              className="flex items-center"
                            >
                              <p className="truncate min-w-0">
                                {thread.title || "New Chat"}
                              </p>
                            </Link>
                          </SidebarMenuButton>
                        </div>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  ))}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}