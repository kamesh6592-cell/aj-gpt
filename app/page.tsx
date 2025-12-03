import { PromptInputWithActions } from "@/components/prompt-input-with-actions";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LiquidButton } from "@/components/ui/shadcn-io/liquid-button"
import { Search } from "lucide-react"

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
        title: "Frontend Bug Analysis",
        lastMessage:
          "I found the issue - we need to handle the null state in the user profile component.",
        timestamp: new Date().setHours(new Date().getHours() - 8),
      },
    ],
  },
  {
    period: "Yesterday",
    conversations: [
      {
        id: "y1",
        title: "Database Schema Design",
        lastMessage:
          "Let's add indexes to improve query performance on these tables.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
      {
        id: "y2",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
    ],
  },
  {
    period: "Last 7 days",
    conversations: [
      {
        id: "w1",
        title: "Authentication Flow",
        lastMessage: "We should implement the OAuth2 flow with refresh tokens.",
        timestamp: new Date().setDate(new Date().getDate() - 3),
      },
      {
        id: "w2",
        title: "Component Library",
        lastMessage:
          "These new UI components follow the design system guidelines perfectly.",
        timestamp: new Date().setDate(new Date().getDate() - 5),
      },
      {
        id: "w3",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 6),
      },
    ],
  },
  {
    period: "Last month",
    conversations: [
      {
        id: "m1",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 15),
      },
      {
        id: "m2",
        title: "Requirements Gathering",
        lastMessage:
          "The stakeholders approved the feature specifications document.",
        timestamp: new Date().setDate(new Date().getDate() - 22),
      },
      {
        id: "m3",
        title: "Tech Stack Selection",
        lastMessage:
          "We decided on Next.js, Tailwind, and a serverless backend architecture.",
        timestamp: new Date().setDate(new Date().getDate() - 28),
      },
      {
        id: "m4",
        title: "Project Planning",
        lastMessage: "We need to create a project plan for the next sprint.",
        timestamp: new Date().setDate(new Date().getDate() - 30),
      },
      {
        id: "m5",
        title: "Code Review",
        lastMessage: "We need to review the code for the next sprint.",
        timestamp: new Date().setDate(new Date().getDate() - 35),
      },
      {
        id: "m6",
        title: "Bug Discussion",
        lastMessage: "We need to discuss the bugs for the next sprint.",
        timestamp: new Date().setDate(new Date().getDate() - 37),
      },
    ],
  },
]

function SidebarWithChatHistory() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 px-2 py-4">
        <LiquidButton 
          variant="outline" 
          size="default"
          className="flex items-center gap-2 px-3 py-2 h-auto border-0 bg-transparent hover:bg-orange-100 dark:hover:bg-orange-900/20 [--liquid-button-color:rgb(255_165_0)] text-orange-600 dark:text-orange-400"
        >
          <Image src="/AJ.svg" alt="AJ STUDIOZ" width={24} height={24} className="size-6" />
          <span className="text-sm font-bold tracking-tight">
            AJ STUDIOZ
          </span>
        </LiquidButton>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button variant="ghost" className="size-8">
            <Search className="size-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        {conversationHistory.map((conversation) => (
          <SidebarGroup key={conversation.period}>
            <SidebarGroupLabel>{conversation.period}</SidebarGroupLabel>
            <SidebarMenu>
              {conversation.conversations.map((conversation) => (
                <SidebarMenuButton key={conversation.id}>
                  <span>{conversation.title}</span>
                </SidebarMenuButton>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

export default function Home() {
  return (
    <SidebarProvider>
      <SidebarWithChatHistory />
      <SidebarInset>
        <main className="flex h-screen flex-col">
          <div className="flex-1 min-h-0">
            <PromptInputWithActions />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
