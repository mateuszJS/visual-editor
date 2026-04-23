'use client'

import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import styles from './CreatorView.module.css'
import useCreator from '@/hooks/useCreator/useCreator'
import { ApiProjectContent } from '../../../apiTypes'
import { captureError } from '@/utils/captureError'
import Link from '@/components/Link/Link'
import posthog from 'posthog-js'
import { getErrorMessage } from '@/utils/nativeFetcher/getErrorMessage'

interface Props {
  project: ApiProjectContent
}

type ErrorUI = {
  title: string
  text: string
}

export default function CreatorView({ project }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const creator = useCreator()
  const [error, setError] = useState<ErrorUI | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!

    ;(async function () {
      try {
        await creator.init(canvas, project)
      } catch (err) {
        const unsupportedWebGPU = getErrorMessage(err).startsWith('X-WEBGPU')

        if (unsupportedWebGPU) {
          posthog.capture('no-webgpu')
          setError({
            title: 'Sorry, the creator is not supported by your browser/device',
            text: 'Make sure your browser is updated to the latest version or try on a different device.',
          })
          return
        }

        setError(
          (err) =>
            err || {
              title: 'Sorry, there is an error with this project',
              text: 'We have been informed, the issue will be resolved as soon as possible. Please try again later or open a different project.',
            }
        ) // ensure we don't override webgpu error
        captureError(err, { webgpu: true })
      }
    })()

    return creator.destroy.bind(null, canvas)
  }, [])

  return (
    <>
      {error && (
        <div className={styles.error}>
          <h2 className="mb-8">{error.title}</h2>
          <p>{error.text}</p>
          <Link className="mt-16" href="/">
            Go to Home page
          </Link>
        </div>
      )}
      <canvas className={cn(styles.root, 'child-overflow-fix')} ref={canvasRef} />
    </>
  )
}

// Click on cards below to discover what having an iPhone causes on this planet:
// 1. A sad dog
// https://www.pexels.com/photo/cute-stabyhoun-dog-with-sad-eyes-6291579/
// https://www.pexels.com/photo/lonely-dog-by-wooden-fence-in-istanbul-36973017/
// https://www.pexels.com/photo/cute-dog-lying-on-sidewalk-19782029/
// https://www.pexels.com/photo/a-pug-dog-laying-on-a-blanket-with-a-pink-flower-17437050/

// 2. More sad dogs.
// 3. This one is not a dog but still is SAD!
// https://www.pexels.com/photo/orange-tabby-cat-hiding-its-face-209037/
// https://www.pexels.com/photo/closeup-of-a-cat-lying-on-a-floor-17460948/
