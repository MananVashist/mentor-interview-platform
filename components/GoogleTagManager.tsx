// components/GoogleTagManager.tsx
import { useEffect } from "react";
import { usePathname, useGlobalSearchParams } from "expo-router";
import { Platform } from "react-native";

const GTM_ID = "GTM-WCMZH59K"; // Your GTM ID from the screenshot

export const GoogleTagManager = () => {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  // 1. Inject the GTM Script (Runs once on mount)
  useEffect(() => {
    if (Platform.OS !== "web") return;

    if (!document.getElementById("google-tag-manager")) {
      const script = document.createElement("script");
      script.id = "google-tag-manager";
      script.async = true;
      // The "Brain" of GTM
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `;
      document.head.appendChild(script);
    }
  }, []);

  // 2. Track Page Views (Pushes data to GTM on route change)
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const timeoutId = setTimeout(() => {
      // We push a "virtual" page view to the Data Layer
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "page_view",
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname, params]);

  return null;
};