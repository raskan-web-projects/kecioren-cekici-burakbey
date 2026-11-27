import React from 'react';
import { site } from './site';
import { tr } from './content/tr';

const shapes = {
  arrow: <path d="M6 18 18 6M7 6h11v11" />,
  battery: <><path d="M6 7h12v12H6zM9 4v3m6-3v3m-3 3v6m-3-3h6" /></>,
  beacon: <path d="M5 19h14M7 19l2-9h6l2 9M12 2v4M3 7l3 2m15-2-3 2" />,
  car: <path d="m5 11 2-5h10l2 5 2 2v5h-3v-2H6v2H3v-5l2-2Zm0 0h14M7 13v1m10-1v1" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  location: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.2" /></>,
  message: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.5-.8L4 20l1.5-3.5A7.2 7.2 0 0 1 4 12c0-4.1 3.6-7.5 8-7.5s8 3.1 8 7ZM8 12h.01M12 12h.01M16 12h.01" />,
  motorcycle: <><circle cx="6" cy="16" r="3" /><circle cx="18" cy="16" r="3" /><path d="m6 16 4-7h4l4 7m-8-7 4 7m-1-7h4l2 2" /></>,
  phone: <path d="M7 3h3l1.5 4-2 1.5a14 14 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2C10.5 19 5 13.5 5 5a2 2 0 0 1 2-2Z" />,
  route: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 6h5a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h5" /></>,
  shield: <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Zm-3 9 2 2 4-4" />,
  tow: <><path d="M3 14h12l3-5h3l1 5v4h-2m-17 0h2m3 0h7m-8-4 2-6h5l2 6" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  wrench: <path d="M20 5l-4 4-2-2 4-4a6 6 0 0 0-7 7l-7 7a2 2 0 0 0 3 3l7-7a6 6 0 0 0 6-8Z" />
};

export type IconName = keyof typeof shapes;

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg className={'icon ' + className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}

const serviceIcons: Record<string, IconName> = {
  'oto-kurtarma': 'tow', 'yol-yardim': 'wrench', 'aku-takviyesi': 'battery',
  'kayar-sabit-kasa': 'car', 'motosiklet-cekici': 'motorcycle', 'ozel-arac-cekici': 'shield', 'uzun-yol-cekici': 'route'
};

export function ServiceIcon({ id }: { id: string }) {
  return <Icon name={serviceIcons[id] ?? 'tow'} />;
}

export const phoneHref = 'tel:' + site.phone;
export const secondaryPhoneHref = 'tel:' + site.secondaryPhone;
export const whatsappHref = 'https://wa.me/' + site.whatsapp + '?text=' + encodeURIComponent(tr.whatsappMessage);

export function ContactActions({ location, primaryLabel = 'Hemen ara' }: { location: string; primaryLabel?: string }) {
  return <div className="contact-actions">
    <a className="button button-primary" href={phoneHref} data-event="click_phone" data-location={location}><Icon name="phone" /> {primaryLabel}</a>
    <a className="button button-secondary" href={whatsappHref} target="_blank" rel="noreferrer" data-event="click_whatsapp" data-location={location}><Icon name="message" /> WhatsApp</a>
  </div>;
}

export function MapPanel() {
  return <div className="map-card">
    <iframe title="Keçiören Çekici Burak Bey için Keçiören Ankara haritası" src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" width="640" height="420" />
    <a href={site.maps} target="_blank" rel="noreferrer" data-event="click_directions" data-location="map"><Icon name="location" /> Google Maps’te konumu aç <Icon name="arrow" /></a>
  </div>;
}
