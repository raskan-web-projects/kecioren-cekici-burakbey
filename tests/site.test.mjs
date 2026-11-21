import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('homepage is prerendered with its core local SEO and contact details', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  assert.match(html, /<html lang="tr">/);
  assert.match(html, /<h1[^>]*>Yolda kaldıysanız/);
  assert.match(html, /Keçiören, Ankara/);
  assert.match(html, /tel:\+905397301647/);
  assert.match(html, /https:\/\/wa\.me\/905397301647/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /motosiklet-cekici/);
});

test('all customer supplied services are present in the rendered HTML', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  for (const service of ['Oto kurtarma', 'Yol yardım', 'Akü takviyesi', 'Kayar kasa', 'Motosiklet çekici', 'Özel araç çekici', 'Uzun yol çekici']) {
    assert.ok(html.toLocaleLowerCase('tr').includes(service.toLocaleLowerCase('tr')), `Missing ${service}`);
  }
});

test('search metadata and Pages crawler directives stay consistent', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const headers = await readFile('dist/_headers', 'utf8');
  const robots = await readFile('dist/robots.txt', 'utf8');
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.match(html, /<title>Keçiören Çekici Burak Bey/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /rel="canonical" href="https:\/\/kecioren-cekici-burakbey\.pages\.dev\//);
  assert.match(headers, /https:\/\/kecioren-cekici-burakbey\.pages\.dev\/\*\s+X-Robots-Tag: noindex/);
  assert.doesNotMatch(html, /name="robots" content="noindex/);
  assert.match(robots, /User-agent: OAI-SearchBot/);
  assert.match(robots, /Sitemap: https:\/\/kecioren-cekici-burakbey\.pages\.dev\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/kecioren-cekici-burakbey\.pages\.dev\//);
});
