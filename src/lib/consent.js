/**
 * src/lib/consent.js
 *
 * Cookie backed consent state. Client only.
 * Cookie: cf_consent = JSON { state, categories, ts }
 *   state: 'pending' | 'granted' | 'rejected' | 'customized'
 */

const COOKIE = 'cf_consent';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const DEFAULT_CATEGORIES = { strictly_necessary: true, analytics: false, marketing: false };

export function readConsent() {
  if (typeof document === 'undefined') return { state: 'pending', categories: DEFAULT_CATEGORIES };
  // Global Privacy Control header is honored as an opt out.
  if (navigator.globalPrivacyControl === true) {
    return { state: 'rejected', categories: DEFAULT_CATEGORIES, gpc: true };
  }
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  if (!m) return { state: 'pending', categories: DEFAULT_CATEGORIES };
  try {
    const parsed = JSON.parse(decodeURIComponent(m[1]));
    if (!parsed.state) throw new Error('bad');
    return { state: parsed.state, categories: { ...DEFAULT_CATEGORIES, ...(parsed.categories || {}) } };
  } catch {
    return { state: 'pending', categories: DEFAULT_CATEGORIES };
  }
}

export function writeConsent(state, categories) {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify({ state, categories, ts: Date.now() }));
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent('cf-consent-changed', { detail: { state, categories } }));
}

export function marketingAllowed(consent) {
  if (!consent) return false;
  return consent.state === 'granted' || (consent.state === 'customized' && consent.categories?.marketing === true);
}

export function analyticsAllowed(consent) {
  if (!consent) return false;
  return consent.state === 'granted' || (consent.state === 'customized' && consent.categories?.analytics === true);
}
