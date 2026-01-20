import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    domains: [], // Add external image domains if needed
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion'
    ],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // React compiler (when stable)
  reactCompiler: false, // Enable when React Compiler is stable
  
  // Output file tracing
  output: 'standalone',
};

export default nextConfig;
