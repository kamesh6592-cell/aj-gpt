"use client"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockEnhancedProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlockEnhanced({ 
  code, 
  language = "typescript",
  className 
}: CodeBlockEnhancedProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className={cn("rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between bg-muted/50 border-b border-border px-4 py-1">
        <span className="text-sm font-semibold text-secondary">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="-mr-2 h-7 px-2"
        >
          <Copy size={14} />
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm bg-card">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

// Example usage component
export function CodeBlockExample() {
  const codeSnippet = `function greet(name: string): string {
  return \`Hello, \${name}! Welcome to AJ STUDIOZ.\`
}

const message = greet("World")
console.log(message)`

  return (
    <CodeBlockEnhanced
      code={codeSnippet}
      language="typescript"
      className="my-4"
    />
  )
}