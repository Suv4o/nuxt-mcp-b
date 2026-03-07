# nuxt-mcp-b

[![npm version](https://img.shields.io/npm/v/nuxt-mcp-b?style=flat-square)](https://www.npmjs.com/package/nuxt-mcp-b)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Nuxt module for [`@mcp-b/global`](https://www.npmjs.com/package/@mcp-b/global) — the [W3C Web Model Context API](https://webmachinelearning.github.io/webmcp/) polyfill that lets AI agents like Claude, ChatGPT, Gemini, Cursor, and Copilot discover and call tools on your website.

## Features

- Auto-initializes `@mcp-b/global` on the client — `navigator.modelContext` is ready out of the box
- `useMcpTool` composable for registering tools with automatic Vue lifecycle management
- `useMcpB` composable for manual initialization and cleanup control
- Full TypeScript support with auto-imported composables
- Configurable transport, origins, and native behavior via `nuxt.config.ts`

## Quick Setup

### 1. Install the module

```bash
# npm
npm install nuxt-mcp-b

# yarn
yarn add nuxt-mcp-b

# pnpm
pnpm add nuxt-mcp-b
```

### 2. Add it to your `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: ['nuxt-mcp-b'],
})
```

That's it! `navigator.modelContext` is now available on every page. AI agents can discover and call any tools you register.

## Usage

### Registering a Tool

Use the auto-imported `useMcpTool` composable in any component. The tool is registered when the component mounts and automatically unregistered when it unmounts:

```vue
<script setup lang="ts">
useMcpTool({
  name: 'get-page-title',
  description: 'Returns the current page title',
  inputSchema: { type: 'object', properties: {} },
  execute: async () => ({
    content: [{ type: 'text', text: document.title }],
  }),
})
</script>
```

### Registering a Tool with Input Parameters

```vue
<script setup lang="ts">
useMcpTool({
  name: 'search-products',
  description: 'Search the product catalog by query',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      limit: { type: 'integer', description: 'Max results to return' },
    },
    required: ['query'],
  },
  execute: async (args) => {
    const results = await searchProducts(args.query as string, (args.limit as number) ?? 10)
    return {
      content: [{ type: 'text', text: JSON.stringify(results) }],
    }
  },
})
</script>
```

### Manual Initialization and Cleanup

The `useMcpB` composable gives you direct control over the `@mcp-b/global` lifecycle:

```vue
<script setup lang="ts">
const { initialize, cleanup } = useMcpB()

// Re-initialize with custom options
initialize({
  transport: {
    tabServer: { allowedOrigins: ['https://example.com'] },
  },
})

// Clean up when done
onUnmounted(() => cleanup())
</script>
```

### Registering Tools Directly via `navigator.modelContext`

Since the module initializes `@mcp-b/global` automatically, you can also use the standard Web Model Context API directly:

```vue
<script setup lang="ts">
onMounted(() => {
  const registration = navigator.modelContext.registerTool({
    name: 'add-to-cart',
    description: 'Add a product to the shopping cart',
    inputSchema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        quantity: { type: 'integer' },
      },
      required: ['productId'],
    },
    execute: async (args) => {
      const item = await addToCart(args.productId, args.quantity ?? 1)
      return {
        content: [{ type: 'text', text: `Added ${item.name} to cart` }],
      }
    },
  })

  // Optional: unregister later
  onUnmounted(() => registration.unregister())
})
</script>
```

## Configuration

All options are optional. Configure them under the `mcpB` key in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-mcp-b'],

  mcpB: {
    // Auto-initialize @mcp-b/global on page load (default: true)
    autoInitialize: true,

    // Transport configuration
    transport: {
      // Tab server (same-window communication with browser extensions)
      tabServer: {
        allowedOrigins: ['*'],  // default
        channelId: 'custom-channel',
      },
      // Iframe server (auto-enabled when page is in an iframe)
      // Set to false to disable
      iframeServer: {
        allowedOrigins: ['https://parent-app.com'],
      },
    },

    // Behavior when navigator.modelContext already exists natively
    // 'preserve' (default) | 'patch'
    nativeModelContextBehavior: 'preserve',

    // Whether to install the testing shim
    // true | 'if-missing' (default) | 'always' | false
    installTestingShim: 'if-missing',
  },
})
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoInitialize` | `boolean` | `true` | Whether to auto-initialize `@mcp-b/global` on page load. Set to `false` to initialize manually via `useMcpB().initialize()`. |
| `transport` | `TransportConfiguration` | `undefined` | Configure `tabServer` and `iframeServer` transports. Each accepts `allowedOrigins` and `channelId`, or `false` to disable. |
| `nativeModelContextBehavior` | `'preserve' \| 'patch'` | `'preserve'` | Behavior when `navigator.modelContext` already exists natively. `'preserve'` wraps native with BrowserMcpServer while mirroring core operations. |
| `installTestingShim` | `boolean \| 'always' \| 'if-missing'` | `'if-missing'` | Controls the `modelContextTesting` shim installation. |

## Testing Your WebMCP Tools

Once your site registers tools via this module, you need a way for AI agents to discover and call them. Here are two methods that work well.

### Method 1: `@mcp-b/chrome-devtools-mcp` (Recommended)

[`@mcp-b/chrome-devtools-mcp`](https://docs.mcp-b.ai/packages/chrome-devtools-mcp) is an MCP server that connects your AI client (VS Code, Claude Desktop, Claude Code, Cursor) to a live Chrome browser. It provides two WebMCP-specific tools: `list_webmcp_tools` and `call_webmcp_tool`, which let your AI agent discover and call any tools registered via `navigator.modelContext`.

> **Important:** This is different from Google's official `chrome-devtools-mcp`. Google's version handles browser automation (screenshots, navigation, script evaluation) but does **not** support WebMCP tool discovery. Make sure you use `@mcp-b/chrome-devtools-mcp` (the MCP-B version) for WebMCP testing.

Here's how to set it up for different clients:

**VS Code:**

```bash
code --add-mcp '{"name":"chrome-devtools","command":"npx","args":["-y","@mcp-b/chrome-devtools-mcp@latest"]}'
```

**Claude Code:**

```bash
claude mcp add chrome-devtools npx @mcp-b/chrome-devtools-mcp@latest
```

**Claude Desktop** (add to `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "@mcp-b/chrome-devtools-mcp@latest"]
    }
  }
}
```

**Cursor:** See the [MCP-B documentation](https://docs.mcp-b.ai/packages/chrome-devtools-mcp#cursor) for the direct installer.

Once set up, start your dev server (`npm run dev`), open your site in Chrome, and ask your AI agent to interact with it.

### Method 2: MCP-B Browser Extension

The [MCP-B Extension](https://docs.mcp-b.ai/extension) is a browser extension that discovers WebMCP tools on any page. Install it from the extension page, navigate to your site, and the extension will automatically detect all registered tools — useful for quick manual testing without an AI client setup.

## Composables

### `useMcpTool(options)`

Registers an MCP tool scoped to the component lifecycle. The tool is registered on `onMounted` and unregistered on `onUnmounted`.

**Parameters:**

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unique tool identifier |
| `description` | `string` | Human-readable description of what the tool does |
| `inputSchema` | `{ type: 'object', properties: Record<string, unknown>, required?: string[] }` | JSON Schema for tool input parameters |
| `execute` | `(args: Record<string, unknown>) => Promise<ToolResponse>` | Async handler that executes the tool and returns a response |

**`ToolResponse` format:**

```ts
{
  content?: Array<{ type: string; text: string }>
  isError?: boolean
}
```

### `useMcpB()`

Returns an object with two methods for manual lifecycle control:

| Method | Description |
|--------|-------------|
| `initialize(options?)` | Initialize or re-initialize the Web Model Context. No-op if already initialized. Accepts the same options as `@mcp-b/global`'s `initializeWebModelContext()`. |
| `cleanup()` | Tear down the adapter and restore `navigator.modelContext` to its original state. |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](./LICENSE)
