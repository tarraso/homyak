# taras.rocks

A minimal, cinematic personal site for Taras Volchenko — photographer and
developer in Tbilisi. Static, dark, intentionally quiet.

## Stack

- [Astro 5](https://astro.build) — static, zero-JS by default
- [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite`
- Self-hosted [Fraunces](https://fonts.google.com/specimen/Fraunces) +
  [Inter](https://rsms.me/inter/) via Fontsource
- No animation libraries, no React, no client framework

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # serves ./dist locally
```

Node 20+ (see `.nvmrc`).

## Adding photos

Two folders are involved:

- `photos-source/` — your originals (full-resolution JPEG/PNG, off any size).
  Gitignored. Back these up separately; the repo isn't their home.
- `public/photos/` — compressed JPEGs that actually ship to the browser.
  Generated; do not edit by hand.

Workflow:

```bash
# drop originals into photos-source/, then
npm run photos
```

The script resizes each original to a max 2400 px long edge, encodes with
mozjpeg at quality 82 (typically ~400-700 KB per photo), and prints
ready-to-paste TypeScript entries to stdout. Copy the entries into
`src/data/photos.ts`, then:

- Edit each `alt` string — describe what's in the frame (one short
  sentence). This matters for screen readers and SEO.
- Move `hero: true` to whichever photo you want as the fullscreen landing
  image (exactly one).
- Reorder lines to control grid order. First three load eagerly; rest lazy.
- Add optional `place` / `year` to surface captions under the photo.

Re-runs are incremental — only touched/new files are re-encoded. Pass
`--force` to re-encode everything.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
Node 20 and publishes `./dist` to GitHub Pages. The custom domain
`taras.rocks` is preserved across deploys via `public/CNAME`.

DNS (one-time setup on your registrar):

- `A` records at apex → GitHub Pages IPs (185.199.108.153,
  185.199.109.153, 185.199.110.153, 185.199.111.153)
- `AAAA` records at apex → 2606:50c0:8000::153, 2606:50c0:8001::153,
  2606:50c0:8002::153, 2606:50c0:8003::153
- Repo Settings → Pages → Source: **GitHub Actions**, Custom domain:
  `taras.rocks`, Enforce HTTPS: on.

## Image credits

Placeholder photography in `src/data/photos.ts` is sourced from Unsplash
under the [Unsplash License](https://unsplash.com/license). Replace with
your own work before going public if you'd prefer no attribution overhead.
