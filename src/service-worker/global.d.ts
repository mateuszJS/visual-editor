export {}

declare global {
  /**
   * A key/value map of active listeners (`install`/`activate`/`fetch`/etc).
   */
  const listeners: makeServiceWorkerEnv.Listeners

  /**
   * Used to trigger active listeners.
   */
  function trigger(name: 'fetch', request: string | Request): Promise<Response>
  function trigger(type: keyof ServiceWorkerGlobalScopeEventMap): Promise<void>
  function trigger(
    name: 'notificationclick' | 'notificationclose',
    args: Notification
  ): Promise<void>
  function trigger(name: 'push', args: Partial<PushEvent>): Promise<void>
  function trigger(name: 'message', args: Partial<MessageEvent>): Promise<void>

  /**
   * Used to generate a snapshot of the service worker internals.
   */
  function snapshot(): makeServiceWorkerEnv.Snapshot

  interface WorkerGlobalScope {
    listeners: typeof listeners
    trigger: typeof trigger
    snapshot: typeof snapshot
  }
}
