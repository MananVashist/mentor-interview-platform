// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for CSS
config.resolver.sourceExts.push('css');

// ============================================
// PRODUCTION OPTIMIZATIONS
// ============================================

// Enable minification for production builds
config.transformer.minifierConfig = {
  keep_classnames: false,
  keep_fnames: false,
  mangle: {
    toplevel: false,
  },
  output: {
    ascii_only: true,
    quote_style: 3,
    wrap_iife: true,
  },
  sourceMap: {
    includeSources: false,
  },
  toplevel: false,
  compress: {
    // Set to true for production
    reduce_funcs: false,
  },
};

// Optimize asset resolution
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  // Add any custom asset extensions here
];

// Enable Hermes for better performance and smaller bundle
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true, // Enable inline requires for smaller bundle
  },
});

// Production-specific settings
if (process.env.NODE_ENV === 'production') {
  // Disable source maps in production for smaller bundle
  config.transformer.minifierConfig.sourceMap = false;
  
  // More aggressive minification
  config.transformer.minifierConfig.compress = {
    ...config.transformer.minifierConfig.compress,
    drop_console: true, // Remove console.log in production
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.debug', 'console.trace'],
  };
}

module.exports = config;