'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

/**
 * tawk.to live chat for site visitors. Off unless NEXT_PUBLIC_TAWK_PROPERTY_ID
 * is set (widget id defaults to "default"). Loads after the page is idle so it
 * never competes with the landing's 3D scene, and stays off the /dev pages
 * that headless Chrome shoots for share images.
 */
const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || 'default'

export function TawkChat() {
  const pathname = usePathname()
  if (!PROPERTY_ID || pathname.startsWith('/dev')) return null

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();
        (function () {
          var s = document.createElement('script');
          s.async = true;
          s.src = 'https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}';
          s.charset = 'UTF-8';
          s.setAttribute('crossorigin', '*');
          document.body.appendChild(s);
        })();
      `}
    </Script>
  )
}
