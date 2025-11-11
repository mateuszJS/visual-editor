// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="../src/service-worker/service-worker-mock.d.ts" />

import makeServiceWorkerEnv from 'service-worker-mock'
import { IDBFactory } from 'fake-indexeddb'
import { eraseDbPromise } from '../src/service-worker/db'

// Track all BroadcastChannel instances created during tests
const activeBroadcastChannels: Set<BroadcastChannel> = new Set()

// Override BroadcastChannel constructor to track instances
const OriginalBroadcastChannel = global.BroadcastChannel
class TrackedBroadcastChannel extends OriginalBroadcastChannel {
  constructor(name: string) {
    super(name)
    activeBroadcastChannels.add(this)
  }
}
global.BroadcastChannel = TrackedBroadcastChannel as typeof BroadcastChannel

beforeEach(() => {
  // Close and clear all BroadcastChannel instances from previous tests
  activeBroadcastChannels.forEach((channel) => {
    try {
      channel.close()
    } catch (e) {
      // Ignore errors from already-closed channels
    }
  })
  activeBroadcastChannels.clear()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { BroadcastChannel, indexedDB, ...env } = makeServiceWorkerEnv() as ReturnType<
    typeof makeServiceWorkerEnv
  > & {
    BroadcastChannel: unknown
    indexedDB: IDBFactory
  } // Broadcast from jsdom works fine,
  // but that one from service-worker-mock does not send/receive messages

  Object.assign(global, env)
  // Whenever you want a fresh indexedDB
  jest.resetModules()
  eraseDbPromise()
  global.self.indexedDB = new IDBFactory()
  global.Response.json = function json(data: unknown, options?: ResponseInit) {
    return new Response(JSON.stringify(data), {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
    })
  }
})
