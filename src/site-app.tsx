import React, { useEffect, useRef, useState } from 'react';
import { site } from './site';
import { tr } from './content/tr';
import { analyticsConsent, setAnalyticsConsent, track } from './analytics';
import { routes, type Route } from './routes';
import { HomePage } from './home-page';
import { InteriorPage } from './interior-pages';
import { Icon, phoneHref, secondaryPhoneHref, whatsappHref } from './site-parts';
import { StructuredData } from './structured-data';

const navRoutes = routes.filter((route) => route.path !== '/gizlilik/');

function Brand() {
  return <a className="brand" href="/">
    <img src={site.logo} alt="Burakbey Oto Kurtarma" width="752" height="212" />
  </a>;
}

function Footer() {
  return <footer className="footer">
    <div className="wrap footer-grid">
      <div><Brand /><p>Keçiören, Ankara’da çekici ve yol yardım.</p></div>
      <nav aria-label="Alt gezinme">{navRoutes.map((item) => <a key={item.path} href={item.path}>{item.label}</a>)}</nav>
      <div className="footer-contact">
        <a href={phoneHref} data-event="click_phone" data-location="footer">{site.phoneDisplay}</a>
        <a href={secondaryPhoneHref} data-event="click_phone" data-location="footer-secondary">{site.secondaryPhoneDisplay}</a>
        <a href={whatsappHref} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location="footer">WhatsApp</a>
        <a href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="footer">Google Maps</a>
      </div>
    </div>
    <div className="wrap footer-bottom">
      <span>© {new Date().getFullYear()} {site.name}</span>
      <a href="/gizlilik/" id="gizlilik">{tr.footer.privacy}</a>
      <a className="raskan" href="https://raskanajans.com" target="_blank" rel="noopener noreferrer"><small>MADE BY</small><img src="/raskan-logo.webp" alt="RASKAN" width="90" height="24" loading="lazy" /></a>
    </div>
  </footer>;
}

export function App({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const [showConsent, setShowConsent] = useState(false);
  const analyticsEnabled = Boolean(import.meta.env.VITE_GA_ID?.trim());

  useEffect(() => {
    setShowConsent(analyticsEnabled && !analyticsConsent());
  }, [analyticsEnabled]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLElement>('[data-event]');
      if (link?.dataset.event) track(link.dataset.event, link.dataset.location || 'unknown');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open && !menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (menuOpen) menuButton.current?.focus();
      if (open) stickyRef.current?.querySelector('button')?.focus();
      setOpen(false);
      setMenuOpen(false);
    };
    const outside = (event: MouseEvent) => {
      if (!stickyRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', close);
    document.addEventListener('click', outside);
    return () => {
      document.removeEventListener('keydown', close);
      document.removeEventListener('click', outside);
    };
  }, [open, menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    nav.current?.querySelector('a')?.focus();
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main-content">İçeriğe geç</a>
    <StructuredData route={route} />
    <header className={'site-header' + (menuOpen ? ' menu-open' : '')}>
      <div className="wrap header-inner">
        <Brand />
        <nav ref={nav} className="site-nav" id="primary-navigation" aria-label="Ana gezinme">
          {navRoutes.map((item) => <a key={item.path} href={item.path} aria-current={item.path === route.path ? 'page' : undefined}>{item.label}</a>)}
          <a className="nav-call" href={phoneHref} data-event="click_phone" data-location="header"><Icon name="phone" /> Hemen ara</a>
        </nav>
        <button ref={menuButton} className="menu-toggle" type="button" aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => { setOpen(false); setMenuOpen(!menuOpen); }}><span /><span /></button>
      </div>
    </header>
    <div inert={menuOpen}>
      <main id="main-content">{route.path === '/' ? <HomePage /> : <InteriorPage route={route} />}</main>
      <Footer />
    </div>
    {analyticsEnabled && route.path === '/gizlilik/' && !showConsent && <div className="wrap consent-preferences" inert={menuOpen}><button className="button button-secondary" onClick={() => setShowConsent(true)}>Analitik tercihini değiştir</button></div>}
    {showConsent && <aside className="consent-banner" inert={menuOpen} aria-label={tr.consent.label}>
      <p>{tr.consent.text}</p>
      <button type="button" onClick={() => { setAnalyticsConsent('denied'); setShowConsent(false); }}>{tr.consent.deny}</button>
      <button type="button" onClick={() => { setAnalyticsConsent('granted'); setShowConsent(false); }}>{tr.consent.allow}</button>
    </aside>}
    <div className="sticky-contact" ref={stickyRef} inert={menuOpen}>
      <div className="sticky-options" id="sticky-options" aria-hidden={!open} inert={!open} hidden={!open}>
        <a href={phoneHref} data-event="click_phone" data-location="sticky"><Icon name="phone" /> {tr.sticky.call}</a>
        <a href={secondaryPhoneHref} data-event="click_phone" data-location="sticky-secondary"><Icon name="phone" /> {site.secondaryPhoneDisplay}</a>
        <a href={whatsappHref} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location="sticky"><Icon name="message" /> {tr.sticky.whatsapp}</a>
        <a href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="sticky"><Icon name="location" /> {tr.sticky.directions}</a>
      </div>
      <button type="button" aria-expanded={open} aria-controls="sticky-options" onClick={() => { if (!open) track('click_sticky_cta', 'sticky'); setOpen(!open); }}><Icon name="phone" /> {tr.sticky.label}</button>
    </div>
  </>;
}
