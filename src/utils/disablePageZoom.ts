export default function disablePageZoom() {
  const controller = new AbortController()

  document.addEventListener(
    'gesturestart',
    function (e) {
      if (e.target && e.target instanceof HTMLElement && e.target.tagName !== 'CANVAS') {
        e.preventDefault()
        // document.body.style.zoom = '0.99'
      }
    },
    { signal: controller.signal }
  )

  document.addEventListener(
    'gesturechange',
    function (e) {
      if (e.target && e.target instanceof HTMLElement && e.target.tagName !== 'CANVAS') {
        e.preventDefault()
        // document.body.style.zoom = '0.99'
      }
    },
    { signal: controller.signal }
  )

  document.addEventListener(
    'gestureend',
    function (e) {
      if (e.target && e.target instanceof HTMLElement && e.target.tagName !== 'CANVAS') {
        e.preventDefault()
        // document.body.style.zoom = '1'
      }
    },
    { signal: controller.signal }
  )

  return controller
}
