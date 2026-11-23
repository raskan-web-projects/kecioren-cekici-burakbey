import React, { useRef, useState } from 'react';
import { tr } from './content/tr';
import { site } from './site';
import { ContactActions, Icon, MapPanel, phoneHref, ServiceIcon } from './site-parts';

const scenarios = [
  { service: tr.services[0], photo: 'flatbed-car.webp', alt: 'Platform çekicide taşınan bir otomobil', width: 900, height: 600 },
  { service: tr.services[2], photo: 'battery-assist.webp', alt: 'Kabloları bağlı bir otomobil aküsünün yakın görünümü', width: 900, height: 600 },
  { service: tr.services[4], photo: 'motorcycle-transport.webp', alt: 'Taşıma römorkuna kayışlarla sabitlenmiş bir motosiklet', width: 960, height: 637 }
] as const;
const highlights = [
  [tr.services[0], 'Arızalı araç taşıma'],
  [tr.services[1], 'Konuma göre destek'],
  [tr.services[2], 'Çalışmayan araç için destek'],
  [tr.services[3], 'Araca uygun kasa seçimi'],
  [tr.services[4], 'Motosiklet taşıma'],
  [tr.services[6], 'Şehirler arası taşıma']
] as const;

function ServiceShowcase() {
  const [selected, select] = useState(0);
  const startX = useRef<number | null>(null);
  const move = (step: number) => select((current) => (current + step + scenarios.length) % scenarios.length);
  const { service } = scenarios[selected];
  const photos = [
    scenarios[(selected + scenarios.length - 1) % scenarios.length],
    scenarios[selected],
    scenarios[(selected + 1) % scenarios.length]
  ];

  return <section className="showcase" aria-labelledby="showcase-title">
    <div className="wrap showcase-inner">
      <div className="center-heading"><h2 id="showcase-title">Aracınıza uygun <em>yol yardımı</em></h2></div>
      <div className="showcase-stage" onPointerDown={(event) => { startX.current = event.clientX; }} onPointerCancel={() => { startX.current = null; }} onPointerUp={(event) => {
        if (startX.current !== null && Math.abs(event.clientX - startX.current) > 45) move(event.clientX < startX.current ? 1 : -1);
        startX.current = null;
      }}>
        <div className="showcase-photos">
          {photos.map(({ service: item, photo, alt, width, height }, index) => {
            const active = index === 1;
            return <div key={item.id} className={active ? 'showcase-photo is-active' : 'showcase-photo'} aria-hidden={active ? undefined : true}>
              <img src={'/images/' + photo} alt={active ? alt : ''} width={width} height={height} loading="lazy" decoding="async" draggable={false} />
            </div>;
          })}
        </div>
        <button className="showcase-prev" aria-label="Önceki hizmet" type="button" onClick={() => move(-1)}>‹</button>
        <button className="showcase-next" aria-label="Sonraki hizmet" type="button" onClick={() => move(1)}>›</button>
      </div>
      <div className="showcase-copy" aria-live="polite">
        <h3>{service.title}</h3><p>{service.text}</p>
        <a className="text-link" href={'/hizmetler/#' + service.id}>Hizmeti incele <Icon name="arrow" /></a>
      </div>
      <div className="showcase-controls" role="group" aria-label="Vitrindeki hizmetler">
        {scenarios.map(({ service: item }, index) => <button key={item.id} type="button" onClick={() => select(index)} aria-pressed={index === selected}>{item.title}</button>)}
      </div>
      <details className="photo-credit">
        <summary>Temsili fotoğrafların kaynakları</summary>
        <p>Çekici: <a href="https://unsplash.com/photos/HZ_6ktzQWZ0">fr0ggy5</a>. Oto kurtarma: <a href="https://unsplash.com/photos/iJGax56o5yU">Ali Ananta</a>. Akü: <a href="https://unsplash.com/photos/E4Oz0TZUDe8">Wesley Tingey</a>. Bu üç fotoğraf <a href="https://unsplash.com/license">Unsplash Lisansı</a> kapsamında kullanılmıştır.</p>
        <p>Motosiklet taşıma: <a href="https://commons.wikimedia.org/wiki/File:Open_motorcycle_trailer_with_motorcycle.jpg">Jeffrey M Dean, Wikimedia Commons</a>. WebP sürümü <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a> lisansıyla sunulur.</p>
      </details>
    </div>
  </section>;
}

export function HomePage() {
  return <>
    <section className="hero-stage" id="top" aria-labelledby="hero-title">
      <div className="hero-inner wrap">
        <div className="hero-copy">
          <p className="eyebrow"><Icon name="location" /> {site.city}</p>
          <h1 id="hero-title">Keçiören’de çekici <br /><em>ve yol yardım.</em></h1>
          <p className="hero-lede">{tr.hero.description}</p>
          <ContactActions location="hero" />
        </div>
        <div className="hero-visual">
          <div className="hero-art">
            <img src="/images/hero-tow.webp" srcSet="/images/hero-tow-mobile.webp 900w, /images/hero-tow.webp 2000w" sizes="(max-width: 760px) 100vw, 54vw" alt="Yolda otomobil taşıyan platform çekici" width="2000" height="1145" fetchPriority="high" />
          </div>
          <a className="hero-call-card" href={phoneHref} data-event="click_phone" data-location="hero-card">
            <span className="call-icon"><Icon name="phone" /></span>
            <span><small>Burak Bey’i ara</small><strong>{site.phoneDisplay}</strong></span><Icon name="arrow" />
          </a>
        </div>
      </div>
    </section>
    <section className="quick-services wrap" id="hizmetler" aria-label="Çekici ve yol yardım hizmetleri">
      {highlights.map(([service, summary]) => <a key={service.id} id={service.id} href={'/hizmetler/#' + service.id}>
        <span className="quick-icon"><ServiceIcon id={service.id} /></span><span className="quick-copy"><strong>{service.title}</strong><small>{summary}</small></span><Icon name="arrow" className="quick-arrow" />
      </a>)}
    </section>
    <ServiceShowcase />
    <section className="home-process wrap" id="surec">
      <div className="process-visual" aria-hidden="true"><Icon name="location" /><Icon name="car" /><Icon name="phone" /></div>
      <div>
        <p className="eyebrow">Yol yardım süreci</p><h2>Yardım isterken <em>neyi paylaşmalısınız?</em></h2>
        <p>Bulunduğunuz yeri, araç türünü ve yaşadığınız sorunu anlatın. Taşıma gerekiyorsa varış noktasını da belirtin.</p>
        <ul className="home-checks"><li><Icon name="check" /> Konum ve araç türü</li><li><Icon name="check" /> Arıza veya taşıma ihtiyacı</li><li><Icon name="check" /> Varsa varış noktası</li></ul>
        <a className="text-link" id="ozel-arac-cekici" href="/hizmetler/#ozel-arac-cekici">Özel araç taşıma <Icon name="arrow" /></a>
        <a className="text-link" id="sorular" href="/neden-biz/#sorular">Sık sorulanları okuyun <Icon name="arrow" /></a>
      </div>
    </section>
    <section className="home-cta wrap">
      <div className="cta-panel">
        <span className="call-icon"><Icon name="phone" /></span>
        <div><h2>Yolda mı kaldınız?</h2><p>Konumunuzu paylaşın, aracınıza uygun desteği görüşelim.</p></div>
        <ContactActions location="home-callout" />
      </div>
    </section>
    <section className="contact-scene" id="iletisim">
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <p className="eyebrow">İletişim</p><h2>Keçiören’de <em>Burak Bey’e ulaşın.</em></h2>
          <p>{site.city} ve aracınıza uygun yardım seçeneği için doğrudan iletişime geçin.</p>
          <ContactActions location="home-contact" />
          <a className="text-link" href="/iletisim/">İletişim bilgileri <Icon name="arrow" /></a>
        </div>
        <MapPanel />
      </div>
    </section>
  </>;
}
