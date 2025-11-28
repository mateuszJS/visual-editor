import { setup as setupDevServer } from 'jest-dev-server'

module.exports = async function globalSetup() {
  // @ts-expect-error - we are adding a property to globalThis
  globalThis.servers = await setupDevServer({
    command: 'npx http-server storybook-static -p 6006',
    port: 6006,
    launchTimeout: 30000, // 30 seconds to allow Storybook to load
    usedPortAction: 'kill',
  })
}
