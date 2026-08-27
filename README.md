# Portfolio 2026

Personal portfolio for Sebastian Mendo — Next.js 16, React 19, Vercel Blob CMS.

## Requirements

- Node.js 20+
- npm 10+

## Environment variables

Set these in Vercel (Production + Preview) and in `.env.local` for local dev:

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_SECRET` | Yes (prod) | Strong password for `/admin` CMS login |
| `BLOB_READ_WRITE_TOKEN` | Yes (prod) | Vercel Blob token for CMS + media |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL, e.g. `https://your-domain.vercel.app` |

If `NEXT_PUBLIC_SITE_URL` is unset, the app falls back to `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL`.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Media pipeline

- **Static images/logos:** `public/assets/` (committed PNG/WebP/SVG)
- **Videos/audio:** Vercel Blob CDN — URLs in `src/data/assets.ts`
- **Upload to Blob:** `export $(grep -v '^#' .env.local | xargs) && npx tsx scripts/upload-assets.ts`
- **Normalize logos:** `bash scripts/normalize-logos.sh`

After transcoding or adding media locally, re-run the upload script and update `src/data/assets.ts` if URLs change.

## CMS

- Admin UI: `/admin/login`
- Protected by `src/proxy.ts` (session cookie) + server-action auth in `src/lib/admin-auth.ts`
- CMS data stored at `cms/projects.json` on Vercel Blob

## Deploy (Vercel)

1. Link repo to Vercel
2. Set env vars above
3. Deploy — `next build` runs automatically
4. Upload Chase MP4 to Blob if not yet deployed: `npx tsx scripts/upload-assets.ts`
5. Optionally set custom domain and update `NEXT_PUBLIC_SITE_URL`

## Launch checklist

- [ ] `npm run build` and `npm run lint` pass
- [ ] `ADMIN_SECRET` and `BLOB_READ_WRITE_TOKEN` set on Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live domain (canonicals + absolute URLs correct)
- [ ] `/sitemap.xml` and `/robots.txt` reachable
- [ ] `/llms.txt`, `/llms-full.txt`, `/content.json`, `/.well-known/ai.txt` return 200 with correct `Content-Type` in production
- [ ] Homepage HTML (view-source, no JS) includes an `h1` and 500+ characters of text
- [ ] `curl -s -o /dev/null -w "%{http_code}" https://DOMAIN/some-path-that-does-not-exist` prints `404` and the body mentions `llms.txt` / sitemap
- [ ] `curl -sI -H "Accept: text/markdown" https://DOMAIN/` returns `Content-Type: text/markdown` and `Vary` includes `Accept`
- [ ] `/content.json` includes `shippedWork`, `person.aboutIntro`, and project `media` (schema v3.0)
- [ ] `/work/{slug}/content.json` returns per-project JSON
- [ ] Google [Rich Results Test](https://search.google.com/test/rich-results) passes for home + one case study
- [ ] JSON-LD validates at [validator.schema.org](https://validator.schema.org/)
- [ ] View-source of a case study shows full beat text (SSR crawlable corpus present)
- [ ] `robots.txt` shows intended AI-bot policy
- [ ] `/admin` redirects to login when unauthenticated
- [ ] Case studies scroll fully on mobile (≤900px)

### Post-deploy smoke tests

Replace `DOMAIN` with your production URL:

```bash
curl -s https://DOMAIN/.well-known/ai.txt
curl -s https://DOMAIN/llms.txt | head -40
curl -s https://DOMAIN/llms-full.txt | wc -l
curl -sI https://DOMAIN/content.json | grep -i content-type
curl -s https://DOMAIN/content.json | jq '.version, (.projects|length), (.shippedWork|length)'
curl -s https://DOMAIN/work/casey-ai/content.json | jq '.project.title'
curl -s https://DOMAIN/robots.txt
curl -sI -H "Accept: text/markdown" https://DOMAIN/ | grep -iE 'content-type|vary'
curl -s -o /dev/null -w "%{http_code}\n" https://DOMAIN/some-path-that-does-not-exist
curl -s -H "Accept: text/markdown" https://DOMAIN/some-path-that-does-not-exist | head -20
```
