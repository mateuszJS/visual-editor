import { useEffect } from 'react'
import { proxyMap } from 'valtio/utils'
import { proxy, useSnapshot } from 'valtio'
import { ApiTemplateMetaData } from '../../../apiTypes'
import fetcher from '@/utils/fetcher'
import { captureError } from '@/utils/captureError'

export const templatesListStore = proxy({
  initialized: false,
  loading: false,
  error: null as null | string,
  templates: proxyMap<string, ApiTemplateMetaData>(),
})

export async function initializeTemplatesList() {
  if (templatesListStore.loading) return

  templatesListStore.initialized = true
  templatesListStore.loading = true
  templatesListStore.error = null

  const response = await fetcher<ApiTemplateMetaData[]>('/api/templates')
  templatesListStore.loading = false

  if ('err' in response) {
    templatesListStore.error = response.err || "Couldn't fetch templates. Please try again."
    captureError(response.err)
    return
  }

  response.json.toSorted(sortTempsByCreatedAt).forEach((project) => {
    templatesListStore.templates.set(project.id, project)
  })
  templatesListStore.error = null
}

export function useTemplatesList() {
  const { error, loading, templates, initialized } = useSnapshot(templatesListStore)

  useEffect(() => {
    const intervalId = setInterval(
      initializeTemplatesList,
      1000 * 60 * 60 * 12 /* every 12 horus */
    )

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return {
    loading: initialized === false || loading,
    error,
    templatesList: templates,
  }
}

function sortTempsByCreatedAt(a: ApiTemplateMetaData, b: ApiTemplateMetaData) {
  if (a.createdAt < b.createdAt) return 1
  if (a.createdAt > b.createdAt) return -1
  return 0
}
