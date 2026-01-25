// components/GoogleTagManager.tsx
import { useEffect } from "react";
import { usePathname, useGlobalSearchParams } from "expo-router";
import { Platform } from "react-native";

const GTM_ID = "GTM-WCMZH59K";

export const GoogleTagManager = () => {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  // 1. Initialize dataLayer FIRST (before GTM script)
  useEffect(() => {
    if (Platform.OS !== "web") return;

    // Initialize dataLayer as early as possible
    if (typeof window !== "undefined" && !window.dataLayer) {
      window.dataLayer = [];
    }
  }, []);

  // 2. Inject the GTM Script (Runs once on mount)
  useEffect(() => {
    if (Platform.OS !== "web") return;

    if (!document.getElementById("google-tag-manager")) {
      const script = document.createElement("script");
      script.id = "google-tag-manager";
      script.async = true;
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `;
      document.head.appendChild(script);
      
      // Debug log
      console.log('GTM initialized with ID:', GTM_ID);
    }
  }, []);

  // 3. Track Page Views on route change
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    const timeoutId = setTimeout(() => {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: "page_view",
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
        
        // Debug log
        console.log('Page view tracked:', pathname);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname, params]);

  return null;
};