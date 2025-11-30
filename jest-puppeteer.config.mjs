/* this is EcmaScript module(.mjs) on purpose, when it was a TS file there was an error occurring like once per 1000 runs:
 TypeScript Error in /visual-editor/jest-puppeteer.config.ts:
    Cannot find module '/visual-editor/jest-puppeteer.config.mjs'
    imported from /visual-editor/node_modules/jest-environment-puppeteer/node_modules/cosmiconfig/dist/loaders.js
    */

const config = {
  server: {
    command: 'npx http-server storybook-static -p 6006',
    port: 6006,
    launchTimeout: 30000, // 30 seconds to allow Storybook to load
    usedPortAction: 'kill',
    // debug: true,
  },
  launch: {
    headless: true,
    args: ['--no-sandbox'], // fails to run chrome on ubuntu-latest with sandbox
    // as long as we trust the content of the pages we render, we should be fine without the sandbox
  },
}

export default config
