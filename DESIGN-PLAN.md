# Tasarım uygulama planı

**Yön:** “Gece yol yardım noktası” — grafit katmanlar, sıcak sarı uyarı ışığı, teknik çizim izleri ve yüksek kontrastlı tipografi. Renk aksanı küçük alanlarda kalacak; Manrope başlık/gövde, DM Mono teknik etiket ve numaralarda kullanılacak.

## Görsel akış

1. **Üst gezinme:** koyu zeminde kompakt marka imzası, Hizmetler/Süreç/Sorular bağlantıları ve belirgin ara CTA’sı. Telefonda aynı gezinme tam genişlikli, klavyeyle açılıp kapanan bir menüye dönüşür.
2. **Hero:** asimetrik metin + özgün platform çekici/otomobil SVG sahnesi. İnce yol çizgileri, düşük opaklıklı teknik grid ve kontrollü sarı ışık kullanılır. Başlık Keçiören ve hizmet türünü ilk ekranda söyler; arama ve WhatsApp erişilebilir CTA’lardır.
3. **Hızlı hizmet şeridi:** hero alt kenarına bağlanan, eşit olmayan ağırlıkta kısa hizmet bağlantıları; kartlar gerçek hizmet başlıklarına ve sayfa içi hedeflerine gider.
4. **Hizmet listesi:** açık-koyu katmanlı, geniş yatay hizmet satırları; her satır özgün, cevap odaklı metin ve doğrudan iletişim bağlantısı içerir. Stok fotoğraf ve kanıtsız filo/varış iddiası kullanılmaz.
5. **İmza sahnesi:** çekici ve araç illüstrasyonunu geniş yatay kompozisyonda tekrar merkezler. Yanındaki içerik araç türü, konum ve varış noktası bilgisinin nasıl planlamayı kolaylaştırdığını açıklar; bunlar işletme performans iddiası gibi sunulmaz.
6. **Süreç ve güven:** üç gerçek iletişim adımı; sayaç/yorum/puan yerine kullanıcının arama sırasında vereceği bilgiler. Her adımın CTA’sı ara bağlantısına çıkar.
7. **SSS ve kapanış:** gerçek arama niyetlerini yanıtlayan SSS, ardından Keçiören/Ankara bağlamı, harita yerleştirmesi, telefon ve yol tarifiyle koyu iletişim sahnesi.
8. **Alt bilgi:** işletme adı, Keçiören/Ankara, telefon, Maps bağlantısı, gizlilik açıklaması ve RASKAN logosu.

## Uygulama ve kalite ölçütleri

- Tek gerçek işletme varlığı kullanıcıdan gelen ad/telefon/WhatsApp/Maps bağlantısıdır. Özgün SVG teknik illüstrasyondur; gerçek araç, çalışan veya fotoğraf olduğu iddia edilmez.
- Mobil düzen 390 px genişlikte yeniden kurulur; sticky iletişim düğmesi, safe-area alt boşluğu ve en az 44 px dokunma alanı korunur.
- Görsel hareket kısa ve dekoratiftir; içerik animasyon olmadan görünür, `prefers-reduced-motion` hareketi kapatır.
- Metin ve kontrol kontrastı WCAG AA hedefiyle doğrulanır. CTA/anchor hedefleri, klavye odağı ve menü Escape davranışı kontrol edilir.
- SEO tek sayfalı mimariyi korur: araştırma ayrı URL ihtiyacını doğrulamadı. Tek H1, hizmet H2/H3’leri, tutarlı title/description/canonical/hreflang/schema, sitemap, robots, llms, noindex ve tam HTML yeniden kontrol edilir.
