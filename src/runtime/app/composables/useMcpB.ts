import { initializeWebModelContext, cleanupWebModelContext } from '@mcp-b/global'
import type { WebModelContextInitOptions } from '@mcp-b/global'

/**
 * Composable providing direct access to @mcp-b/global initialization functions.
 *
 * Use this when you need manual control over the Web Model Context lifecycle.
 *
 * @example
 * ```vue
 * <script setup>
 * const { initialize, cleanup } = useMcpB()
 *
 * // Re-initialize with custom options
 * initialize({ transport: { tabServer: { allowedOrigins: ['https://example.com'] } } })
 *
 * // Clean up when done
 * onUnmounted(() => cleanup())
 * </script>
 * ```
 */
export function useMcpB() {
  return {
    /**
     * Initialize or re-initialize the Web Model Context.
     * No-op if already initialized.
     */
    initialize: (options?: WebModelContextInitOptions) => initializeWebModelContext(options),

    /**
     * Tear down the adapter and restore navigator.modelContext to its original state.
     */
    cleanup: () => cleanupWebModelContext(),
  }
}
