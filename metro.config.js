// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for CSS
config.resolver.sourceExts.push('css');

// ✅ Ensure font files are included in web builds
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');

// ✅ PERFORMANCE OPTIMIZATION: Inline requires for lazy loading
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;