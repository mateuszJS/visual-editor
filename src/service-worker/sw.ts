/* eslint-disable no-restricted-syntax */
/// <reference lib="webworker" />

import { projectRoute, syncProjectData } from './projectData'
import { projectMiniatureRoute, syncProjectMiniatures } from './projectMiniatures'

declare const self: ServiceWorkerGlobalScope

// @ts-expect-error: ignore ts error about __WB_MANIFEST being missing
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resources = self.__WB_MANIFEST // this is just to satisfy workbox

const version = 22

self.addEventListener('install', () => {
  console.log(`================INSTALL V${version}=====================`)
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log(`====================ACTIVE V${version}=====================`)
  event.waitUntil(self.registration?.navigationPreload.enable())
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async (event) => {
  if (event.data === 'CLIENT_CLOSED') {
    event.waitUntil(syncProjectMiniatures())
    event.waitUntil(syncProjectData())
  }
})

self.addEventListener('fetch', (event) => {
  event.respondWith(handleFetch(event))
})

export type ProjectDB = {
  id: string
  updated_at: string
}

async function handleFetch(event: FetchEvent): Promise<Response> {
  const { request } = event
  const { pathname } = new URL(request.url)

  if (pathname.startsWith('/api/project-uploads/') && pathname.endsWith('/miniature')) {
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
