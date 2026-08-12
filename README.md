# AuraImage Plain Node.js Example

[![Images powered by AuraImage](https://img.shields.io/badge/Images%20powered%20by-AuraImage-0b0b0b?style=flat-square)](https://auraimage.ai)

A zero-dependency HTTP server that signs upload tokens for AuraImage.
Only two things installed: `@auraimage/sdk` and Node.js itself.
No Express, no Hono, no TypeScript, no build step.

---

## Prerequisites

- **Node.js** 20.6 or later — check with `node --version`
  (20.6+ is needed for the built-in `--env-file` and `--watch` flags)
- An **AuraImage account** — [sign up here](https://auraimage.ai)
- A **project** with at least one **secret key** — you'll create this in step 2

---

## Quick start

### Step 1 — Clone

```bash
git clone https://github.com/auraimage/plain-nodejs-example
cd plain-nodejs-example
```

### Step 2 — Create a project and secret key

**Option A (recommended)**: Let the CLI do everything.

```bash
npx aura init
```

It will create a project, generate a secret key, and write `.env` for you.

**Option B (manual)**: Create `.env` yourself.

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
AURAIMAGE_SECRET_KEY=sk_live_your_actual_key
AURAIMAGE_PROJECT_NAME=your_project_name
```

> **Never commit `.env`.** It's already in `.gitignore`.

### Step 3 — Install

This project has exactly **one dependency** — `@auraimage/sdk`:

```bash
npm install
```

You should see something like `added 1 package` — that's it.

### Step 4 — Start

```bash
npm run dev
```

The `dev` script uses Node.js built-in flags:
- `--watch` — auto-restarts when you change files
- `--env-file=.env` — loads environment variables from `.env`

You should see:

```
AuraImage plain Node.js example running at http://localhost:3003
```

### Step 5 — Verify

```bash
curl http://localhost:3003/api/health
```

Expected: `{ "status": "ok" }`.

---

## What if something goes wrong?

| Problem | What to check |
|---|---|
| `Error: AuraImage: secretKey is required` | `.env` is missing or wrong — redo step 2 |
| `address already in use :::3003` | Something else is on port 3003 — change `PORT` in `.env` |
| `node: bad option: --env-file` | Your Node.js is older than 20.6 — upgrade, or source `.env` manually: `export $(cat .env | xargs) && npm start` |
| Server starts but `curl` fails | Check the port — the terminal output tells you where it's listening |

---

## How it works

Every line of server code is handwritten with Node.js built-ins — no framework:

1. `node:http` — creates the HTTP server
2. Manual JSON parsing/stringifying — `JSON.parse()` / `JSON.stringify()`
3. Manual CORS headers — `res.setHeader('Access-Control-Allow-Origin', ...)`
4. Manual routing — `if (req.method === 'POST' && url.pathname === '/api/upload-token')`
5. `@auraimage/sdk` — the only dependency, used to sign HMAC upload tokens

The entire server is ~60 lines of JavaScript. Read `src/server.js` — you'll
understand every line.

---

## API reference

### `GET /api/health`

Returns `{ "status": "ok" }`.

### `POST /api/upload-token`

**Response:**

```json
{
  "token": "eyJwcm9qZWN0TmFtZSI6ImRlbW8...",
  "cdnUrl": "https://cdn.auraimage.ai"
}
```

---

## Project structure

```
plain-nodejs-example/
├── .env.example          # Template — copy to .env with your keys
├── package.json          # One dependency: @auraimage/sdk
├── LICENSE
├── README.md
└── src/
    └── server.js         # ~60 lines: routing, CORS, JSON — all manual
```

---

## Links

- [AuraImage docs](https://auraimage.ai/docs)
- [Dashboard](https://app.auraimage.ai)
- [@auraimage/sdk on npm](https://www.npmjs.com/package/@auraimage/sdk)

---

Images powered by [AuraImage](https://auraimage.ai) — the image CDN that
installs itself. Set it up in any project with `npx aura init`, or from your
AI agent with [Agent Skills](https://github.com/auraimage/skills) and the
[MCP server](https://github.com/auraimage/mcp-server).

### Contributing

This repository is generated from the AuraImage monorepo, so pull requests
opened here are overwritten on the next sync. Please
[open an issue](https://github.com/auraimage/skills/issues) instead — bugs
in this example are fixed upstream and mirrored back within minutes.
