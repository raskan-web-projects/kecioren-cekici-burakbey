# Keçiören Çekici Burak Bey

React + Vite static site for Keçiören, Ankara. The build prerenders the homepage, services, about, contact, and privacy routes to HTML.

## Local development

```sh
npm install
npm run dev
```

## Check and build

```sh
npm run typecheck
npm run build
npm test
```

## Cloudflare Workers

Workers Static Assets serves the prerendered HTML directly from the build output. Run `npm run build`, then `npm run preview` to check directory URLs and the custom 404 locally. Run `npm run deploy` from the verified main commit after CI passes.

The public address is https://kecioren-cekici-burakbey.maxdesignwebservice.workers.dev/. This hostname carries `X-Robots-Tag: noindex`. When a custom domain is connected, update `src/site.ts`, `public/robots.txt`, and `public/llms.txt` together. Keep the host-specific robots header scoped to workers.dev.

Set `VITE_GA_ID` only after the business supplies its GA4 Measurement ID. It is blank by default, so no Analytics script loads.
