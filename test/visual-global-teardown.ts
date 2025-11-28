import { teardown as teardownDevServer } from 'jest-dev-server'

module.exports = async function globalTeardown() {
  // @ts-expect-error - we are adding a property to globalThis
  await teardownDevServer(globalThis.servers)
}
