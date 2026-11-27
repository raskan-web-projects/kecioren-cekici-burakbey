import type { ComponentProps } from 'react';
import { tr } from './content/tr';
import type { Route } from './routes';
import { site } from './site';
import { JobPhoto, type PhotoName } from './photos';
import { ContactActions, Icon, MapPanel, phoneHref, secondaryPhoneHref, ServiceIcon } from './site-parts';
import './interior.css';

type IconName = ComponentProps<typeof Icon>['name'];

const pageIcons: Partial<Record<Route['path'], IconName>> = {
  '/hizmetler/': 'wrench',
  '/neden-biz/': 'shield',
  '/iletisim/': 'phone',
  '/gizlilik/': 'shield',
};

const serviceDetails: Record<(typeof tr.services)[number]['id'], readonly string[]> = {
  'oto-kurtarma': ['Aracın bulunduğu nokta', 'Aracın mevcut durumu'],
  'yol-yardim': ['Arızanın kısa tarifi', 'Yerinde yardım veya taşıma ihtiyacı'],
  'aku-takviyesi': ['Aracın bulunduğu nokta', 'Marşa bastığınızda ne olduğu'],
  'kayar-sabit-kasa': ['Araç türü', 'Yükleme noktasındaki koşullar'],
  'motosiklet-cekici': ['Motosikletin modeli', 'Teslim alınacağı konum'],
  'ozel-arac-cekici': ['Aracın türü ve durumu', 'Teslim edileceği konum'],
  'uzun-yol-cekici': ['Başlangıç ve varış noktaları', 'Taşınacak aracın türü'],
};

const requestDetails = ['Bulunduğunuz konum', 'Aracın türü ve durumu', 'Varsa taşıma için varış noktası'];
const processIcons = ['phone', 'wrench', 'location'] as const;
const servicePhotos: Partial<Record<(typeof tr.services)[number]['id'], PhotoName>> = {
  'oto-kurtarma': 'coupe',
  'kayar-sabit-kasa': 'panelVan',
  'ozel-arac-cekici': 'ambulance'
};

function PageHeading({ route }: { route: Route }) {
  return <header className="interior-hero">
    <div className="wrap">
      <span className="interior-badge"><Icon name={pageIcons[route.path] ?? 'route'} />{route.label}</span>
      <h1>{route.h1}</h1>
      <p>{route.description}</p>
    </div>
  </header>;
}

function Checklist({ items }: { items: readonly string[] }) {
  return <ul className="interior-checks">
    {items.map((item) => <li key={item}><Icon name="check" />{item}</li>)}
  </ul>;
}

function InteriorCta({ location }: { location: string }) {
  return <section className="interior-callout wrap" aria-labelledby="interior-callout-title">
    <div className="interior-callout-copy">
      <span className="interior-icon"><Icon name="phone" /></span>
      <div>
        <h2 id="interior-callout-title">{tr.serviceHeading.closing}</h2>
        <p>Konumunuzu ve ihtiyacınızı Burak Bey’le paylaşın.</p>
      </div>
    </div>
    <ContactActions location={location} />
  </section>;
}

function ServicesPage() {
  return <>
    <div className="interior-services wrap">
      {tr.services.map((service) => {
        const photo = servicePhotos[service.id];
        return <section className="interior-service" id={service.id} key={service.id} aria-labelledby={`${service.id}-title`}>
          <div className="interior-service-copy">
            <h2 id={`${service.id}-title`}>{service.title}</h2>
            <p>{service.text}</p>
            <Checklist items={serviceDetails[service.id]} />
            <ContactActions location={`service-${service.id}`} />
          </div>
          {photo
            ? <div className="interior-service-art service-photo"><JobPhoto name={photo} /></div>
            : <div className="interior-service-art" aria-hidden="true"><span className="interior-icon"><ServiceIcon id={service.id} /></span></div>}
        </section>;
      })}
    </div>
    <InteriorCta location="services-bottom" />
  </>;
}

function AboutPage() {
  return <>
    <section className="interior-split wrap" aria-labelledby="interior-process-title">
      <div className="interior-process-art">
        <ol className="interior-process-steps" aria-label="Yol yardımı süreci">
          {tr.process.steps.map(([title, description], index) => <li key={title}>
            <span className="interior-icon"><Icon name={processIcons[index]} /></span>
            <div><strong>{title}</strong><p>{description}</p></div>
          </li>)}
        </ol>
      </div>
      <div className="interior-copy">
        <p className="interior-kicker">Yol yardımı süreci</p>
        <h2 id="interior-process-title">{tr.process.title} <em>{tr.process.accent}</em></h2>
        <p>{tr.process.text}</p>
        <Checklist items={requestDetails} />
        <ContactActions location="about-process" />
      </div>
    </section>
    <section className="interior-faq wrap" id="sorular" aria-labelledby="interior-faq-title">
      <div className="interior-copy">
        <p className="interior-kicker">Sık sorulan sorular</p>
        <h2 id="interior-faq-title">{tr.faqHeading.title} <em>{tr.faqHeading.accent}</em></h2>
      </div>
      <div className="interior-faq-list">
        {tr.faq.map(({ question, answer }) => <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>)}
      </div>
    </section>
    <InteriorCta location="about-bottom" />
  </>;
}

function ContactPage() {
  return <section className="interior-split interior-contact wrap" aria-labelledby="interior-contact-title">
    <div className="interior-copy">
      <p className="interior-kicker">{site.city}</p>
      <h2 id="interior-contact-title">{site.name}</h2>
      <p>Çekici veya yol yardım talebiniz için bulunduğunuz konumu, aracın türünü ve yaşadığınız sorunu paylaşın.</p>
      <dl className="interior-contact-list">
        <div>
          <dt><span className="interior-icon"><Icon name="phone" /></span>Telefon</dt>
          <dd><a href={phoneHref} data-event="click_phone" data-location="contact-details">{site.phoneDisplay}</a></dd>
        </div>
        <div>
          <dt><span className="interior-icon"><Icon name="phone" /></span>İkinci telefon</dt>
          <dd><a href={secondaryPhoneHref} data-event="click_phone" data-location="contact-details-secondary">{site.secondaryPhoneDisplay}</a></dd>
        </div>
        <div>
          <dt><span className="interior-icon"><Icon name="location" /></span>Hizmet bölgesi</dt>
          <dd>{site.city}</dd>
        </div>
      </dl>
      <ContactActions location="contact-page" />
    </div>
    <div className="contact-media">
      <JobPhoto name="storefront" />
      <MapPanel />
    </div>
  </section>;
}

function PrivacyPage() {
  return <section className="interior-privacy wrap" aria-labelledby="interior-privacy-title">
    <h2 id="interior-privacy-title">İletişim bağlantıları ve analitik</h2>
    <p>{tr.privacy.body}</p>
    <a className="button button-secondary" href="/iletisim/">İletişim bilgileri <Icon name="arrow" /></a>
  </section>;
}

export function InteriorPage({ route }: { route: Route }) {
  return <>
    <PageHeading route={route} />
    {route.path === '/hizmetler/' && <ServicesPage />}
    {route.path === '/neden-biz/' && <AboutPage />}
    {route.path === '/iletisim/' && <ContactPage />}
    {route.path === '/gizlilik/' && <PrivacyPage />}
  </>;
}
