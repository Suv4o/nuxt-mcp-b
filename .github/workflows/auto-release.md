---
on:
  push:
    branches: [main]
  skip-bots: [github-actions, agentic-workflows-dev]
permissions:
  contents: read
  issues: read
  pull-requests: read
  actions: read
tools:
  github:
  edit:
  bash:
    - "npm:*"
    - "node:*"
    - "cat"
    - "grep"
    - "git:*"
    - "jq"
    - "echo"
    - "ls"
    - "pwd"
runtimes:
  node:
    version: "22"
network: defaults
secrets:
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
safe-outputs:
  create-pull-request:
    title-prefix: "[Release] "
    labels: [release, automated]
    draft: false
  create-issue:
    title-prefix: "[Release Report] "
    labels: [release]
    group: true
    expires: 14
---

# Auto Release: Version Bump and npm Publish

When new commits are pushed to the `main` branch, analyse the changes and determine whether a new release is needed. If so, bump the version, publish to npm, and open a PR to persist the version change.

## Step 1: Analyse Recent Changes

Read the git log to find all commits since the last version bump. Look at the commit messages, changed files, and the nature of the modifications. Use the current `package.json` to find the current version number.

Classify the release type using **semantic versioning**:

- **Major** (e.g. `1.0.0` → `2.0.0`): Breaking changes to the public API. This includes removing or renaming exported composables (`useMcpTool`, `useMcpB`), changing the module options interface (`ModuleOptions`) in a non-backward-compatible way, removing configuration keys, or changing default behaviour that would break existing users.
- **Minor** (e.g. `1.0.0` → `1.1.0`): New features or functionality added in a backward-compatible manner. This includes adding new composables, adding new module options, adding new configuration keys, supporting new `@mcp-b/global` features, or adding new plugin capabilities.
- **Patch** (e.g. `1.0.0` → `1.0.1`): Bug fixes, documentation updates, dependency bumps, refactoring that doesn't change public API, formatting changes, or test updates.

**Important**: If the only changes are to markdown files (`.md`), configuration files like `.prettierrc`, or other non-source files that don't affect the published package, do **not** create a release. Report this via a no-op.

## Step 2: Bump the Version

Edit `package.json` and update the `"version"` field to the new version number determined in Step 1.

## Step 3: Build and Publish to npm

Run the following command to build the module and publish it to npm:

```bash
npm_token=$NPM_TOKEN npm run release
```

The `NPM_TOKEN` secret is available as the environment variable `$NPM_TOKEN`. The release script in `package.json` expects the token as `$npm_token` (lowercase), so this command bridges the two by assigning `npm_token=$NPM_TOKEN` inline.

Verify that the publish command completes successfully. If it fails, create an issue reporting the failure instead of a PR.

## Step 4: Open a PR with the Version Bump

Create a pull request that updates `package.json` with the new version number. The PR description should include:

- The new version number
- The release type (major, minor, or patch)
- A summary of the changes that triggered this release
- A link to the npm package page

## Rules

- Do NOT release if nothing meaningful changed (markdown-only changes, formatting, etc.)
- Do NOT release if the current commit message already contains `[Release]` in the title (this means it's a version bump PR being merged)
- Always start from whatever version is currently in `package.json`
- If unsure whether a change is major, minor, or patch, err on the side of caution (prefer patch over minor, minor over major)
