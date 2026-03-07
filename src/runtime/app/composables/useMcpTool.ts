import { onMounted, onUnmounted } from 'vue'

interface ToolContent {
  type: string
  text: string
}

interface ToolResponse {
  content?: ToolContent[]
  isError?: boolean
  [key: string]: unknown
}

interface ToolInputSchema {
  type: 'object'
  properties: Record<string, unknown>
  required?: string[]
}

interface McpToolOptions {
  /** Unique tool name */
  name: string
  /** Human-readable description of what the tool does */
  description: string
  /** JSON Schema for tool input parameters */
  inputSchema: ToolInputSchema
  /** Tool execution handler */
  execute: (args: Record<string, unknown>) => Promise<ToolResponse>
}

/**
 * Composable for registering an MCP tool with automatic lifecycle management.
 *
 * The tool is registered on mount and automatically unregistered on unmount,
 * making it ideal for component-scoped tools.
 *
 * @example
 * ```vue
 * <script setup>
 * useMcpTool({
 *   name: 'get-page-title',
 *   description: 'Returns the current page title',
 *   inputSchema: { type: 'object', properties: {} },
 *   execute: async () => ({
 *     content: [{ type: 'text', text: document.title }]
 *   })
 * })
 * </script>
 * ```
 */
export function useMcpTool(options: McpToolOptions): void {
  let unregister: (() => void) | null = null

  onMounted(() => {
    if (typeof navigator === 'undefined' || !navigator.modelContext) {
      return
    }

    const registration = navigator.modelContext.registerTool({
      name: options.name,
      description: options.description,
      inputSchema: options.inputSchema,
      execute: options.execute,
    })

    unregister = () => registration.unregister()
  })

  onUnmounted(() => {
    unregister?.()
    unregister = null
  })
}
