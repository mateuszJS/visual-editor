/* eslint-disable no-restricted-syntax */
/// <reference lib="webworker" />

import { clearProjectData, projectRoute, syncProjectData } from './projectData'
import {
  clearProjectMiniatures,
  projectMiniatureRoute,
  syncProjectMiniatures,
} from './projectMiniatures'
import { getIsMiniature } from './utils'

declare const self: ServiceWorkerGlobalScope

// @ts-expect-error: ignore ts error about __WB_MANIFEST being missing
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resources = self.__WB_MANIFEST // this is just to satisfy workbox

const version = 25

const isTestEnv = 'resetSwEnv' in self
if (!isTestEnv) {
  console.log(`Service Worker: Version ${version} loaded`)
}

self.addEventListener('install', () => {
  console.log(`================INSTALL V${version}=====================`)
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log(`====================ACTIVE V${version}=====================`)
  event.waitUntil(self.registration?.navigationPreload.enable())
  event.waitUntil(self.clients.claim())
})

const broadcast = new BroadcastChannel('sync-data')

broadcast.onmessage = async (event) => {
  if (event.data === 'SYNC_PROJECT_DATA_START') {
    const fullSuccess = await syncProjectData()
    if (!fullSuccess) {
      broadcast.postMessage({ type: 'SYNC_PROJECT_DATA_ERROR' })
    }
  } else if (event.data === 'SYNC_PROJECT_MINIATURE_START') {
    await syncProjectMiniatures()
  } else if (event.data === 'CLEAR_PROJECT') {
    await Promise.allSettled([clearProjectData(), clearProjectMiniatures()])
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetch(event))
})

async function handleFetch(event: FetchEvent): Promise<Response> {
  const { request } = event
  const { pathname } = new URL(request.url)

  if (getIsMiniature(pathname)) {
    return projectMiniatureRoute(request, event)
  }

  // The purpose of below logic is to avoid spamming server with PATCH project requests
  // and send PATCH once is a while(e.g. when user leaves page, or update wasn't sent in a long time)
  if (pathname.startsWith('/api/projects/')) {
    const projectId = pathname.split('/')[3]
    return projectRoute(request, projectId, event)
  }
  return fetch(event.request)
}

// If you already know ahead of time where certain content should be fetched from,
// you can bypass the service worker altogether and fetch resources immediately.
// The InstallEvent.addRoutes() method can be used to implement this use case
// and more.
