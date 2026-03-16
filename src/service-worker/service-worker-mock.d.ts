declare module 'service-worker-mock' {
  function makeServiceWorkerEnv(): WorkerGlobalScope

  namespace makeServiceWorkerEnv {
    interface Caches {
      [key: string]: Record<string, Response>
    }

    type Listeners = Map<keyof ServiceWorkerGlobalScopeEventMap, EventListener>

    interface Snapshot {
      /**
       * A key/value map of current cache contents.
       */
      caches: Caches

      /**
       * A list of active clients.
       */
      clients: Client[]

      /**
       * A list of active notifications.
       */
      notifications: Notification[]
    }
  }

  export = makeServiceWorkerEnv
}
