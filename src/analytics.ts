declare global { interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] } }

const measurementId = import.meta.env.VITE_GA_ID?.trim();
const consentKey = 'burakbey-analytics-consent';

export function analyticsConsent() {
  try { return localStorage.getItem(consentKey); } catch { return null; }
}

export function setAnalyticsConsent(value: 'granted' | 'denied') {
  try { localStorage.setItem(consentKey, value); } catch { /* storage may be disabled */ }
  if (value === 'granted') loadAnalytics();
  window.gtag?.('consent', 'update', { analytics_storage: value });
  window.dispatchEvent(new CustomEvent('analytics-consent-change'));
}

function loadAnalytics() {
  if (!measurementId || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer!.push(args);
  window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
  window.gtag('consent', 'update', { analytics_storage: 'granted' });
}

export function initializeAnalytics() {
  if (measurementId && analyticsConsent() === 'granted') loadAnalytics();
}

export function track(name: string, location: string) {
  if (!measurementId || analyticsConsent() !== 'granted') return;
  window.gtag?.('event', name, { page_path: location === 'sticky' ? window.location.pathname : window.location.pathname, cta_location: location, language: 'tr' });
  if (['click_phone', 'click_whatsapp', 'click_email'].includes(name)) window.gtag?.('event', 'generate_lead', { page_path: window.location.pathname, cta_location: location, language: 'tr' });
}
