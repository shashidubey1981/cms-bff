# Contentstack Node.js BFF Application

A Backend for Frontend (BFF) application built with Node.js, Express, and TypeScript for Contentstack CMS integration.

## Features

- 🚀 Express.js REST API server
- 📦 TypeScript support
- 🔌 Contentstack CMS integration
- 🎯 Entry fetching by content type
- 🌐 Multi-locale support
- 📝 JSON RTE and reference field configuration via `pageReference`
- 🏷️ Editable tags support (Live Preview)
- 🔄 Reference field inclusion (hero, teaser, navigation, footer, etc.)

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
GET /api/entries
```

**Parameters:**
- `contentTypeUid` (query, required): Content type UID
- `locale` (query, required): Locale code (e.g., `en-us`)
- `limit` (query, optional): Limit number of entries
- `queryOperator` (query, optional): Query operator (`or`)
- `filterQuery` (query, optional): JSON string for filtering

Reference fields and JSON RTE paths are configured in `src/utils/pageReference.ts` (e.g. hero, teaser, navigation, footer) and are applied when fetching entries.

**Example:**
```bash
curl "http://localhost:3000/api/entries?contentTypeUid=blog_post&locale=en-us&limit=10"
```

**With filters:**
```bash
curl "http://localhost:3000/api/entries?contentTypeUid=blog_post&locale=en-us&filterQuery={\"key\":\"title\",\"value\":\"My Post\"}"
```

## Project Structure

```
tb-node-bff-cms/
├── src/
│   ├── config/
│   │   └── index.ts               # Contentstack Stack configuration
│   ├── routes/
│   │   └── contentstack.routes.ts # API routes
│   ├── utils/
│   │   ├── index.ts               # Utility functions
│   │   ├── pageReference.ts       # Reference & JSON RTE paths for entries
│   │   └── anonimus.ts
│   ├── contentstack.ts            # Contentstack helper functions
│   └── server.ts                  # Express server setup
├── .env.example                   # Environment variables template
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

