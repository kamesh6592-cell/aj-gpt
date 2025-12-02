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
} from "lucide-react"
import { TypingLoader } from "@/components/ui/loader"
import { memo, useState } from "react"
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
            <MessageContent
              className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-0"
              markdown
            >
              {message.parts
                .map((part) => (part.type === "text" ? part.text : null))
                .join("")}
            </MessageContent>
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
                <PromptInputAction tooltip="Add a new action">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                  >
                    <Plus size={18} />
                  </Button>
                </PromptInputAction>

                <PromptInputAction tooltip="Search">
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