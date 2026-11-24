import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const base = 'https://kecioren-cekici-burakbey.maxdesignwebservice.workers.dev';
const paths = ['/', '/hizmetler/', '/neden-biz/', '/iletisim/', '/gizlilik/'];
const pages = new Map(await Promise.all(paths.map(async (path) => [path, await readFile('dist' + path + 'index.html', 'utf8')])));
const getSchema = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];

test('every route has unique static metadata, one visible H1, and matching canonical and hreflang', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [path, html] of pages) {
    assert.match(html, /<html lang="tr">/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
    assert.match(html, /<main id="main-content">/);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title && title.length >= 48 && title.length <= 60, path);
    assert.ok(description && description.length >= 138 && description.length <= 165, path);
    titles.add(title);
    descriptions.add(description);
    for (const marker of ['rel="canonical" href', 'hreflang="tr-TR" href', 'hreflang="x-default" href', 'property="og:url" content']) {
      assert.ok(html.includes(marker + '="' + base + path + '"'), path + ' ' + marker);
    }
    assert.match(html, /property="og:image:width" content="1200"/);
    assert.match(html, /property="og:image:height" content="630"/);
    assert.match(html, /name="twitter:image" content="[^"]+\/og\.png"/);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
    assert.doesNotMatch(html, /class="consent-banner"/);
  }
  assert.equal(titles.size, paths.length);
  assert.equal(descriptions.size, paths.length);
});

test('all internal page links and fragments resolve in the output', () => {
  const origins = new Set();
  for (const [path, html] of pages) {
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      if (!href.startsWith('/') && !href.startsWith('#')) continue;
      const target = new URL(href, base + path);
      origins.add(target.pathname);
      const destination = pages.get(target.pathname);
      assert.ok(destination, href);
      if (target.hash) assert.ok(destination.includes('id="' + target.hash.slice(1) + '"'), path + ' → ' + href);
    }
  }
  assert.deepEqual([...origins].sort(), [...paths].sort());
});

test('verified business details and page-specific schema match visible content', () => {
  for (const [path, html] of pages) {
    const graph = getSchema(html);
    const business = graph.find((item) => item['@type'] === 'LocalBusiness');
    assert.equal(business.name, 'Keçiören Çekici Burak Bey');
    assert.equal(business.telephone, '+905397301647');
    assert.equal(business.areaServed.name, 'Keçiören, Ankara');
    assert.equal(business.hasMap, 'https://maps.app.goo.gl/DiSzW37rddwQpg7u7');
    assert.equal(business.aggregateRating, undefined);
    assert.equal(business.address, undefined);
    assert.match(html, /tel:\+905397301647/);
    assert.match(html, /https:\/\/wa\.me\/905397301647/);
    assert.equal(graph.some((item) => item['@type'] === 'BreadcrumbList'), path !== '/');
    assert.equal(graph.filter((item) => item['@type'] === 'Service').length, path === '/hizmetler/' ? 7 : 0);
    const faq = graph.find((item) => item['@type'] === 'FAQPage');
    assert.equal(faq?.mainEntity.length ?? 0, path === '/neden-biz/' ? 4 : 0);
    for (const item of faq?.mainEntity ?? []) assert.ok(html.includes(item.name), item.name);
  }
  assert.match(pages.get('/iletisim/'), /<iframe title="Keçiören[^"]+"[^>]+loading="lazy"/);
});

test('home navigation, service showcase and mobile contact have accessible initial controls', async () => {
  const html = pages.get('/');
  assert.match(html, /<h1[^>]*>Keçiören’de çekici/);
  assert.match(html, /aria-expanded="false" aria-controls="primary-navigation"/);
  assert.match(html, /id="primary-navigation"[^>]*aria-label="Ana gezinme"/);
  assert.match(html, /aria-controls="sticky-options"/);
  assert.match(html, /id="sticky-options"[^>]*aria-hidden="true"[^>]*inert=""/);
  assert.match(html, /aria-label="Sonraki hizmet"/);
  assert.match(html, /aria-pressed="true">Oto kurtarma/);
  const cssFile = (await readdir('dist/assets')).find((name) => name.endsWith('.css'));
  const css = await readFile('dist/assets/' + cssFile, 'utf8');
  assert.match(css, /Barlow Condensed/);
  assert.match(css, /manrope-latin-ext\.woff2/);
  assert.match(css, /prefers-reduced-motion/);
});

test('discovery files, host-specific noindex, 404 and social image are consistent', async () => {
  const [headers, robots, sitemap, llms, notFound, og] = await Promise.all(
    ['_headers', 'robots.txt', 'sitemap.xml', 'llms.txt', '404.html', 'og.png'].map((file) => readFile('dist/' + file))
  );
  assert.ok(String(headers).replace(/\r\n/g, '\n').includes(base + '/*\n  X-Robots-Tag: noindex'));
  assert.match(String(robots), /User-agent: OAI-SearchBot/);
  assert.ok(String(robots).includes('Sitemap: ' + base + '/sitemap.xml'));
  assert.deepEqual(Array.from(String(sitemap).matchAll(/<loc>([^<]+)<\/loc>/g), ([, url]) => url), paths.map((path) => base + path));
  for (const path of paths) assert.ok(String(llms).includes('(' + base + path + ')'), path);
  assert.match(String(notFound), /<meta name="robots" content="noindex"/);
  assert.match(String(notFound), /<a href="\/">/);
  assert.equal(og.readUInt32BE(16), 1200);
  assert.equal(og.readUInt32BE(20), 630);
  const files = (await readdir('dist')).filter((name) => /^[a-f0-9]{32}\.txt$/.test(name));
  assert.equal(files.length, 1);
  assert.equal((await readFile('dist/' + files[0], 'utf8')).trim(), files[0].slice(0, -4));
});

test('home serves a prioritized responsive towing photo and three locally hosted service photos', async () => {
  const html = pages.get('/');
  assert.match(html, /<img[^>]+alt="Yolda otomobil taşıyan platform çekici"[^>]+fetchPriority="high"/i);
  assert.match(html, /\/images\/hero-tow-mobile\.webp 900w, \/images\/hero-tow\.webp 2000w/);
  for (const file of ['flatbed-car', 'battery-assist', 'motorcycle-transport']) {
    assert.match(html, new RegExp('<img[^>]+src="/images/' + file + '\\.webp"[^>]+loading="lazy"'));
  }
  for (const file of ['hero-tow', 'hero-tow-mobile', 'flatbed-car', 'battery-assist', 'motorcycle-transport']) {
    const photo = await readFile('dist/images/' + file + '.webp');
    assert.equal(photo.toString('ascii', 8, 12), 'WEBP', file);
  }
  assert.match(html, /Jeffrey M Dean, Wikimedia Commons/);
  assert.match(html, /creativecommons\.org\/licenses\/by-sa\/3\.0\//);
});
