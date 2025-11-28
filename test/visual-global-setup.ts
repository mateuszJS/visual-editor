import { setup as setupDevServer } from 'jest-dev-server'

module.exports = async function globalSetup() {
  globalThis.servers = await setupDevServer({
    command: 'npx http-server storybook-static -p 6006',
    port: 6006,
    launchTimeout: 30000, // 30 seconds to allow Storybook to load
    usedPortAction: 'kill',
  })
  // Your global setup
}
