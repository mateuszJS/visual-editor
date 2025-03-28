import type { NextConfig } from 'next'
import webpackConfig from './webpack.config'

const nextConfig: NextConfig = {
  webpack: webpackConfig,
  experimental: {
    // typedRoutes: true,
    // https://nextjs.org/docs/app/api-reference/config/typescript#statically-typed-links
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
}

export default nextConfig
