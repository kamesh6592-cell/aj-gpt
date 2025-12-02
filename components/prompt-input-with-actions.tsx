"use client"

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/chat-container"

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/message"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import {
  AlertTriangle,
  ArrowUp,
  Copy,
  Globe,
  Mic,
  MoreHorizontal,
  Plus,
  ThumbsDown,
  ThumbsUp,
  MessageSquare,
  Upload,
  Camera,
  FileText,
  Search,
  Code,
  Image as ImageIcon,
  Wrench,
  Zap,
  Keyboard,
} from "lucide-react"
import { TypingLoader } from "@/components/ui/loader"
import { Menu } from "@openai/apps-sdk-ui/components/Menu"
import { Button as OpenAIButton } from "@openai/apps-sdk-ui/components/Button"
import React, { memo, useState } from "react"
import Image from "next/image"

type MessageComponentProps = {
  message: UIMessage
  isLastMessage: boolean
}

const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    const isAssistant = message.role === "assistant"

    return (
      <Message
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-col gap-2 px-2 md:px-10",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        {isAssistant ? (
          <div className="group flex w-full flex-col gap-0">
            <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0">
              {(() => {
                const content = message.parts
                  .map((part) => (part.type === "text" ? part.text : null))
                  .join("");
                
                // Check for code blocks in backticks
                const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
                const parts = [];
                let lastIndex = 0;
                let match;
                
                while ((match = codeBlockRegex.exec(content)) !== null) {
                  // Add text before code block
                  if (match.index > lastIndex) {
                    const textContent = content.slice(lastIndex, match.index);
                    if (textContent.trim()) {
                      parts.push(
                        <MessageContent key={`text-${lastIndex}`} markdown className="bg-transparent p-0">
                          {textContent}
                        </MessageContent>
                      );
                    }
                  }
                  
                  // Add code block
                  const language = match[1] || 'python';
                  const code = match[2].trim();
                  parts.push(<CodeBlockRenderer key={`code-${match.index}`} code={code} language={language} />);
                  
                  lastIndex = match.index + match[0].length;
                }
                
                // Add remaining text
                if (lastIndex < content.length) {
                  const remainingContent = content.slice(lastIndex);
                  if (remainingContent.trim()) {
                    parts.push(
                      <MessageContent key={`text-${lastIndex}`} markdown className="bg-transparent p-0">
                        {remainingContent}
                      </MessageContent>
                    );
                  }
                }
                
                return parts.length > 0 ? parts : (
                  <MessageContent markdown className="bg-transparent p-0">
                    {content}
                  </MessageContent>
                );
              })()}
            </div>
            <MessageActions
              className={cn(
                "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                isLastMessage && "opacity-100"
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Upvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsUp />
                </Button>
              </MessageAction>
              <MessageAction tooltip="Downvote" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ThumbsDown />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        ) : (
          <div className="group flex w-full flex-col items-end gap-1">
            <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 whitespace-pre-wrap sm:max-w-[75%]">
              {message.parts
                .map((part) => (part.type === "text" ? part.text : null))
                .join("")}
            </MessageContent>
            <MessageActions
              className={cn(
                "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              )}
            >
              <MessageAction tooltip="Copy" delayDuration={100}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Copy />
                </Button>
              </MessageAction>
            </MessageActions>
          </div>
        )}
      </Message>
    )
  }
)

MessageComponent.displayName = "MessageComponent"

const CodeBlockRenderer = memo(({ code, language = "python" }: { code: string; language?: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="my-4 border border-border" style={{ backgroundColor: 'var(--gray-100, light-dark(#ededed, #181818))', borderRadius: 'var(--radius-md)' }}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2" style={{ backgroundColor: 'var(--gray-100, light-dark(#ededed, #181818))', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }}>
        <span className="text-sm font-semibold text-foreground">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="-mr-2 h-8 px-2 hover:bg-muted/50"
        >
          <Copy size={14} />
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed" style={{ backgroundColor: 'var(--gray-100, light-dark(#ededed, #181818))', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)' }}>
        <code className={`language-${language} text-foreground`}>{code}</code>
      </pre>
    </div>
  )
})

CodeBlockRenderer.displayName = "CodeBlockRenderer"

const LoadingMessage = memo(() => (
  <Message className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col gap-0">
      <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-4 flex items-center">
        <TypingLoader size="lg" className="text-muted-foreground" />
      </div>
    </div>
  </Message>
))

LoadingMessage.displayName = "LoadingMessage"

const ErrorMessage = memo(({ error }: { error: Error }) => (
  <Message className="not-prose mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-0 md:px-10">
    <div className="group flex w-full flex-col items-start gap-0">
      <div className="text-primary flex min-w-0 flex-1 flex-row items-center gap-2 rounded-lg border-2 border-red-300 bg-red-300/20 px-2 py-1">
        <AlertTriangle size={16} className="text-red-500" />
        <p className="text-red-500">{error.message}</p>
      </div>
    </div>
  </Message>
))

ErrorMessage.displayName = "ErrorMessage"

function PromptInputWithActions() {
  const [prompt, setPrompt] = useState("")

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/primitives/chatbot",
    }),
  })

  const isLoading = status !== "ready"

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return

    sendMessage({ text: prompt })
    setPrompt("")
  }

  return (
    <div className="flex h-full flex-col">
      <ChatContainerRoot className="flex-1 overflow-y-auto">
        <ChatContainerContent className="space-y-12 px-4 py-12 min-h-full">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Image src="/AJ.svg" alt="AJ STUDIOZ" width={48} height={48} className="size-12 mr-3" />
                  <h2 className="text-3xl font-bold">AJ STUDIOZ</h2>
                </div>
                <p className="text-muted-foreground text-lg">Your AI Assistant is ready to help</p>
                <p className="text-muted-foreground mt-2">Start a conversation by typing a message below</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1

              return (
                <MessageComponent
                  key={message.id}
                  message={message}
                  isLastMessage={isLastMessage}
                />
              )
            })
          )}

          {status === "submitted" && <LoadingMessage />}
          {status === "error" && error && <ErrorMessage error={error} />}
        </ChatContainerContent>
      </ChatContainerRoot>
      
      <div className="shrink-0 border-t bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <PromptInput
            isLoading={isLoading}
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={handleSubmit}
            className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
          >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder="Ask anything"
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            />

            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
            <div className="flex items-center gap-2">
              <Menu>
                <Menu.Trigger asChild>
                  <OpenAIButton 
                    color="primary" 
                    size="md" 
                    variant="ghost"
                    className="hover:bg-muted/50 transition-colors duration-150"
                  >
                    <Plus size={18} />
                  </OpenAIButton>
                </Menu.Trigger>
                <Menu.Content 
                  width={280} 
                  minWidth={280}
                  side="top"
                  align="start"
                  sideOffset={12}
                >
                  {/* New Chat - Highlighted */}
                  <Menu.Item onSelect={() => console.log('New Chat')}>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <MessageSquare size={16} className="text-primary" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold text-sm text-foreground">New Chat</p>
                        <p className="text-xs text-muted-foreground leading-tight">Start a fresh conversation</p>
                      </div>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Separator />
                  
                  {/* Tools Section */}
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Tools</span>
                    </div>
                  </div>
                  
                  <Menu.Item onSelect={() => console.log('Function')}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex justify-center">
                        <Zap size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">Function</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Item onSelect={() => console.log('File Search')}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex justify-center">
                        <Search size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">File Search</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Item onSelect={() => console.log('Web Search')}>
                    <div className="flex items-center gap-3 px-2 py-1">
                      <div className="w-8 flex justify-center">
                        <Globe size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">Web Search</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Item onSelect={() => console.log('Code Interpreter')}>
                    <div className="flex items-center gap-3 px-2 py-1">
                      <div className="w-8 flex justify-center">
                        <Code size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">Code Interpreter</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Item onSelect={() => console.log('Image Generation')}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex justify-center">
                        <ImageIcon size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">Image Generation</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Separator />
                  
                  {/* Input Methods */}
                  <Menu.Item onSelect={() => console.log('Upload File')}>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <Upload size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">Upload File</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Item onSelect={() => console.log('Voice Input')}>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="p-1.5 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <Mic size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium">Voice Input</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Item onSelect={() => console.log('Camera')}>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                        <Camera size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium">Camera</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Separator />
                  
                  {/* Quick Actions */}
                  <Menu.Item onSelect={() => console.log('Templates')}>
                    <div className="flex items-center gap-3 px-2 py-1">
                      <div className="w-8 flex justify-center">
                        <FileText size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm">Templates</span>
                    </div>
                  </Menu.Item>
                  
                  <Menu.Item onSelect={() => console.log('Keyboard Shortcuts')}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex justify-center">
                        <Keyboard size={16} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">Keyboard Shortcuts</span>
                    </div>
                  </Menu.Item>
                </Menu.Content>
              </Menu>                <PromptInputAction tooltip="Search">
                  <Button variant="outline" className="rounded-full">
                    <Globe size={18} />
                    Search
                  </Button>
                </PromptInputAction>

                <PromptInputAction tooltip="More actions">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                  >
                    <MoreHorizontal size={18} />
                  </Button>
                </PromptInputAction>
              </div>
              <div className="flex items-center gap-2">
                <PromptInputAction tooltip="Voice input">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                  >
                    <Mic size={18} />
                  </Button>
                </PromptInputAction>

                <Button
                  size="icon"
                  disabled={!prompt.trim() || isLoading}
                  onClick={handleSubmit}
                  className="size-9 rounded-full"
                >
                  {!isLoading ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
        </div>
      </div>
    </div>
  )
}

export { PromptInputWithActions }