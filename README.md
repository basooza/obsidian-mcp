# Obsidian MCP

An MCP server that provides utilities for working with an Obsidian vault. Implemented as a plugin such that it has native access to Obsidian's plugin API.

# Usage

For a production build, use `npm run build`. For development use `npm run dev`, which will rebuild on file updates. However new versions won't be propagated to Obsidian automatically without the Hot Reload plugin.

The MCP server runs when Obsidian starts up or the plugin is enabled.

# Agent Configuration

```json
  "mcpServers": {
    "obsidian-mcp": {
      "type": "http",
      "url": "http://localhost:8080/mcp"
    }
  }
```