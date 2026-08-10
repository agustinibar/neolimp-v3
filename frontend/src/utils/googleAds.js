const CONTACT_CONVERSION_ID = 'AW-17494499890/YIwTCI-ipqQbELLEg5ZB';

let lastConversion = { key: null, at: 0 };

export function trackGoogleAdsContactConversion(source = 'contact') {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;
  const now = Date.now();
  if (lastConversion.key === source && now - lastConversion.at < 1000) return false;
  lastConversion = { key: source, at: now };
  window.gtag('event', 'conversion', { send_to: CONTACT_CONVERSION_ID });
  return true;
}
