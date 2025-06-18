/** this mock is created since currently github actions do not support GPU.
 * For WebGPU physical GPU is required, so far there is no way to simulate with CPU */
export default function initMagicRenderMock(canvas: HTMLCanvasElement) {
  if (canvas.getAttribute('data-magic-render-linked') === 'true') {
    // on purpose we do not compare lastCanvas to canvas to do not introduce any more logic to this mock
    throw new Error('WebGPU error when canvas was already linked with device')
  }

  canvas.setAttribute('data-magic-render-linked', 'true')

  return Promise.resolve({
    /** We need to figure otu the wya how ot notify outside world about changes in creator canvas
     * it will be also useful in the test
     */
    addImage: jest.fn(),
    updatePoints: () => {},
    destroy: () => {
      canvas.removeAttribute('data-magic-render-linked')
    },
  })
}
