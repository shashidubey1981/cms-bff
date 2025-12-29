# Contentstack Node.js BFF Application

A Backend for Frontend (BFF) application built with Node.js, Express, and TypeScript for Contentstack CMS integration.

## Features

- 🚀 Express.js REST API server
- 📦 TypeScript support
- 🔌 Contentstack CMS integration
- 🎯 Entry fetching by content type
- 🔍 Entry fetching by URL
- 🌐 Multi-locale support
- 📝 JSON RTE to HTML conversion
- 🏷️ Editable tags support (Live Preview)
- 🔄 Reference field inclusion
- 🎨 Personalization support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Contentstack account with API credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tb-node-bff-cms
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Contentstack credentials:
```env
CONTENTSTACK_API_KEY=your_api_key_here
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
CONTENTSTACK_ENVIRONMENT=your_environment_here
CONTENTSTACK_PREVIEW_TOKEN=your_preview_token_here (optional)
CONTENTSTACK_PREVIEW_HOST=your_preview_host_here (optional)
CONTENTSTACK_LIVE_PREVIEW=false (optional)
PORT=3000
```

## Development

Run the development server with hot-reload:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Run the production server:
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status.

### Get Entries
```
GET /api/contentstack/entries/:contentTypeUid
```

**Parameters:**
- `contentTypeUid` (path): Content type UID
- `locale` (query, required): Locale code (e.g., `en-us`)
- `referenceFieldPath` (query, optional): Comma-separated reference field paths
- `jsonRtePath` (query, optional): Comma-separated JSON RTE field paths
- `limit` (query, optional): Limit number of entries
- `queryOperator` (query, optional): Query operator (`or`)
- `filterQuery` (query, optional): JSON string for filtering

**Example:**
```bash
curl "http://localhost:3000/api/entries/blog_post?locale=en-us&limit=10"
```

**With filters:**
```bash
curl "http://localhost:3000/api/entries/blog_post?locale=en-us&filterQuery={\"key\":\"title\",\"value\":\"My Post\"}"
```

### Get Entry by URL
```
GET /api/entry/:contentTypeUid
```

**Parameters:**
- `contentTypeUid` (path): Content type UID
- `locale` (query, required): Locale code
- `entryUrl` (query, required): Entry URL
- `referenceFieldPath` (query, optional): Comma-separated reference field paths
- `jsonRtePath` (query, optional): Comma-separated JSON RTE field paths

**Example:**
```bash
curl "http://localhost:3000/api/entry/blog_post?locale=en-us&entryUrl=/blog/my-post"
```

### Get Personalization SDK Instance
```
GET /api/personalize-sdk
```

Initialize and return personalization SDK instance for MFE (Micro Frontend).

**Parameters:**
- `projectUid` (query, required): Contentstack Personalize project UID
- `userAttributes` (query, optional): JSON string of user attributes for personalization

**Example:**
```bash
# Basic request
curl "http://localhost:3000/api/personalize-sdk?projectUid=your_project_uid"

# With user attributes
curl "http://localhost:3000/api/personalize-sdk?projectUid=your_project_uid&userAttributes={\"age\":30,\"location\":\"US\"}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "variantAliases": ["variant1", "variant2"],
    "experiences": [...],
    "variantIds": "variant1,variant2",
    "sdkInitialized": true,
    "projectUid": "your_project_uid",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "personalizeSdk": {
    "initialized": true,
    "variantAliases": ["variant1", "variant2"],
    "experiences": [...],
    "variantIds": "variant1,variant2"
  }
}
```

**Note:** The SDK instance is initialized server-side. The response includes all serializable data (variant aliases, experiences) that the client needs for personalization.

## Project Structure

```
tb-node-bff-cms/
├── src/
│   ├── config/
│   │   └── index.ts          # Contentstack Stack configuration
│   ├── routes/
│   │   └── contentstack.routes.ts  # API routes
│   ├── utils/
│   │   ├── index.ts          # Utility functions
│   │   └── personalization.ts # Personalization SDK utilities
│   ├── contentstack.ts       # Contentstack helper functions
│   └── server.ts             # Express server setup
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing/invalid parameters)
- `404`: Not Found (entry/entries not found)
- `500`: Internal Server Error

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTENTSTACK_API_KEY` | Yes | Contentstack API key |
| `CONTENTSTACK_DELIVERY_TOKEN` | Yes | Contentstack delivery token |
| `CONTENTSTACK_ENVIRONMENT` | Yes | Contentstack environment |
| `CONTENTSTACK_PREVIEW_TOKEN` | No | Preview token for preview mode |
| `CONTENTSTACK_PREVIEW_HOST` | No | Preview host URL |
| `CONTENTSTACK_LIVE_PREVIEW` | No | Enable live preview (true/false) |
| `PORT` | No | Server port (default: 3000) |

## License

ISC

