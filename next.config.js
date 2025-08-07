/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output export - it causes issues with dynamic routes
  // output: 'export',
  output: 'standalone',
  // Experimental features

  
  // Image optimization disabled for Cloudflare compatibility
  images: {
    unoptimized: true,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  // Webpack configuration for Cloudflare compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Add polyfill for 'self' in server environment
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },

  // Skip build-time optimizations that might cause issues
  optimizeFonts: false,
  
  // Static generation config
  generateStaticParams: false,
  
  // Headers for CORS and security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
