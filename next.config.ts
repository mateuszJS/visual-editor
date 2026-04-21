import type { NextConfig } from 'next'
import webpackConfig from './webpack.config'
import { ip } from 'address'
import path from 'path'
import { withPostHogConfig } from '@posthog/nextjs-config'

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  webpack: webpackConfig,

  outputFileTracingRoot: path.join(__dirname, '../../../'),
  // needed when using npm link @mateuszjs/magic-render
  // outputFileTracingRoot has to point to common parent of both projects

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8788/api/:path*', // Nextjs doesn't support self-signed HTTPS certificate
        // so we stick with http
      },
    ]
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  allowedDevOrigins: [ip()!],
  devIndicators: false,
}

export default withPostHogConfig(nextConfig, {
  personalApiKey: process.env.POSTHOG_API_KEY as string, // Personal API Key
  projectId: process.env.POSTHOG_PROJECT_ID, // Project ID
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})
