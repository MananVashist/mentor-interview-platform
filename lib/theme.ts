// lib/theme.ts

export const colors = {
  // Main Brand Colors
  primary: "#11998e",
  primaryDark: "#0F766E",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  border: "#E5E7EB",

  // Typography Colors
  text: {
    main: "#111827", // Gray 900 (Titles)
    body: "#4B5563", // Gray 600 (Paragraphs)
    light: "#6B7280", // Gray 500 (Labels)
    inverse: "#FFFFFF",
  },

  // Gray Scale
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Component Specifics
  badge: {
    bronze: {
      bg: "#FFF7ED",
      text: "#C2410C",
      border: "#FFEDD5",
    }
  },
  
  pricing: {
    greenText: "#10B981",
    greenBg: "#ECFDF5",
    blueIcon: "#3B82F6",
    blueBg: "#EFF6FF",
  }
};

export const typography = {
  fontFamily: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
    extrabold: "Inter_800ExtraBold",
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  }
};

// --- CRITICAL FIX: Export the combined object ---
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export { theme };
export default theme;