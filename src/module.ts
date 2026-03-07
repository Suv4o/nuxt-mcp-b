import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface TransportServerOptions {
  allowedOrigins?: string[]
  channelId?: string
}

export interface TransportConfiguration {
  tabServer?: Partial<TransportServerOptions> | false
  iframeServer?: Partial<TransportServerOptions> | false
}

export interface ModuleOptions {
  /**
   * Whether to auto-initialize @mcp-b/global on page load.
   * @default true
   */
  autoInitialize?: boolean

  /**
   * Transport configuration for MCP-B.
   * Configure tabServer and iframeServer options.
   */
  transport?: TransportConfiguration

  /**
   * Behavior when navigator.modelContext already exists natively.
   * - 'preserve' (default): wrap native with BrowserMcpServer
   * - 'patch': same wrapping behavior (backward compatibility)
   * @default 'preserve'
   */
  nativeModelContextBehavior?: 'preserve' | 'patch'

  /**
   * Whether to install the testing shim.
   * - true or 'if-missing' (default): install only when missing
   * - 'always': replace existing
   * - false: do not install
   * @default 'if-missing'
   */
  installTestingShim?: boolean | 'always' | 'if-missing'
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-mcp-b',
    configKey: 'mcpB',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    autoInitialize: true,
    nativeModelContextBehavior: 'preserve',
    installTestingShim: 'if-missing',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Pass module options to runtime via public runtimeConfig
    nuxt.options.runtimeConfig.public.mcpB = {
      autoInitialize: options.autoInitialize,
      transport: options.transport,
      nativeModelContextBehavior: options.nativeModelContextBehavior,
      installTestingShim: options.installTestingShim,
    }

    // Register the client-side plugin
    addPlugin({
      src: resolver.resolve('./runtime/app/plugins/mcp-b.client'),
      mode: 'client',
    })

    // Register composables for auto-import
    addImports([
      {
        name: 'useMcpB',
        from: resolver.resolve('./runtime/app/composables/useMcpB'),
      },
      {
        name: 'useMcpTool',
        from: resolver.resolve('./runtime/app/composables/useMcpTool'),
      },
    ])
  },
})
