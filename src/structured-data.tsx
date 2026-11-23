import React from 'react';
import { site } from './site';
import { tr } from './content/tr';
import type { Route } from './routes';

export function StructuredData({ route }: { route: Route }) {
  const home = site.url + '/';
  const business = home + '#business';
  const graph: object[] = [
    { '@type': 'WebSite', '@id': home + '#website', url: home, name: site.name, inLanguage: tr.languageTag },
    {
      '@type': 'LocalBusiness', '@id': business, name: site.name, url: home, logo: site.url + '/favicon.svg',
      telephone: site.phone, description: tr.description, hasMap: site.maps, sameAs: [site.maps],
      areaServed: { '@type': 'AdministrativeArea', name: site.city },
      contactPoint: { '@type': 'ContactPoint', telephone: site.phone, contactType: 'customer service', availableLanguage: 'Turkish' }
    }
  ];

  if (route.path !== '/') graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: home },
      { '@type': 'ListItem', position: 2, name: route.label, item: site.url + route.path }
    ]
  });

  if (route.path === '/hizmetler/') graph.push(...tr.services.map((service) => ({
    '@type': 'Service', name: service.title, description: service.text,
    provider: { '@id': business }, areaServed: site.city, url: site.url + route.path + '#' + service.id
  })));

  if (route.path === '/neden-biz/') graph.push({
    '@type': 'FAQPage',
    mainEntity: tr.faq.map((item) => ({
      '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  });

  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
  }} />;
}
