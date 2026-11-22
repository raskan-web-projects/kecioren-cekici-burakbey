import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const html = await readFile('dist/index.html', 'utf8');

test('homepage is prerendered with local service content and working contact routes', () => {
  assert.match(html, /<html lang="tr">/);
  assert.match(html, /<h1[^>]*>Yolda kaldıysanız/);
  assert.match(html, /Keçiören, Ankara/);
  assert.match(html, /tel:\+905397301647/);
  assert.match(html, /https:\/\/wa\.me\/905397301647/);
  assert.match(html, /href="https:\/\/maps\.app\.goo\.gl\/DiSzW37rddwQpg7u7"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /motosiklet-cekici/);
});

test('all listed services appear in static HTML and point to real section ids', () => {
  for (const service of ['Oto kurtarma', 'Yol yardım', 'Akü takviyesi', 'Kayar kasa', 'Motosiklet çekici', 'Özel araç çekici', 'Uzun yol çekici']) {
    assert.ok(html.toLocaleLowerCase('tr').includes(service.toLocaleLowerCase('tr')), `Missing ${service}`);
  }
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const localLinks = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
  for (const target of localLinks) assert.ok(ids.has(target), `Missing local target #${target}`);
});

test('search metadata, language signals, and temporary Pages noindex policy are consistent', () => {
  const headers = readFile('dist/_headers', 'utf8');
  const robots = readFile('dist/robots.txt', 'utf8');
  const sitemap = readFile('dist/sitemap.xml', 'utf8');
  return Promise.all([headers, robots, sitemap]).then(([headerText, robotText, sitemapText]) => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
    assert.ok(title && title.length >= 50 && title.length <= 60, `Unexpected title length: ${title?.length}`);
    assert.ok(description && description.length >= 140 && description.length <= 160, `Unexpected description length: ${description?.length}`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /rel="canonical" href="https:\/\/kecioren-cekici-burakbey\.pages\.dev\//);
    assert.match(html, /hreflang="tr-TR"/);
    assert.match(html, /hreflang="x-default"/);
    assert.match(html, /property="og:image:width" content="1200"/);
    assert.match(html, /property="og:image:height" content="630"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(headerText, /https:\/\/kecioren-cekici-burakbey\.pages\.dev\/\*\s+X-Robots-Tag: noindex/);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
    assert.match(robotText, /User-agent: OAI-SearchBot/);
    assert.match(robotText, /Sitemap: https:\/\/kecioren-cekici-burakbey\.pages\.dev\/sitemap\.xml/);
    assert.match(sitemapText, /<loc>https:\/\/kecioren-cekici-burakbey\.pages\.dev\//);
  });
});

test('JSON-LD is valid and only describes visible, verified business details', () => {
  const block = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(block, 'JSON-LD block missing');
  const graph = JSON.parse(block)['@graph'];
  const business = graph.find((item) => item['@type'] === 'LocalBusiness');
  const faq = graph.find((item) => item['@type'] === 'FAQPage');
  assert.equal(business.name, 'Keçiören Çekici Burak Bey');
  assert.equal(business.telephone, '+905397301647');
  assert.equal(business.areaServed.name, 'Keçiören, Ankara');
  assert.equal(business.hasMap, 'https://maps.app.goo.gl/DiSzW37rddwQpg7u7');
  assert.equal(business.contactPoint.availableLanguage, 'Turkish');
  assert.equal(business.aggregateRating, undefined);
  assert.equal(business.address, undefined);
  assert.equal(faq.mainEntity.length, 4);
});

test('every image has alt and intrinsic dimensions; hero image is prioritized', () => {
  const images = [...html.matchAll(/<img\b([^>]+)>/g)].map((match) => match[1]);
  assert.ok(images.length >= 3);
  for (const image of images) {
    assert.match(image, /\balt="[^"]+"/);
    assert.match(image, /\bwidth="\d+"/);
    assert.match(image, /\bheight="\d+"/);
  }
  assert.match(html, /fetch[Pp]riority="high"/);
  assert.match(html, /loading="lazy"/);
});

test('mobile navigation and sticky contact controls remain accessible in prerendered HTML', () => {
  assert.match(html, /aria-label="Menüyü aç"/);
  assert.match(html, /aria-expanded="false" aria-controls="primary-navigation"/);
  assert.match(html, /id="primary-navigation"[^>]*aria-label="Ana gezinme"/);
  assert.match(html, /aria-controls="sticky-options"/);
  assert.match(html, /id="sticky-options"[^>]*aria-hidden="true"[^>]*inert=""/);
  assert.match(html, /Sorunuz mu var\? Burak Bey’i arayın/);
  assert.match(html, /data-location="faq"/);
});

test('analytics consent UI does not depend on browser storage during prerender', () => {
  assert.doesNotMatch(html, /class="consent-banner"/);
});

test('IndexNow key matches its public key filename and 404 is noindex with a home link', async () => {
  const files = (await readdir('dist')).filter((name) => /^[a-f0-9]{32}\.txt$/.test(name));
  assert.equal(files.length, 1);
  assert.equal((await readFile(`dist/${files[0]}`, 'utf8')).trim(), files[0].slice(0, -4));
  const notFound = await readFile('dist/404.html', 'utf8');
  assert.match(notFound, /<meta name="robots" content="noindex"/);
  assert.match(notFound, /<a href="\/">/);
});
