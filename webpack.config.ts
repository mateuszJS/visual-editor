import type { Configuration, RuleSetRule } from 'webpack'
import { InjectManifest } from 'workbox-webpack-plugin'

/* tis config is shared between next.config.ts and .storybook/main.ts */
export default function webpackConfig(config: Configuration) {
  // Grab the existing rule that handles SVG imports
  const existingSvgRule = (config.module!.rules as RuleSetRule[]).find((rule) =>
    (rule.test as RegExp)?.test?.('.svg')
  )

  if (existingSvgRule) {
    config.module!.rules!.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...existingSvgRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      }
    )
    // all the snippets recommended to add exclude instead of removing the rule from webpack config
    existingSvgRule.exclude = /\.svg$/i
  }

  config.module!.rules!.push(
    // Convert all other *.svg imports to React components
    {
      test: /\.svg$/i,
      issuer: existingSvgRule?.issuer,
      resourceQuery: {
        // type of a rule with "resourceQuery" is not exposed, and TS still has issue with optional caning
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        not: [...((existingSvgRule?.resourceQuery as any)?.not ?? []), /url/],
      }, // exclude if *.svg?url
      use: ['@svgr/webpack'],
    }
  )

  config.plugins!.push(
    new InjectManifest({
      swSrc: './src/service-worker/index.ts',
      swDest: '../public/sw.js',
      include: ['__nothing__'],
    })
  )

  return config
}
