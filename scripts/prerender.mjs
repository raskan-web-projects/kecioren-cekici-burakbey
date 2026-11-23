import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const template = await readFile('dist/index.html', 'utf8');
const serverPath = pathToFileURL(resolve('.build/server/entry-server.js')).href;
const { render, routes, site } = await import(serverPath);

const languageTag = 'tr-TR';
const image = site.url + '/og.png';
const imageAlt = 'Keçiören Çekici Burak Bey — oto kurtarma ve yol yardım iletişimi';
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function escape(value) {
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

function metadata(route, url) {
  const title = escape(route.title);
  const description = escape(route.description);
  const canonical = escape(url);

  return [
    '<title>' + title + '</title>',
    '<meta name="description" content="' + description + '">',
    '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="tr_TR">',
    '<meta property="og:site_name" content="' + escape(site.name) + '">',
    '<meta property="og:title" content="' + title + '">',
    '<meta property="og:description" content="' + description + '">',
    '<meta property="og:url" content="' + canonical + '">',
    '<meta property="og:image" content="' + escape(image) + '">',
    '<meta property="og:image:type" content="image/png">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="' + escape(imageAlt) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + title + '">',
    '<meta name="twitter:description" content="' + description + '">',
    '<meta name="twitter:image" content="' + escape(image) + '">',
    '<meta name="twitter:image:alt" content="' + escape(imageAlt) + '">',
    '<link rel="alternate" hreflang="' + languageTag + '" href="' + canonical + '">',
    '<link rel="alternate" hreflang="x-default" href="' + canonical + '">'
  ].join('\n    ');
}

function sitemapEntry(url) {
  const location = escape(url);
  return [
    '  <url>',
    '    <loc>' + location + '</loc>',
    '    <xhtml:link rel="alternate" hreflang="' + languageTag + '" href="' + location + '"/>',
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + location + '"/>',
    '  </url>'
  ].join('\n');
}

const entries = [];
for (const route of routes) {
  const url = site.url + route.path;
  const directory = 'dist' + route.path;
  const html = template
    .replace('<!--seo-->', () => metadata(route, url))
    .replace('<!--app-html-->', () => render(route));

  await mkdir(directory, { recursive: true });
  await writeFile(directory + 'index.html', html);
  entries.push(sitemapEntry(url));
  console.log('Prerendered ' + url);
}

await writeFile('dist/sitemap.xml', [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  '</urlset>',
  ''
].join('\n'));
