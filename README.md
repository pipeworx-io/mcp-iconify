# mcp-iconify

MCP server for searching and retrieving icons via the [Iconify API](https://iconify.design/). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `search_icons` | Search for icons by keyword across all collections |
| `get_icons` | Retrieve SVG data for specific icons in a collection |
| `list_collections` | List all available icon collections |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "iconify_search_icons",
      "arguments": { "query": "home" }
    },
    "id": 1
  }'
```

## License

MIT
