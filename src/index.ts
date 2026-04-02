/**
 * Iconify MCP — wraps the Iconify public API (free, no auth)
 *
 * Tools:
 * - search_icons: Search for icons by keyword across all collections
 * - get_icons: Retrieve SVG data for specific icons in a collection
 * - list_collections: List all available icon collections
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://api.iconify.design';

// --- Raw API types ---

type SearchResponse = {
  icons: string[];
  total: number;
  limit: number;
  start: number;
};

type IconsResponse = {
  prefix: string;
  icons: Record<string, { body: string; width?: number; height?: number }>;
  width?: number;
  height?: number;
};

type CollectionMeta = {
  name: string;
  total: number;
  author?: { name: string; url?: string };
  license?: { title: string; spdx?: string; url?: string };
  category?: string;
  tags?: string[];
};

// --- Tool definitions ---

const tools: McpToolExport['tools'] = [
  {
    name: 'search_icons',
    description:
      'Search for icons by keyword across all Iconify collections. Returns icon names in "prefix:name" format (e.g., "mdi:home").',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keyword (e.g., "home", "arrow", "user")' },
        limit: {
          type: 'number',
          description: 'Maximum number of results (1-999, default 32)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_icons',
    description:
      'Retrieve SVG body data for one or more icons in a specific collection. Returns SVG body, width, and height for each icon.',
    inputSchema: {
      type: 'object',
      properties: {
        prefix: {
          type: 'string',
          description: 'Collection prefix (e.g., "mdi", "fa", "heroicons", "lucide")',
        },
        icons: {
          type: 'string',
          description: 'Comma-separated icon names within the collection (e.g., "home,arrow-left,user")',
        },
      },
      required: ['prefix', 'icons'],
    },
  },
  {
    name: 'list_collections',
    description:
      'List all available icon collections in Iconify. Returns collection prefix, name, total icon count, author, license, and category.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

// --- callTool dispatcher ---

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_icons':
      return searchIcons(args.query as string, (args.limit as number) ?? 32);
    case 'get_icons':
      return getIcons(args.prefix as string, args.icons as string);
    case 'list_collections':
      return listCollections();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// --- Tool implementations ---

async function searchIcons(query: string, limit: number) {
  const params = new URLSearchParams({
    query,
    limit: String(Math.min(999, Math.max(1, limit))),
  });

  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error(`Iconify error: ${res.status}`);

  const data = (await res.json()) as SearchResponse;

  return {
    total: data.total,
    icons: data.icons,
  };
}

async function getIcons(prefix: string, icons: string) {
  const params = new URLSearchParams({ icons });
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(prefix)}.json?${params}`);
  if (!res.ok) throw new Error(`Iconify error: ${res.status}`);

  const data = (await res.json()) as IconsResponse;

  const defaultWidth = data.width ?? 24;
  const defaultHeight = data.height ?? 24;

  return {
    prefix: data.prefix,
    icons: Object.entries(data.icons).map(([name, icon]) => ({
      name,
      full_name: `${data.prefix}:${name}`,
      svg_body: icon.body,
      width: icon.width ?? defaultWidth,
      height: icon.height ?? defaultHeight,
    })),
  };
}

async function listCollections() {
  const res = await fetch(`${BASE_URL}/collections`);
  if (!res.ok) throw new Error(`Iconify error: ${res.status}`);

  const data = (await res.json()) as Record<string, CollectionMeta>;

  return {
    total: Object.keys(data).length,
    collections: Object.entries(data).map(([prefix, meta]) => ({
      prefix,
      name: meta.name,
      total_icons: meta.total,
      category: meta.category ?? null,
      author: meta.author?.name ?? null,
      license: meta.license?.title ?? null,
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
