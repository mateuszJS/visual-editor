import errorStore from '@/stores/error'
import loadImagesFromAssetIds from './loadImagesFromAssetIds'

describe('loadImagesFromAssetIds', () => {
  it('returns successfully loaded images', async () => {
    const successQueue = [true, false, true, false, false]
    // true -> image will call onload, false -> img will call onerror

    global.Image = class {
      private successCallback?: VoidFunction
      private failureCallback?: VoidFunction

      set src(src: string) {
        const success = successQueue.shift()
        if (success) {
          this.successCallback?.()
        } else {
          this.failureCallback?.()
        }
      }
      set onload(cb: VoidFunction) {
        this.successCallback = cb
      }
      set onerror(cb: VoidFunction) {
        this.failureCallback = cb
      }
    } as unknown as typeof Image

    const results = await loadImagesFromAssetIds(['1', '2', '3', '4', '5'])

    expect(errorStore.message).toBe('Failed to load 3 images')
    expect(results).toHaveLength(2)
    expect(results[0]).toBeInstanceOf(Image)
    expect(results[1]).toBeInstanceOf(Image)
  })
})
