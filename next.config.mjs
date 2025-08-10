import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Add experimental features to help with hydration
  experimental: {
    // This can help with hydration issues
    esmExternals: true,
  },

  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Ensure Three.js works properly
    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    // Handle canvas/WebGL for Three.js
    webpackConfig.externals = webpackConfig.externals || []
    if (isServer) {
      webpackConfig.externals.push({
        canvas: 'canvas',
        jsdom: 'jsdom',
      })
    }

    return webpackConfig
  },

  // Disable static optimization for pages with dynamic content
  // This can help prevent hydration mismatches
  output: 'standalone',
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
