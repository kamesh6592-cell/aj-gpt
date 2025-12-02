"use client"

import { CodeBlockEnhanced } from "@/components/code-block-enhanced"
import { OpenAICodeBlockComponent } from "@/components/code-block"

export function CodeBlockDemo() {
  const codeSnippet = `import { CodeBlock } from "@openai/apps-sdk-ui/components/CodeBlock"
import { CopyButton } from "@openai/apps-sdk-ui/components/CopyButton"

const codeSnippet = \`function greet(name: string): string {
  return \\\`Hello, \${name}! Welcome to AJ STUDIOZ.\\\`
}

const message = greet("World")
console.log(message)\`

return (
  <CodeBlockBase>
    <div className="flex items-center justify-between bg-(--alpha-02) border-b border-b-(--alpha-06) px-4 py-1">
      <span className="text-sm font-semibold text-secondary">typescript</span>
      <CopyButton
        variant="ghost"
        color="secondary"
        size="md"
        uniform
        copyValue={codeSnippet}
        className="-mr-2"
      />
    </div>
    <CodeBlockBase.Code language="typescript">
      {codeSnippet}
    </CodeBlockBase.Code>
  </CodeBlockBase>
)`

  const exampleCode = `function calculateSum(a: number, b: number): number {
  return a + b;
}

const result = calculateSum(10, 20);
console.log(\`Result: \${result}\`);`

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">Enhanced CodeBlock Component</h2>
        <CodeBlockEnhanced 
          code={exampleCode}
          language="typescript"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">OpenAI Style CodeBlock</h2>
        <OpenAICodeBlockComponent 
          codeSnippet={codeSnippet}
          language="typescript"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">JavaScript Example</h2>
        <CodeBlockEnhanced 
          code={`const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'user' }
];

const admins = users.filter(user => user.role === 'admin');
console.log('Admin users:', admins);`}
          language="javascript"
        />
      </div>
    </div>
  )
}