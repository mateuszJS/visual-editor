import type { NextConfig } from 'next'
import webpackConfig from './webpack.config'
import { ip } from 'address'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'export',
  webpack: webpackConfig,

  outputFileTracingRoot: path.join(__dirname, '../../../'),
  // needed when using npm link @mateuszjs/magic-render
  // outputFileTracingRoot has to point to common parent of both projects

  async rewrites() {
    return [
      {
        source: '/project/:id',
        destination: '/project/[-id]',
      },
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

export default nextConfig
