import React, { useEffect, useState } from 'react';
import { site } from './site';
import { description, languages, pageTitle, tr } from './content/tr';
import { analyticsConsent, setAnalyticsConsent, track } from './analytics';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>;
}

function LanguageSwitch() {
  if (languages.length < 2) return null;
  return <button className="language-switch" type="button" aria-label="Dil seç">◎</button>;
}

export function App() {
  const [open, setOpen] = useState(false);
  const [consentVisible, setConsentVisible] = useState(Boolean(import.meta.env.VITE_GA_ID) && !analyticsConsent());
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLElement>('[data-event]');
      if (link?.dataset.event) track(link.dataset.event, link.dataset.location || 'unknown');
    };
    const openSticky = () => track('click_sticky_cta', 'sticky');
    document.addEventListener('click', handleClick);
    window.addEventListener('cta-sticky-open', openSticky);
    return () => { document.removeEventListener('click', handleClick); window.removeEventListener('cta-sticky-open', openSticky); };
  }, []);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${site.url}/#website`, url: `${site.url}/`, name: site.name, inLanguage: 'tr-TR' },
      { '@type': 'LocalBusiness', '@id': `${site.url}/#business`, name: site.name, url: `${site.url}/`, telephone: site.phone, description, areaServed: { '@type': 'AdministrativeArea', name: 'Keçiören, Ankara' }, hasMap: site.maps, availableLanguage: 'Turkish', hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Çekici ve yol yardım hizmetleri', itemListElement: tr.services.map((service) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.title, areaServed: 'Keçiören, Ankara' } })) } },
      { '@type': 'FAQPage', mainEntity: tr.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }
    ]
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <header className="topbar wrap">
      <a className="brand" href="#top" aria-label={`${site.name} ana sayfa`}>
        <span className="brand-mark">B<span>↗</span></span><span className="brand-copy"><b>BURAK BEY</b><small>{tr.brand}</small></span>
      </a>
      <nav aria-label="Ana gezinme"><a href="#hizmetler">{tr.header.navServices}</a><a href="#surec">{tr.header.navProcess}</a><LanguageSwitch /><a className="nav-call" href={`tel:${site.phone}`} data-event="click_phone" data-location="header">{tr.header.call} <Arrow diagonal /></a></nav>
    </header>

    <main id="top">
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow"><i /> {tr.hero.eyebrow} <span>·</span> {tr.hero.category}</p>
          <h1>{tr.hero.title}<br /><em>{tr.hero.titleAccent}</em></h1>
          <p className="hero-lede">{tr.hero.description}</p>
          <div className="hero-actions"><a className="button button-yellow" href={`tel:${site.phone}`} data-event="click_phone" data-location="hero">{tr.hero.call} <Arrow diagonal /></a><a className="button button-outline" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(tr.whatsappMessage)}`} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location="hero">{tr.hero.whatsapp} <Arrow diagonal /></a></div>
          <div className="hero-phone"><span>{tr.hero.phoneLabel}</span><a href={`tel:${site.phone}`} data-event="click_phone" data-location="hero-number">{site.phoneDisplay}</a></div>
        </div>
        <aside className="hero-visual" aria-label="Çekici ve yol yardım hizmetleri">
          <div className="visual-top"><span>HİZMETLERİMİZ</span><span>KEÇİÖREN · ANKARA</span></div>
          <h2>Yolda kaldığınızda<br /><em>yanınızdayız.</em></h2>
          <p>Aracınıza uygun destek için Burak Bey’e ulaşın.</p>
          <div className="hero-service-links">
            {tr.services.slice(0, 4).map((service) => <a href={`#${service.id}`} key={service.id}>{service.title}<Arrow diagonal /></a>)}
          </div>
          <div className="visual-bottom"><span>DOĞRUDAN İLETİŞİM</span><a href={`tel:${site.phone}`} data-event="click_phone" data-location="hero-panel">{site.phoneDisplay}<Arrow diagonal /></a></div>
        </aside>
        <div className="hero-bottom"><span>{tr.hero.bottom}</span><a href="#hizmetler">{tr.hero.discover} <Arrow /></a></div>
      </section>

      <section className="service-section" id="hizmetler"><div className="wrap">
        <div className="section-heading"><div><p className="eyebrow">{tr.serviceHeading.eyebrow}</p><h2>{tr.serviceHeading.title}<br /><em>{tr.serviceHeading.accent}</em></h2></div><p>{tr.serviceHeading.text}</p></div>
        <div className="service-list">{tr.services.map((service) => <article className="service-row" id={service.id} key={service.id}><span className="service-number">{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><a href={`tel:${site.phone}`} aria-label={`${service.title} için Burak Bey'i ara`} data-event="click_phone" data-location={`service-${service.id}`}><Arrow diagonal /></a></article>)}</div>
        <div className="section-cta"><p>{tr.serviceHeading.closing}</p><a href={`tel:${site.phone}`} data-event="click_phone" data-location="services-bottom">{site.phoneDisplay} <Arrow diagonal /></a></div>
      </div></section>

      <section className="process-section wrap" id="surec"><div className="process-title"><p className="eyebrow">{tr.process.eyebrow}</p><h2>{tr.process.title}<br /><em>{tr.process.accent}</em></h2><p>{tr.process.text}</p></div><div className="steps">{tr.process.steps.map(([title, text], i) => <article key={title}><b>0{i + 1}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}<a className="text-link" href={`tel:${site.phone}`} data-event="click_phone" data-location="process">{tr.process.call} <Arrow diagonal /></a></div></section>

      <section className="contact-band"><div className="wrap contact-inner"><div><p className="eyebrow">{tr.contact.eyebrow}</p><h2>{tr.contact.title}<br /><em>{tr.contact.accent}</em></h2><p>{tr.contact.text}</p></div><div className="contact-actions"><a className="button button-dark" href={`tel:${site.phone}`} data-event="click_phone" data-location="contact">{site.phoneDisplay} <Arrow diagonal /></a><a className="map-link" href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="contact">{tr.contact.directions} <Arrow diagonal /></a></div></div></section>
      <section className="faq-section wrap" id="sorular"><div><p className="eyebrow">{tr.faqHeading.eyebrow}</p><h2>{tr.faqHeading.title}<br /><em>{tr.faqHeading.accent}</em></h2></div><div className="faq-list">{tr.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    </main>

    <footer className="footer wrap"><a className="brand footer-brand" href="#top"><span className="brand-mark">B<span>↗</span></span><span className="brand-copy"><b>BURAK BEY</b><small>{tr.brand}</small></span></a><div className="footer-meta"><span>Keçiören, Ankara</span><a href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="footer">{tr.footer.directions} <Arrow diagonal /></a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location="footer">{tr.hero.whatsapp} <Arrow diagonal /></a><a href="#gizlilik">{tr.footer.privacy}</a></div><a className="raskan" href="https://raskanajans.com" target="_blank" rel="noopener noreferrer"><small>{tr.footer.madeBy}</small><img src="/raskan-logo.webp" alt="RASKAN" width="90" height="24" /></a><p className="copyright">© {new Date().getFullYear()} {site.name}</p></footer>
    <section className="privacy-note wrap" id="gizlilik"><h2>{tr.privacy.title}</h2><p>{tr.privacy.body}</p></section>
    {consentVisible && <aside className="consent-banner" aria-label={tr.consent.label}><p>{tr.consent.text}</p><button onClick={() => { setAnalyticsConsent('denied'); setConsentVisible(false); }}>{tr.consent.deny}</button><button onClick={() => { setAnalyticsConsent('granted'); setConsentVisible(false); }}>{tr.consent.allow}</button></aside>}

    <div className="sticky-contact"><div className={`sticky-options ${open ? 'is-open' : ''}`} id="sticky-options" aria-hidden={!open}><a href={`tel:${site.phone}`} data-event="click_phone" data-location="sticky">{tr.sticky.call} <Arrow diagonal /></a><a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(tr.whatsappMessage)}`} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location="sticky">{tr.sticky.whatsapp} <Arrow diagonal /></a><a href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="sticky">{tr.sticky.directions} <Arrow diagonal /></a></div><button type="button" aria-expanded={open} aria-controls="sticky-options" onClick={() => { setOpen(!open); if (!open) window.dispatchEvent(new CustomEvent('cta-sticky-open')); }}>{tr.sticky.label} <span aria-hidden="true">{open ? '×' : '↗'}</span></button></div>
  </>;
}
