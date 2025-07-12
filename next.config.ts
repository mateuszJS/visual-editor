import type { NextConfig } from 'next'
import webpackConfig from './webpack.config'
import { ip } from 'address'

const nextConfig: NextConfig = {
  webpack: webpackConfig,
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
