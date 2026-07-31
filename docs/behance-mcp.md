# Behance MCP — Installation & Validation

Portfolio content source MCP for [Sugandha Saxena’s Behance](https://www.behance.net/saxenasugu7614).

Upstream: [Arnonfr/behance-mcp-server](https://github.com/Arnonfr/behance-mcp-server) (v1.0.0)

## What this is

A local **stdio MCP server** that scrapes Behance with Puppeteer (no Behance API key). Cursor launches it via [`.cursor/mcp.json`](../.cursor/mcp.json) and exposes tools the agent can call.

## Installation (already done on this machine)

```powershell
mkdir C:\suggu\tools -Force
git clone https://github.com/Arnonfr/behance-mcp-server.git C:\suggu\tools\behance-mcp-server
cd C:\suggu\tools\behance-mcp-server
$env:PUPPETEER_SKIP_DOWNLOAD = "true"
npm install
npm run build
```

### Why `PUPPETEER_SKIP_DOWNLOAD`?

Bundled Chromium download hung on this Windows machine. The server is configured to use **system Google Chrome** instead:

`C:\Program Files\Google\Chrome\Application\chrome.exe`

Local patch in `src/scraper.ts`:

- Reads `PUPPETEER_EXECUTABLE_PATH`
- Falls back to that Chrome path on Windows
- Uses resilient selectors (`a[href*="/gallery/"]`, `h1`, meta tags) because Behance’s hashed CSS class names change often

Rebuild after scraper changes:

```powershell
cd C:\suggu\tools\behance-mcp-server
npm run build
```

## Cursor configuration

Project file: [`.cursor/mcp.json`](../.cursor/mcp.json)

```json
{
  "mcpServers": {
    "behance": {
      "command": "node",
      "args": ["C:\\suggu\\tools\\behance-mcp-server\\dist\\index.js"],
      "env": {
        "PUPPETEER_EXECUTABLE_PATH": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      }
    }
  }
}
```

**No API keys / no secrets required.**

### How to restart / reload the MCP

1. Save `.cursor/mcp.json`
2. Open **Cursor Settings → MCP** (or Features → MCP)
3. Confirm `behance` appears and is enabled
4. If it does not load: **Developer: Reload Window** or fully restart Cursor
5. In chat, tools should appear under server id `behance`

## Dependencies

| Dependency                  | Notes                                                     |
| --------------------------- | --------------------------------------------------------- |
| Node.js 18+                 | Validated on Node 25.2.1                                  |
| npm                         | Comes with Node                                           |
| Google Chrome               | Used as Puppeteer browser                                 |
| `@modelcontextprotocol/sdk` | MCP protocol                                              |
| `puppeteer`                 | Browser automation                                        |
| `cheerio`                   | Present upstream; current scraper prefers `page.evaluate` |

## How Cursor talks to the MCP

1. Cursor reads `.cursor/mcp.json`
2. Spawns `node …\dist\index.js` as a child process
3. Communicates over **stdio** (JSON-RPC style MCP messages)
4. Agent discovers tools via MCP `ListTools`, then calls them via `CallTool`
5. Each tool call opens a headless Chrome session against behance.net

## Available tools

| Tool                          | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `search_behance_projects`     | Search projects by keyword                   |
| `get_behance_project_details` | Project description, images, tags, tools     |
| `search_behance_profiles`     | Search user profiles                         |
| `get_behance_profile_details` | Profile bio/occupation/location/projects     |
| `search_behance_images`       | Search images (falls back to project covers) |
| `get_behance_jobs`            | Job list smoke scrape                        |
| `get_behance_job_details`     | Job page text/description                    |

## How to test

### A) Cursor MCP tools (after reload)

Ask the agent to call e.g. `get_behance_profile_details` with:

`https://www.behance.net/saxenasugu7614`

### B) Offline validation script (does not need Cursor reload)

```powershell
cd C:\suggu\Portfolio
$env:PUPPETEER_EXECUTABLE_PATH = "C:\Program Files\Google\Chrome\Application\chrome.exe"
node scripts/validate-behance-mcp.mjs
```

Writes results to [`docs/behance-mcp-validation.json`](behance-mcp-validation.json).

## Validation results (2026-07-31)

All tools exercised via the same scraper used by the MCP:

| Tool                        | Status | Latency |
| --------------------------- | ------ | ------- |
| get_behance_profile_details | OK     | ~10s    |
| search_behance_profiles     | OK     | ~9s     |
| search_behance_projects     | OK     | ~10s    |
| search_behance_images       | OK     | ~12s    |
| get_behance_jobs            | OK     | ~9s     |
| get_behance_project_details | OK     | ~9s     |
| get_behance_job_details     | OK     | ~7s     |

Profile check confirmed:

- Display name: **Sugandha Saxena**
- Occupation: **Sr. Creative Designer**
- Location: **Noida, India**
- Project count discovered: **12** gallery URLs

## Troubleshooting

| Symptom                  | Fix                                                    |
| ------------------------ | ------------------------------------------------------ |
| MCP not listed in Cursor | Reload window; verify `.cursor/mcp.json` path          |
| `Could not find Chrome`  | Install Chrome or set `PUPPETEER_EXECUTABLE_PATH`      |
| Selector timeouts        | Behance DOM changed — update `src/scraper.ts`, rebuild |
| Slow / flaky results     | Reduce `maxItems`; retry; Behance may rate-limit       |
| npm install hangs        | Use `PUPPETEER_SKIP_DOWNLOAD=true` then system Chrome  |

## Limitations

- **Scraping, not official API** — brittle when Behance redesigns
- **Videos / motion modules** — not reliably extracted (image modules work better)
- **Stats** (followers/views) often unavailable without authenticated/deeper parsing
- **Social links** on profile pages may include Behance chrome links; filter carefully
- **Jobs** page structure is sparse; results may be partial
- **Runtime** — each call launches Chrome (~5–15s)
- **Cursor discovery** — requires MCP reload after first install; until then tools won’t show in `GetMcpTools`
- Server lives **outside** the Next.js repo at `C:\suggu\tools\behance-mcp-server`

## Future import layout (not built yet)

```
content/
  profile.json
  projects/
    <slug>/
      metadata.json
      description.md
      images/
      assets/
scripts/   # importer will land here later
docs/
```

Do not populate fake content until a real import pass.

## Manual steps for you

1. **Reload Cursor** (or toggle the `behance` MCP) so the agent can call tools natively
2. Confirm Chrome stays installed at the configured path
3. When ready for Phase 2 content import, ask to build the importer that writes into `content/projects/<slug>/`
