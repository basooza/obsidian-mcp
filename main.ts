import { Plugin } from 'obsidian';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import express from 'express';

const PORT = 8080;

export default class ObsidianLoomMcpPlugin extends Plugin {
  private mcpServer: McpServer;
  private expressServer: express.Express;
  
	async onload() {
    this.expressServer = express();
    this.expressServer.use(express.json());

    this.mcpServer = new McpServer({
      name: 'ObsidianLoomMcp',
      version: '1.0.0',
      description: 'ObsidianLoomMcp is an MCP server that allows interaction with Obsidian vaults.',
    });

    this.expressServer.post('/mcp', async (req: express.Request, res: express.Response) => {
      try {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
          enableJsonResponse: true
        });

        res.on('close', () => {
          transport.close();
        });

        await this.mcpServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('Error handling MCP request', error);
        res.status(500).json({
          jsonrpc: '2.0',
          error: error.message,
          id: null
        });
      }
    });

    this.mcpServer.registerTool(
      'follow-link',
      {
        title: 'Follow Link',
        description: 'Follow a link in the Obsidian vault, retrieving the content of the linked file. The sourcePath is the path to the file that contains the link, and the linkPath is the destination path of the link.',
        inputSchema: {
          sourcePath: z.string(),
          linkPath: z.string(),
        }
      },
      async ({ sourcePath, linkPath }: { sourcePath: string; linkPath: string; }) => {
        console.log(`Following link from ${sourcePath} to ${linkPath}`);
        const file = this.app.metadataCache.getFirstLinkpathDest(linkPath, sourcePath);
        console.log(`File found: ${file ? file.path : 'None'}`);
        if (!file) {
          console.error(`File not found: ${linkPath}`);
          return { content: [ { type: "text" as const, text: "File not found" } ] };
        }

        const content = await this.app.vault.cachedRead(file);
        console.log(content);

        return {
          content: [
            {
              type: "text" as const,
              text: content
            }
          ]
        };
      }
    );

    this.expressServer.listen(PORT, () => {
      console.log(`MCP Server running on http://localhost:${PORT}/mcp`);
    }).on('error', error => {
        console.error('Server error:', error);
    });
	}

	onunload() {
    this.mcpServer.close();
	}

}