# mcp-iconify

Iconify MCP — wraps the Iconify public API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_icons` | Search for icons by keyword across all collections. Returns icon names in prefix:name format (e.g., "mdi:home"). Use get_icons to fetch SVG data for results. |
| `get_icons` | Get SVG code and dimensions for specific icons. Input icon names in prefix:name format (e.g., "mdi:home", "fa:star"). Returns SVG markup, width, and height. |
| `list_collections` | Browse available icon collections. Returns prefix, name, icon count, author, license, and category. Use the prefix with search_icons or get_icons. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "iconify": {
      "url": "https://gateway.pipeworx.io/iconify/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Iconify data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
