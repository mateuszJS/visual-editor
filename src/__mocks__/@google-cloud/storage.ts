import { BUCKET_NAME } from '@/app/api/consts'

let errorMock: Error | null = null

export function __mockBucketError(msg: string) {
  errorMock = new Error(msg)
}

interface BucketItem {
  buffer: Buffer<ArrayBufferLike>
  metadata: {
    contentType: string
  }
}

export function __getCleanBucketsMock(): Record<string, Record<string, BucketItem>> {
  return {
    [BUCKET_NAME]: {},
  }
}

export let bucketsMock: ReturnType<typeof __getCleanBucketsMock>

beforeEach(() => {
  bucketsMock = __getCleanBucketsMock()
  errorMock = null
  result = {
    bucketName: '',
    fileName: '',
  }
})

let result = {
  bucketName: '',
  fileName: '',
}

export class Storage {
  bucket(bucketName: string) {
    result.bucketName = bucketName
    return this
  }

  file(fileName: string) {
    result.fileName = fileName
    return this
  }

  getSignedUrl() {
    if (errorMock) {
      return Promise.reject(errorMock)
    }
    return Promise.resolve(['https://storage.googleapis.com/'])
  }

  save(buffer: Buffer, options: BucketItem['metadata']) {
    bucketsMock[result.bucketName][result.fileName] = {
      buffer,
      metadata: options,
    }
    result = {
      bucketName: '',
      fileName: '',
    }
    if (errorMock) {
      return Promise.reject(errorMock)
    }
    return Promise.resolve()
  }
}
