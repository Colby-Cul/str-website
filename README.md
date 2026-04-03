# Pineside Cabins STR Website

Production-ready React + Vite marketing site for Colby Culbertson's two Lodgify-managed properties:

- Graeagle Family Cabin (`533203`)
- Northstar Luxury Getaway (`746614`)

## Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Static deployment target: GitHub Pages

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The build runs `scripts/fetch-lodgify-data.mjs` first. It will:

- Use `LODGIFY_API_KEY` if present
- Otherwise try the macOS keychain service `lodgify-api-key`
- Fall back safely to local property content if Lodgify is unavailable

Generated API-backed data lands in `src/data/generated/lodgify.json`.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` deploys on pushes to `master`.

Required repo settings:

1. Add repository secret `LODGIFY_API_KEY` if live build-time data sync is desired.
2. In GitHub repo settings, set Pages source to `GitHub Actions`.

## Notes

- Client-side Lodgify widgets are loaded dynamically from Lodgify's hosted script.
- Hash-based routes are used so the site works cleanly on static hosting without custom rewrite rules.
- Fast.io could not be configured from this environment and should be treated as a separate external step.
