import { PromptInputWithActions } from "@/components/prompt-input-with-actions";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";



export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
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
