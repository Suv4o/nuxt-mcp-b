import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch, useTestContext } from '@nuxt/test-utils/e2e'

describe('nuxt-mcp-b', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the page', async () => {
    const html = await $fetch<string>('/')
    expect(html).toContain('<h1>Basic Fixture</h1>')
  })

  it('injects mcpB config into the page', async () => {
    const html = await $fetch<string>('/')
    // The client plugin reads from runtimeConfig, which is serialized into the page
    expect(html).toContain('mcpB')
    expect(html).toContain('autoInitialize')
  })

  it('exposes mcpB in public runtime config', async () => {
    const ctx = useTestContext()
    const runtimeConfig = ctx.nuxt!.options.runtimeConfig
    expect(runtimeConfig.public.mcpB).toBeDefined()
    expect((runtimeConfig.public.mcpB as Record<string, unknown>).autoInitialize).toBe(true)
  })

  it('sets default options correctly', async () => {
    const ctx = useTestContext()
    const mcpB = ctx.nuxt!.options.runtimeConfig.public.mcpB as Record<string, unknown>
    expect(mcpB.autoInitialize).toBe(true)
    expect(mcpB.nativeModelContextBehavior).toBe('preserve')
    expect(mcpB.installTestingShim).toBe('if-missing')
  })

  it('registers the nuxt-mcp-b module', async () => {
    const ctx = useTestContext()
    const modules = ctx.nuxt!.options._installedModules
    const moduleNames = modules.map((m: { meta?: { name?: string } }) => m.meta?.name)
    expect(moduleNames).toContain('nuxt-mcp-b')
  })
})
