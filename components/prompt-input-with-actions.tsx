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
import { PromptBox } from "@/components/chatgpt-prompt-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React, { memo, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import {
  AlertTriangle,
  Copy,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { TypingLoader } from "@/components/ui/loader"
import Image from "next/image"

type MessageComponentProps = {
  message: UIMessage
  isLastMessage: boolean
}

const MessageComponent = memo(
  ({ message, isLastMessage }: MessageComponentProps) => {
    const [copied, setCopied] = useState(false)
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
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
              <MessageAction tooltip={copied ? "Copied!" : "Copy"} delayDuration={100}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full transition-colors",
                    copied && "text-green-600 dark:text-green-400"
                  )}
                  onClick={async () => {
                    try {
                      const textContent = message.parts
                        .map((part) => (part.type === "text" ? part.text : null))
                        .join("");
                      await navigator.clipboard.writeText(textContent);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch (err) {
                      console.error('Failed to copy message:', err);
                    }
                  }}
                >
                  <Copy className={cn("h-4 w-4", copied && "animate-pulse")} />
                </Button>
              </MessageAction>
              <MessageAction tooltip={liked ? "Liked!" : "Upvote"} delayDuration={100}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full transition-colors",
                    liked && "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  )}
                  onClick={() => {
                    setLiked(!liked);
                    if (disliked) setDisliked(false);
                  }}
                >
                  <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
                </Button>
              </MessageAction>
              <MessageAction tooltip={disliked ? "Disliked!" : "Downvote"} delayDuration={100}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full transition-colors",
                    disliked && "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                  )}
                  onClick={() => {
                    setDisliked(!disliked);
                    if (liked) setLiked(false);
                  }}
                >
                  <ThumbsDown className={cn("h-4 w-4", disliked && "fill-current")} />
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
              <MessageAction tooltip={copied ? "Copied!" : "Copy"} delayDuration={100}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full transition-colors",
                    copied && "text-green-600 dark:text-green-400"
                  )}
                  onClick={async () => {
                    try {
                      const textContent = message.parts
                        .map((part) => (part.type === "text" ? part.text : null))
                        .join("");
                      await navigator.clipboard.writeText(textContent);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch (err) {
                      console.error('Failed to copy message:', err);
                    }
                  }}
                >
                  <Copy className={cn("h-4 w-4", copied && "animate-pulse")} />
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
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className="my-4 border border-border rounded-md overflow-hidden" style={{ backgroundColor: 'var(--gray-50)' }}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2" style={{ backgroundColor: 'var(--gray-50)' }}>
        <span className="text-sm font-semibold text-foreground capitalize">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="-mr-2 h-8 px-2 hover:bg-muted/50 transition-colors"
        >
          {copied ? (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Copied!</span>
          ) : (
            <Copy size={14} />
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed" style={{ backgroundColor: 'var(--gray-50)' }}>
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
        <ChatContainerContent className="space-y-12 px-4 py-12 min-h-full max-[379px]:px-2 max-[379px]:py-6 max-[379px]:space-y-6">
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
      
      <div className="shrink-0 bg-background p-4 max-[379px]:p-2">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full">
            <PromptBox
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything..."
              className="w-full max-[379px]:text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export { PromptInputWithActions }