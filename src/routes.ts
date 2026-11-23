import { tr } from './content/tr';

export const routes = [
  {
    path: '/',
    label: 'Ana Sayfa',
    title: tr.pageTitle,
    description: tr.description,
    h1: 'Keçiören Çekici Burak Bey'
  },
  {
    path: '/hizmetler/',
    label: 'Hizmetler',
    title: 'Çekici ve Yol Yardım Hizmetleri | Keçiören Burak Bey',
    description: 'Keçiören’de oto kurtarma, akü takviyesi, motosiklet taşıma, kayar kasa ve sabit kasa çekici seçeneklerini inceleyin. Uzun yol taşıma için bilgi alın.',
    h1: 'Çekici ve Yol Yardım Hizmetleri'
  },
  {
    path: '/neden-biz/',
    label: 'Neden Biz?',
    title: 'Çekici Desteği Nasıl Planlanır? | Keçiören Burak Bey',
    description: 'Keçiören’de çekici çağırırken konum, araç türü ve varış noktasını nasıl paylaşacağınızı öğrenin. Burak Bey ile uygun taşıma seçeneğini doğrudan görüşün.',
    h1: 'Çekici Desteğini Nasıl Planlıyoruz?'
  },
  {
    path: '/iletisim/',
    label: 'İletişim',
    title: 'Keçiören Çekici İletişim ve Konum | Burak Bey Ankara',
    description: 'Keçiören, Ankara’da çekici ve yol yardım için Burak Bey’e 0539 730 16 47 numarasından ulaşın. WhatsApp veya telefonla konum ve araç bilgilerini paylaşın.',
    h1: 'Keçiören Çekici Burak Bey İletişim'
  },
  {
    path: '/gizlilik/',
    label: 'Gizlilik',
    title: 'Gizlilik ve Site Kullanımı | Keçiören Çekici Burak Bey',
    description: 'Keçiören Çekici Burak Bey sitesinde telefon ve WhatsApp bağlantılarının nasıl çalıştığını, analitik ölçüm tercihlerini ve gizlilik bilgilerini okuyun.',
    h1: 'Gizlilik ve Site Kullanımı'
  }
] as const;

export type Route = (typeof routes)[number];

export function getRoute(pathname: string): Route | undefined {
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  return routes.find((route) => route.path === path);
}
