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
import { useTheme } from "next-themes"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { UIMessage } from "ai"
import {
  AlertTriangle,
  Copy,
  ThumbsDown,
  ThumbsUp,
  Search,
  ExternalLink,
  Check,
} from "lucide-react"
import { TypingLoader } from "@/components/ui/loader"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { CodeBlock, CodeBlockCode, CodeBlockGroup } from "@/components/ui/code-block"
import Image from "next/image"

interface SearchResult {
  title: string
  url: string
  content: string
}

interface SearchResponse {
  success: boolean
  results: SearchResult[]
  answer?: string
}

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
  const { theme } = useTheme()

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
    <CodeBlock className="my-4">
      <CodeBlockGroup className="border-b border-border px-4 py-2 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="ml-2 text-sm font-medium text-muted-foreground capitalize">
            {language}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2 hover:bg-muted/50 transition-all duration-200"
        >
          {copied ? (
            <div className="flex items-center gap-2">
              <Check size={14} className="text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Copied!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Copy size={14} />
              <span className="text-xs">Copy</span>
            </div>
          )}
        </Button>
      </CodeBlockGroup>
      <CodeBlockCode
        code={code}
        language={language}
        theme={theme === 'dark' ? 'github-dark' : 'github-light'}
        className="bg-card"
      />
    </CodeBlock>
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

const WebSearchResults = memo(({ results }: { results: SearchResponse }) => {
  if (!results || !results.results) return null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-2 md:px-10 mb-4">
      <div className="group flex w-full flex-col gap-0">
        <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4" />
            <TextShimmer className="text-sm font-semibold">
              Web Search Results
            </TextShimmer>
          </div>
          
          {results.answer && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">Quick Answer:</p>
              <p className="text-blue-700 dark:text-blue-300">{results.answer}</p>
            </div>
          )}

          <div className="space-y-3">
            {results.results.slice(0, 3).map((result: SearchResult, index: number) => (
              <div key={index} className="border border-border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground line-clamp-2">
                      {result.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {result.content}
                    </p>
                  </div>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

WebSearchResults.displayName = "WebSearchResults"

function PromptInputWithActions() {
  const [prompt, setPrompt] = useState("")
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/primitives/chatbot",
    }),
  })

  const isLoading = status !== "ready"

  const performWebSearch = async (query: string) => {
    try {
      setIsSearching(true)
      const response = await fetch('/api/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data: SearchResponse = await response.json()
      setSearchResults(data)
      return data
    } catch (error) {
      console.error('Web search error:', error)
      return null
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return

    let messageText = prompt
    
    if (webSearchEnabled) {
      const searchData = await performWebSearch(prompt)
      if (searchData && searchData.results) {
        const searchContext = searchData.results.map((result: SearchResult) => 
          `[${result.title}](${result.url}): ${result.content}`
        ).join('\n\n')
        
        messageText = `${prompt}\n\n**Web Search Results:**\n${searchContext}`
      }
    }

    sendMessage({ text: messageText })
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
            <>
              {messages.map((message, index) => {
                const isLastMessage = index === messages.length - 1

                return (
                  <MessageComponent
                    key={message.id}
                    message={message}
                    isLastMessage={isLastMessage}
                  />
                )
              })}
              
              {isSearching && (
                <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-2 px-2 md:px-10">
                  <div className="group flex w-full flex-col gap-0">
                    <div className="text-foreground prose w-full min-w-0 flex-1 rounded-lg bg-transparent p-4 flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      <TextShimmer className="text-sm">
                        Searching the web...
                      </TextShimmer>
                    </div>
                  </div>
                </div>
              )}
              
              {searchResults && <WebSearchResults results={searchResults} />}
            </>
          )}

          {status === "submitted" && <LoadingMessage />}
          {status === "error" && error && <ErrorMessage error={error} />}
        </ChatContainerContent>
      </ChatContainerRoot>
      
      <div className="shrink-0 bg-background p-4 max-[379px]:p-2">
        <div className="mx-auto max-w-3xl">
          {webSearchEnabled && (
            <div className="mb-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Search className="h-4 w-4" />
              <TextShimmer className="font-medium" duration={2}>
                Web Search Enabled
              </TextShimmer>
            </div>
          )}
          
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full">
            <div className="relative">
              <PromptBox
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={webSearchEnabled ? "Ask anything and I'll search the web..." : "Ask anything..."}
                className="w-full max-[379px]:text-sm pr-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              
              <button
                type="button"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={cn(
                  "absolute right-3 top-3 p-2 rounded-full transition-all duration-200",
                  webSearchEnabled 
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                title={webSearchEnabled ? "Disable web search" : "Enable web search"}
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export { PromptInputWithActions }