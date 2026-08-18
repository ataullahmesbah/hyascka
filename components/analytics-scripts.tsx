// FILE: components/analytics-scripts.tsx
// PURPOSE: Conditionally injects tracking scripts based on real,
// database-backed SiteSettings toggles (PRD section 18). When a given
// integration is disabled, its script is never rendered at all — not
// just hidden. Server component: reads SiteSettings directly, no client
// fetch needed. Rendered once from app/layout.tsx.
//
// Meta Conversions API (metaCapiEnabled/metaCapiAccessToken) has no
// client-side script — it's a server-to-server event API. The setting
// is stored and the token is protected (never returned by the dashboard
// settings GET route), but the actual server-to-server event dispatch
// call is a separate integration this pass does not implement — there is
// no real Meta Business event payload to send without a live ad account
// to test against, and shipping unverified dispatch code would be worse
// than not shipping it.
import Script from 'next/script';
import { prisma } from '@/lib/prisma';

export async function AnalyticsScripts() {
  const settings = await prisma.siteSettings.findFirst({
    select: {
      fbPixelId: true, fbPixelEnabled: true,
      gtmContainerId: true, gtmEnabled: true,
      ga4MeasurementId: true, ga4Enabled: true,
      clarityProjectId: true, clarityEnabled: true,
    },
  });

  if (!settings) return null;

  return (
    <>
      {settings.gtmEnabled && settings.gtmContainerId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtmContainerId}');`}
        </Script>
      )}

      {settings.ga4Enabled && settings.ga4MeasurementId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4MeasurementId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${settings.ga4MeasurementId}');`}
          </Script>
        </>
      )}

      {settings.fbPixelEnabled && settings.fbPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${settings.fbPixelId}');fbq('track', 'PageView');`}
        </Script>
      )}

      {settings.clarityEnabled && settings.clarityProjectId && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window, document, "clarity", "script", "${settings.clarityProjectId}");`}
        </Script>
      )}
    </>
  );
}
