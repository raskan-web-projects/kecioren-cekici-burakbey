import React, { useEffect, useRef, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const consentVisible = Boolean(import.meta.env.VITE_GA_ID) && !analyticsConsent();
  const [showConsent, setShowConsent] = useState(consentVisible);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLElement>('[data-event]');
      if (link?.dataset.event) track(link.dataset.event, link.dataset.location || 'unknown');
    };
    const openSticky = () => track('click_sticky_cta', 'sticky');
    document.addEventListener('click', handleClick);
    window.addEventListener('cta-sticky-open', openSticky);
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('cta-sticky-open', openSticky);
    };
  }, []);

  useEffect(() => {
    if (!open && !menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    const closeOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (open && !stickyRef.current?.contains(target)) setOpen(false);
      if (menuOpen && !headerRef.current?.contains(target)) setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('click', closeOutside);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('click', closeOutside);
    };
  }, [open, menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        inLanguage: 'tr-TR'
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${site.url}/#business`,
        name: site.name,
        url: `${site.url}/`,
        logo: `${site.url}/favicon.svg`,
        image: `${site.url}/images/tow-scene.svg`,
        telephone: site.phone,
        description,
        areaServed: { '@type': 'AdministrativeArea', name: 'Keçiören, Ankara' },
        hasMap: site.maps,
        sameAs: [site.maps],
        availableLanguage: 'Turkish',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Çekici ve yol yardım hizmetleri',
          itemListElement: tr.services.map((service) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: service.title, areaServed: 'Keçiören, Ankara' }
          }))
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: tr.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer }
        }))
      }
    ]
  };

  return <>
    <a className="skip-link" href="#main-content">İçeriğe geç</a>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />

    <header className="site-header wrap" ref={headerRef}>
      <a className="brand" href="#top" aria-label={`${site.name} ana sayfa`} onClick={closeMenu}>
        <span className="brand-mark">B<span>↗</span></span>
        <span className="brand-copy"><b>BURAK BEY</b><small>{tr.brand}</small></span>
      </a>
      <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} id="primary-navigation" aria-label="Ana gezinme">
        <a href="#hizmetler" onClick={closeMenu}>{tr.header.navServices}</a>
        <a href="#surec" onClick={closeMenu}>{tr.header.navProcess}</a>
        <a href="#sorular" onClick={closeMenu}>Sorular</a>
        <LanguageSwitch />
        <a className="nav-call" href={`tel:${site.phone}`} data-event="click_phone" data-location="header" onClick={closeMenu}>{tr.header.call} <Arrow diagonal /></a>
      </nav>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span />
      </button>
    </header>

    <main id="main-content">
      <section className="hero-stage" id="top" aria-labelledby="hero-title">
        <div className="hero-texture" aria-hidden="true" />
        <div className="hero-inner wrap">
          <div className="hero-copy">
            <p className="eyebrow"><i /> KEÇİÖREN, ANKARA <span>·</span> OTO KURTARMA</p>
            <h1 id="hero-title">Yolda kaldıysanız,<br /><em>Keçiören’de Burak Bey’e ulaşın.</em></h1>
            <p className="hero-lede">Keçiören’de çekici ve yol yardım desteği. İhtiyacınızı anlatın; aracınıza uygun seçeneği birlikte değerlendirelim.</p>
            <div className="hero-actions">
              <a className="button button-yellow" href={`tel:${site.phone}`} data-event="click_phone" data-location="hero">Hemen ara <Arrow diagonal /></a>
              <a className="button button-outline" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(tr.whatsappMessage)}`} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location="hero">WhatsApp’tan yaz <Arrow diagonal /></a>
            </div>
            <p className="hero-location"><span className="location-pin" aria-hidden="true">⌖</span> Keçiören, Ankara <span className="location-rule" /> Oto kurtarma · Yol yardım</p>
          </div>
          <div className="hero-art" aria-label="Çekici ve araç teknik illüstrasyonu">
            <div className="art-topline"><span>YOLDA DESTEK</span><span>ANKARA / TR</span></div>
            <img src="/images/tow-scene.svg" alt="Platformunda otomobil taşıyan çekici için özgün teknik illüstrasyon" width="1200" height="780" fetchPriority="high" />
            <div className="art-bottomline"><span>ARAÇ <b>·</b> KONUM <b>·</b> ROTA</span><span className="art-index">01—03</span></div>
            <a className="hero-call-card" href={`tel:${site.phone}`} data-event="click_phone" data-location="hero-card">
              <span className="call-card-kicker">DOĞRUDAN ULAŞIN</span>
              <span className="call-card-label">Burak Bey</span>
              <span className="call-card-phone">{site.phoneDisplay}<Arrow diagonal /></span>
            </a>
          </div>
        </div>
        <div className="quick-service-shell wrap">
          <p>HIZLI ERİŞİM</p>
          <div className="quick-services">
            <a href="#oto-kurtarma">Oto kurtarma <Arrow /></a>
            <a href="#yol-yardim">Yol yardım <Arrow /></a>
            <a href="#aku-takviyesi">Akü takviyesi <Arrow /></a>
            <a href="#motosiklet-cekici">Motosiklet taşıma <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="service-section" id="hizmetler">
        <div className="wrap">
          <div className="section-heading">
            <div><p className="eyebrow">01 / HİZMETLER</p><h2>İhtiyacınıza uygun<br /><em>çekici desteği.</em></h2></div>
            <p>Aracın türünü, bulunduğu konumu ve ihtiyacınızı paylaşın. Size uygun taşıma veya yol yardım seçeneğini doğrudan görüşelim.</p>
          </div>
          <div className="service-list">
            {tr.services.map((service) => <article className="service-row" id={service.id} key={service.id}>
              <span className="service-number">{service.number}</span>
              <div className="service-copy"><h3>{service.title}</h3><p>{service.text}</p></div>
              <a href={`tel:${site.phone}`} aria-label={`${service.title} için Burak Bey’i ara`} data-event="click_phone" data-location={`service-${service.id}`}><Arrow diagonal /></a>
            </article>)}
          </div>
          <div className="section-cta"><p>Aracınızın durumu hakkında konuşalım.</p><a href={`tel:${site.phone}`} data-event="click_phone" data-location="services-bottom">{site.phoneDisplay} <Arrow diagonal /></a></div>
        </div>
      </section>

      <section className="signature-section wrap" aria-labelledby="signature-title">
        <div className="signature-art">
          <span className="signature-index">SAHADAKİ İHTİYAÇ / 01</span>
          <img src="/images/tow-scene.svg" alt="Platform çekici ve otomobilin teknik çizim sahnesi" width="1200" height="780" loading="lazy" />
          <span className="signature-caption">İLLÜSTRASYON · TEMSİLİ TAŞIMA SAHNESİ</span>
        </div>
        <div className="signature-copy">
          <p className="eyebrow">02 / UYGUN ÇÖZÜM</p>
          <h2 id="signature-title">Önce ihtiyacı<br /><em>birlikte netleştirelim.</em></h2>
          <p>Aracınızın türünü ve mevcut durumunu, bulunduğunuz yeri ve varsa varış noktasını paylaşın. Uygun çekici veya yol yardım seçeneğini telefonla değerlendirin.</p>
          <div className="detail-tags"><span>ARAÇ TÜRÜ</span><span>KONUM</span><span>VARIŞ NOKTASI</span></div>
          <a className="text-link" href={`tel:${site.phone}`} data-event="click_phone" data-location="signature">İhtiyacınızı anlatın <Arrow diagonal /></a>
        </div>
      </section>

      <section className="process-section" id="surec">
        <div className="wrap process-inner">
          <div className="process-intro"><p className="eyebrow">03 / SÜREÇ</p><h2>Üç kısa adım.<br /><em>Net bir plan.</em></h2><p>Yolda kaldığınızda bu temel bilgileri paylaşmanız, ihtiyaca uygun desteği konuşmayı kolaylaştırır.</p>
            <a className="button button-outline" href={`tel:${site.phone}`} data-event="click_phone" data-location="process">Burak Bey’i ara <Arrow diagonal /></a>
          </div>
          <div className="steps">
            {tr.process.steps.map(([title, text], i) => <article key={title}><b>0{i + 1}</b><div><h3>{title}</h3><p>{text}</p></div><span className="step-mark" aria-hidden="true">↗</span></article>)}
          </div>
        </div>
      </section>

      <section className="faq-section wrap" id="sorular">
        <div className="faq-intro"><p className="eyebrow">04 / SIK SORULANLAR</p><h2>Yola çıkmadan<br /><em>önce bilin.</em></h2><p>Hizmet kapsamı ve ücret hakkında en çok merak edilenler.</p></div>
        <div className="faq-list">
          {tr.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
          <a className="faq-cta" href={`tel:${site.phone}`} data-event="click_phone" data-location="faq">Sorunuz mu var? Burak Bey’i arayın <Arrow diagonal /></a>
        </div>
      </section>

      <section className="contact-scene" id="iletisim">
        <div className="wrap contact-grid">
          <div className="contact-copy"><p className="eyebrow">05 / İLETİŞİM</p><h2>Yola devam etmek için<br /><em>bir telefon yeter.</em></h2><p>Keçiören, Ankara ve çekici talebiniz hakkında bilgi verin.</p>
            <div className="contact-actions"><a className="button button-yellow" href={`tel:${site.phone}`} data-event="click_phone" data-location="contact">{site.phoneDisplay} <Arrow diagonal /></a><a className="map-link" href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="contact">Google Maps’te konumu aç <Arrow diagonal /></a></div>
          </div>
          <div className="map-card"><div className="map-label"><span>KEÇİÖREN, ANKARA</span><span aria-hidden="true">⌖</span></div>
            <iframe title="Keçiören Çekici Burak Bey için Keçiören Ankara haritası" src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" width="640" height="420" />
            <a href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="map">Yol tarifi al <Arrow diagonal /></a>
          </div>
        </div>
      </section>
    </main>

    <footer className="footer wrap">
      <a className="brand footer-brand" href="#top"><span className="brand-mark">B<span>↗</span></span><span className="brand-copy"><b>BURAK BEY</b><small>{tr.brand}</small></span></a>
      <div className="footer-meta"><span>Keçiören, Ankara</span><a href={`tel:${site.phone}`} data-event="click_phone" data-location="footer">{site.phoneDisplay}</a><a href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="footer">Konum <Arrow diagonal /></a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location="footer">WhatsApp <Arrow diagonal /></a><a href="#gizlilik">{tr.footer.privacy}</a></div>
      <a className="raskan" href="https://raskanajans.com" target="_blank" rel="noopener noreferrer"><small>MADE BY</small><img src="/raskan-logo.webp" alt="RASKAN" width="90" height="24" /></a>
      <p className="copyright">© {new Date().getFullYear()} {site.name}</p>
    </footer>
    <section className="privacy-note wrap" id="gizlilik"><h2>{tr.privacy.title}</h2><p>{tr.privacy.body}</p></section>

    {showConsent && <aside className="consent-banner" aria-label={tr.consent.label}><p>{tr.consent.text}</p><button onClick={() => { setAnalyticsConsent('denied'); setShowConsent(false); }}>{tr.consent.deny}</button><button onClick={() => { setAnalyticsConsent('granted'); setShowConsent(false); }}>{tr.consent.allow}</button></aside>}

    <div className="sticky-contact" ref={stickyRef}><div className={`sticky-options ${open ? 'is-open' : ''}`} id="sticky-options" aria-hidden={!open} inert={!open}>
      <a href={`tel:${site.phone}`} tabIndex={open ? 0 : -1} data-event="click_phone" data-location="sticky">{tr.sticky.call} <Arrow diagonal /></a>
      <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(tr.whatsappMessage)}`} tabIndex={open ? 0 : -1} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location="sticky">{tr.sticky.whatsapp} <Arrow diagonal /></a>
      <a href={site.maps} tabIndex={open ? 0 : -1} target="_blank" rel="noreferrer" data-event="click_directions" data-location="sticky">{tr.sticky.directions} <Arrow diagonal /></a>
    </div><button type="button" aria-expanded={open} aria-controls="sticky-options" onClick={() => { setOpen(!open); if (!open) window.dispatchEvent(new CustomEvent('cta-sticky-open')); }}>{tr.sticky.label} <span aria-hidden="true">{open ? '×' : '↗'}</span></button></div>
  </>;
}
