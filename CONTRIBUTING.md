# Contributing

Thanks for your interest in contributing to `nuxt-mcp-b`!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/user/nuxt-mcp-b.git
cd nuxt-mcp-b

# Install dependencies
npm install

# Prepare the module (stub build + generate types)
npm run dev:prepare

# Start the playground dev server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:prepare` | Stub build + generate types for local development |
| `npm run dev` | Start the playground dev server |
| `npm run dev:build` | Build the playground for production |
| `npm run prepack` | Full production build of the module |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint the codebase |

## Project Structure

```
nuxt-mcp-b/
├── src/
│   ├── module.ts                         # Module definition (defineNuxtModule)
│   ├── types.ts                          # Exported types
│   └── runtime/
│       └── app/
│           ├── plugins/
│           │   └── mcp-b.client.ts       # Client-only plugin
│           └── composables/
│               ├── useMcpB.ts            # Manual init/cleanup composable
│               └── useMcpTool.ts         # Tool registration composable
├── playground/                           # Dev playground (Nuxt app)
│   ├── nuxt.config.ts
│   └── app.vue
├── test/
│   ├── module.test.ts                    # Module tests
│   └── fixtures/basic/                   # Test fixture
├── package.json
└── tsconfig.json
```

## Workflow

1. Run `npm run dev:prepare` to set up the stub build (only needed once, or after changing `src/module.ts`)
2. Run `npm run dev` to start the playground — changes in `src/runtime/` are reflected immediately
3. Write or update tests in `test/`
4. Run `npm run test` to verify everything passes
5. Run `npm run prepack` to verify the production build succeeds
