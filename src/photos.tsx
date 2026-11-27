import React from 'react';

const photos = {
  storefront: ['burakbey-isletme', 'Burakbey Oto Kurtarma tabelasının önündeki beyaz çekici'],
  panelVan: ['platform-panelvan', 'Platform çekicinin kasasında beyaz panelvan'],
  ambulance: ['ozel-arac-ambulans', 'Platform çekicide taşınan beyaz ambulans'],
  coupe: ['beyaz-coupe', 'Beyaz platform çekicinin kasasında beyaz otomobil'],
  nightTransport: ['gece-kirmizi-cekici', 'Gece sokakta otomobil taşıyan kırmızı çekici'],
  yellowVan: ['sari-panelvan', 'Beyaz çekicide taşınan sarı panelvan', 720, 960],
  minibus: ['siyah-minibus', 'Siyah minibüs taşıyan beyaz çekici', 720, 960],
  rainyStreet: ['yagmurlu-sokak', 'Yağmurlu sokakta koyu renk otomobil taşıyan kırmızı çekici'],
  rainyAngle: ['kirmizi-cekici-sag', 'Islak yolda sağ önden görünen kırmızı çekici ve taşıdığı otomobil'],
  dusk: ['aksam-arac-tasima', 'Akşamüstü otomobil taşıyan kırmızı çekici'],
  lightCommercial: ['beyaz-hafif-ticari', 'Kırmızı çekicinin kasasında beyaz hafif ticari araç']
} as const;

export type PhotoName = keyof typeof photos;

export function JobPhoto({ name, decorative = false }: { name: PhotoName; decorative?: boolean }) {
  const [file, alt, width = 960, height = 720] = photos[name];
  return <img src={'/images/' + file + '.webp'} alt={decorative ? '' : alt} width={width} height={height} loading="lazy" decoding="async" draggable={false} />;
}
