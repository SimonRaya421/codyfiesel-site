'use client';

/**
 * Loads Meta Pixel and/or Google Tag Manager only after the visitor grants
 * marketing consent (or analytics for GTM). Nothing loads before that.
 *
 * Env (public, baked at build):
 *   NEXT_PUBLIC_META_PIXEL_ID  — Cody's pixel (he runs the Meta ads)
 *   NEXT_PUBLIC_GTM_ID         — optional GTM container
 */

import { useEffect, useRef } from 'react';
import { readConsent, marketingAllowed, analyticsAllowed } from '../lib/consent';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

function injectMetaPixel() {
  if (!PIXEL_ID || window.fbq) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

function injectGTM() {
  if (!GTM_ID || window.__gtmLoaded) return;
  window.__gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

export default function Pixels() {
  const done = useRef({ meta: false, gtm: false });

  useEffect(() => {
    function apply() {
      const consent = readConsent();
      if (!done.current.meta && marketingAllowed(consent)) { injectMetaPixel(); done.current.meta = true; }
      if (!done.current.gtm && (analyticsAllowed(consent) || marketingAllowed(consent))) { injectGTM(); done.current.gtm = true; }
    }
    apply();
    window.addEventListener('cf-consent-changed', apply);
    return () => window.removeEventListener('cf-consent-changed', apply);
  }, []);

  return null;
}
