import Script from "next/script";
import type { AnalyticsSettings } from "@/lib/types";

export function GtmHeadScript({ gtmId }: { gtmId: AnalyticsSettings["gtmId"] }) {
  if (!gtmId) return null;
  return (
    <Script id="gtm-head" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
    </Script>
  );
}

export function GtmBodyNoscript({ gtmId }: { gtmId: AnalyticsSettings["gtmId"] }) {
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

export function MetaPixelScript({ metaPixelId }: { metaPixelId: AnalyticsSettings["metaPixelId"] }) {
  if (!metaPixelId) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
    </Script>
  );
}

export function MetaPixelNoscript({ metaPixelId }: { metaPixelId: AnalyticsSettings["metaPixelId"] }) {
  if (!metaPixelId) return null;
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element -- Meta's noscript pixel requires a plain img tag */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
