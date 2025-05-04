import type { NextConfig } from 'next'
import webpackConfig from './webpack.config'

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
}

export default nextConfig
