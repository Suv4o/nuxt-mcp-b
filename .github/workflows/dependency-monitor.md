---
on:
  schedule:
    - cron: "0 9 1 * *"
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
tools:
  github:
  edit:
  bash:
    - "npm:*"
    - "node:*"
    - "cat"
    - "grep"
    - "jq"
    - "echo"
    - "ls"
    - "pwd"
    - "diff"
    - "git:*"
  web-fetch:
runtimes:
  node:
    version: "22"
network: defaults
safe-outputs:
  create-pull-request:
    title-prefix: "[Dependency Update] "
    labels: [dependencies, automated]
    reviewers: [Suv4o]
    draft: false
  create-issue:
    title-prefix: "[Dependency Monitor] "
    labels: [dependencies, review-needed]
    group: true
    expires: 30
---

# Monthly Dependency Monitor for @mcp-b/global

This workflow runs once a month to check whether the upstream `@mcp-b/global` package has released new features, breaking changes, or updates that our `nuxt-mcp-b` module needs to accommodate.

## Step 1: Gather Current State

Read our project's `package.json` to find the current `@mcp-b/global` version constraint. Also read our source files to understand what we currently wrap:

- `src/module.ts` — module options and setup
- `src/runtime/app/plugins/mcp-b.client.ts` — initialisation plugin
- `src/runtime/app/composables/useMcpTool.ts` — tool registration composable
- `src/runtime/app/composables/useMcpB.ts` — manual lifecycle composable

## Step 2: Check Upstream Sources

Fetch and analyse the following upstream resources:

1. **npm package page**: `https://www.npmjs.com/package/@mcp-b/global?activeTab=readme`
   - Check the latest published version number
   - Read the README for any new API changes, new exports, or deprecation notices

2. **GitHub repository main branch**: `https://github.com/WebMCP-org/npm-packages`
   - Look at recent commits and merged PRs in the `packages/global/` directory
   - Identify new features, bug fixes, or breaking changes

3. **Changelog**: `https://github.com/WebMCP-org/npm-packages/blob/main/packages/global/CHANGELOG.md`
   - Read the changelog entries since our currently pinned version
   - Identify breaking changes, new features, deprecations, and bug fixes

4. **Documentation**:
   - `https://docs.mcp-b.ai/packages/global/overview` — check for new concepts or API changes
   - `https://docs.mcp-b.ai/packages/global/reference` — check for new exports, new options, changed signatures

## Step 3: Compare and Analyse

Compare the upstream state with our current implementation. Look for:

- **New exports** from `@mcp-b/global` that we should expose through new composables or plugin options
- **Changed function signatures** in `initializeWebModelContext` or `cleanupWebModelContext` that we need to update
- **New configuration options** (e.g. new transport types, new behaviour flags) that should be added to our `ModuleOptions` interface
- **Deprecated features** that we currently use and need to migrate away from
- **Breaking changes** that require updates to our module code
- **Version bumps** where our `package.json` dependency constraint needs updating
- **New TypeScript types** that we should re-export or use

## Step 4: Take Action

Based on the analysis:

### If code changes are needed:

Create a **pull request** with the necessary updates. The PR should include:

- Updated `package.json` with the new `@mcp-b/global` version constraint if needed
- Updated source files (`module.ts`, plugin, composables) to accommodate API changes
- A clear description of what changed upstream and what was updated in our module

The PR description should have:
- A summary of upstream changes detected
- A list of files modified and why
- Any manual testing steps the reviewer should follow
- Links to the relevant upstream changelog entries or documentation

### If no code changes are needed but there is a new version:

Create an **issue** documenting the findings:

- What the latest upstream version is
- What changed (from the changelog)
- Why no code changes are needed on our side (e.g. the changes are internal to `@mcp-b/global` and don't affect our public API)

### If nothing has changed:

Report via no-op. No issue or PR needed.

## Important Notes

- Always be conservative with changes. If unsure whether a change is needed, create an issue for manual review rather than a PR with speculative changes
- Do not bump our module's own version number — that is handled by the auto-release workflow
- Focus on the `packages/global/` directory in the upstream repo — other packages in the monorepo are not relevant
- When updating TypeScript interfaces, ensure backward compatibility where possible
