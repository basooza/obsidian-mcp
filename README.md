# Obsidian MCP

An MCP server that provides utilities for working with an Obsidian vault. Implemented as a plugin such that it has native access to Obsidian's plugin API. Started automatically when Obsidian is opened.

## Agent Configuration

```json
  "mcpServers": {
    "obsidian-mcp": {
      "type": "http",
      "url": "http://localhost:8080/mcp"
    }
  }
```