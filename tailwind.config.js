/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
        extrabold: ['Inter_800ExtraBold'],
      },
      colors: {
        primary: "#11998e", 
        primaryDark: "#0F766E",
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
        bronze: {
          bg: "#FFF7ED",
          text: "#C2410C",
          border: "#FFEDD5",
        },
        success: "#10B981",
        successBg: "#ECFDF5",
        infoBg: "#EFF6FF",
        infoIcon: "#3B82F6",
      }
    },
  },
  plugins: [],
}