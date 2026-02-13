/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),
  
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
}

module.exports = nextConfig