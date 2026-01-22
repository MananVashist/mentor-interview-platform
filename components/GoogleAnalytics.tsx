import { useEffect } from "react";
import { usePathname, useGlobalSearchParams } from "expo-router"; // <--- CHANGE THIS
import { Platform } from "react-native";

const GA_MEASUREMENT_ID = "G-KCF1V5MJK5";

export const GoogleAnalytics = () => {
  const pathname = usePathname();
  const params = useGlobalSearchParams(); // <--- CHANGE THIS

  // 1. Inject the Script (Only runs once on mount)
  useEffect(() => {
    if (Platform.OS !== "web") return;

    if (!document.getElementById("google-analytics")) {
      const script = document.createElement("script");
      script.id = "google-analytics";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement("script");
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          send_page_view: false
        });
      `;
      document.head.appendChild(inlineScript);
    }
  }, []);

  // 2. Track Page Views on Route Change
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const timeoutId = setTimeout(() => {
      if ((window as any).gtag) {
        (window as any).gtag("event", "page_view", {
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