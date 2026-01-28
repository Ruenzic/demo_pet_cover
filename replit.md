# Example Pet Cover - AI Agent Instructions

## CRITICAL: Read This First

**Before answering ANY question about code, schemas, or configuration:**

1. Run `npm run sync-docs` to fetch the latest documentation from the API
2. Read the relevant doc file from the `docs/` folder for your task
3. Then provide your answer

This is your **quick reference**. For detailed guides, see the `docs/` folder.

---

## Getting Started

1. Click **Run** to start the embed preview server
2. Use `npx @rootplatform/cli <command>` for CLI operations

---

## CLI Commands (Quick Reference)

| Command | Description |
|---------|-------------|
| `npx @rootplatform/cli push -f` | Push changes to draft (**ALWAYS use -f**) |
| `npx @rootplatform/cli test` | Run unit tests |
| `npx @rootplatform/cli publish` | Publish draft to live |
| `node preview/server.js` | Start embed preview |

---

## Key Rules (MUST FOLLOW)

1. **No import/export statements** - All functions are available globally
2. **Always update .root-config.json** - When adding alteration hooks, scheduled functions, or fulfillment types
3. **Ask before pushing** - ALWAYS confirm with user before running push commands
4. **Always use -f flag** - Use `npx @rootplatform/cli push -f` to force overwrite
5. **Validate all inputs** - Use Joi validation schemas
6. **Check docs/ folder** - For detailed schema and code guides

---

## IMPORTANT: Ask Before Pushing

**After making changes, ALWAYS ask the user before running push commands.**

Example:
> "I've updated the configuration. Would you like me to push these changes? I'll run `npx @rootplatform/cli push -f`."

---

## Project Structure

| Folder/File | Purpose |
|-------------|---------|
| `code/` | Product module JavaScript (NO import/export) |
| `workflows/` | JSON schemas (quote, application, claims) |
| `workflows/alteration-hooks/` | Alteration hook schemas |
| `documents/` | HTML templates for policy documents |
| `.root-config.json` | Product module configuration |
| `docs/` | **Detailed reference guides** |

---

## After Pushing Changes

### For Embed Changes → Open Embed Preview:
```
https://app.embedroot.com/demo_pet_cover?api_key=sandbox_ZWY3M2Y4OWEtY2EzOS00YjZlLWJkODEtM2Q0MGU0MzU5ZWE2LldZTFg3VFd6V0l1MWJ6ZWtZSWdZazNpd2pPSHpZMWZY&draft_definition=true
```

### For All Other Changes → Open Platform Dashboard:
```
https://app.rootplatform.com/orgs/11d99a52-703f-4750-8c9d-44ecfa4cbf38/insurance/policies?view=all-policies
```

---

## Detailed Documentation (docs/ folder)

| File | When to Use |
|------|-------------|
| `docs/configuration-guide.md` | Updating .root-config.json |
| `docs/product-module-code.md` | Writing hooks and code |
| `docs/root-sdk.md` | Using the root SDK (for API access) |
| `docs/schema-form.md` | Building quote & application schemas |
| `docs/claim-blocks.md` | Configuring claim workflows |
| `docs/workbench-cli.md` | CLI command reference |
| `docs/embed-config.md` | Configuring embed styles |

**When working on a specific task, read the relevant doc file for complete reference.**

**IMPORTANT**: Documentation files in `docs/` are fetched from the API. Run `npm run sync-docs` to update them.
