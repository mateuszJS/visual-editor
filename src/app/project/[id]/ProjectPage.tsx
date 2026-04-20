'use client'

import { useEffect } from 'react'
import useProject from '@/hooks/useProject/useProject'
import OverlayLoader from '@/components/OverlayLoader/OverlayLoader'
import CreatorView from '@/components/CreatorView/CreatorView'
import CreatorNav from '@/components/CreatorNav/CreatorNav'
import CreatorToolbox from '@/components/CreatorToolbox/CreatorToolbox'
import CreatorPanels from '@/components/CreatorPanels/CreatorPanels'
import useProjectId from '@/hooks/useProjectId/useProjectId'
import disablePageZoom from '@/utils/disablePageZoom'
import { alternativeMiniatureUpdate } from '@/hooks/useCreator/uploadMiniature'
import { alternativeProjectUpdate } from '@/hooks/useCreator/updateProject'

export default function Project() {
  const id = useProjectId()
  const { loading, project } = useProject(id)

  useEffect(() => {
    // we could avoid it when SW doens't exist, but it's nearly 0 cost
    const broadcast = new BroadcastChannel('sync-data')
    const intervalId = setInterval(
      () => {
        broadcast.postMessage('SYNC_PROJECT_DATA_START')
      },
      2 * 60 * 1000
    ) // every 2 minutes

    return () => {
      clearInterval(intervalId)
      broadcast.postMessage('SYNC_PROJECT_DATA_START')
      broadcast.postMessage('SYNC_PROJECT_MINIATURE_START')
      broadcast.close()

      // handle case when there was no service worker
      alternativeMiniatureUpdate()
      alternativeProjectUpdate()
    }
  }, [])

  useEffect(() => {
    const controller = disablePageZoom()
    return () => {
      controller.abort()
    }
  }, [])

  return (
    <>
      <OverlayLoader loading={loading} />
      <CreatorNav />
      {project && <CreatorView project={project} />}
      <CreatorToolbox />
      <CreatorPanels />
    </>
  )
}
