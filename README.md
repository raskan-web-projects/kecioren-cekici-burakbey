# Keçiören Çekici Burak Bey

React + Vite static site for Keçiören, Ankara. The build prerenders the homepage to HTML for search and social crawlers.

## Local development

```sh
npm install
npm run dev
```

## Check and build

```sh
npm run typecheck
npm test
npm run build
```

## Cloudflare Pages

Deploy the `dist/` output as a Cloudflare Pages project named `kecioren-cekici-burakbey`. The temporary `pages.dev` hostname carries `X-Robots-Tag: noindex`; update `src/site.ts`, `public/robots.txt`, and the host-specific rule in `public/_headers` when a custom domain is connected.

Set `VITE_GA_ID` only after the business supplies its GA4 Measurement ID. It is blank by default, so no Analytics script loads.
