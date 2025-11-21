// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable support for .mjs files (often used by libraries with import.meta)
config.resolver.sourceExts.push('mjs');

module.exports = config;