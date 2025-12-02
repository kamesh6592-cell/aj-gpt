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
    <div className={cn("rounded-lg border border-border", className)} style={{ backgroundColor: 'var(--gray-100, light-dark(#ededed, #181818))' }}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2" style={{ backgroundColor: 'var(--gray-100, light-dark(#ededed, #181818))' }}>
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
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed" style={{ backgroundColor: 'var(--gray-100, light-dark(#ededed, #181818))' }}>
        <code className={`language-${language} text-foreground`}>{code}</code>
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