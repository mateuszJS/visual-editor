import type { NextConfig } from 'next'
import webpackConfig from './webpack.config'
import { ip } from 'address'

const nextConfig: NextConfig = {
  output: 'export',
  webpack: webpackConfig,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:8788/api/:path*',
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
