import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const template = await readFile('dist/index.html', 'utf8');
const serverPath = pathToFileURL(resolve('.build/server/entry-server.js')).href;
const { render, site, pageTitle, description } = await import(serverPath);
const html = template
  .replace('<!--seo-->', `<title>${pageTitle}</title><meta name="description" content="${description}"><link rel="canonical" href="${site.url}/"><meta property="og:type" content="website"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="${site.name}"><meta property="og:title" content="${pageTitle}"><meta property="og:description" content="${description}"><meta property="og:url" content="${site.url}/"><meta property="og:image" content="${site.url}/og.svg"><meta property="og:image:type" content="image/svg+xml"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Keçiören Çekici Burak Bey — oto kurtarma ve yol yardım iletişimi"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${pageTitle}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${site.url}/og.svg"><meta name="twitter:image:alt" content="Keçiören Çekici Burak Bey — oto kurtarma ve yol yardım iletişimi"><link rel="alternate" hreflang="tr-TR" href="${site.url}/"><link rel="alternate" hreflang="x-default" href="${site.url}/">`)
  .replace('<!--app-html-->', render());
await writeFile('dist/index.html', html);
await mkdir('dist', { recursive: true });
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"><url><loc>${site.url}/</loc><xhtml:link rel="alternate" hreflang="tr-TR" href="${site.url}/"/><xhtml:link rel="alternate" hreflang="x-default" href="${site.url}/"/></url></urlset>`);
console.log(`Prerendered ${site.url}/`);
