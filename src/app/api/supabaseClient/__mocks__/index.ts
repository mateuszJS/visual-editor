type FieldValue = string | number | null | boolean | object[]
type Row = Record<string, FieldValue>

const firstImage = new File([new Blob(['image-blob'], { type: 'image/png' })], 'image-blob.png')

export function __getCleanDBMock() {
  return {
    tables: {
      users: [
        {
          avatar: 'https://example.com/avatar.jpg',
          browser: 'Firefox',
          browser_engine: 'Gecko',
          country: 'JP',
          device_model: 'Macintosh',
          device_type: null,
          email: 'first-user@example.com',
          id: '1',
          is_bot: false,
          language: 'en-US',
          login_method: 'google',
          name: null,
          oidc_google_id: 'google-1',
          os: 'Mac OS',
        },
        {
          avatar: 'https://example.com/photo.jpg',
          browser: 'Chrome',
          browser_engine: 'Chromium',
          country: 'DK',
          device_model: 'Macintosh',
          device_type: null,
          email: 'second-user@example.com',
          id: '2',
          is_bot: false,
          language: 'dk',
          login_method: 'google',
          name: null,
          oidc_google_id: 'google-2',
          os: 'Mac OS',
        },
      ] as Row[],
      projects: [
        {
          id: '1',
          name: 'First Project',
          last_updated: '2023-10-01T12:00:00Z',
          height: 600,
          width: 800,
          owner_id: '1',
          assets: [],
        },
        {
          id: '2',
          name: 'Second Project',
          last_updated: '2023-10-02T12:00:00Z',
          height: 1200,
          width: 650,
          owner_id: '1',
          assets: [
            { points: [0, 0, 100, 100], type: 'image', url: 'https://example.com/image.png' },
          ],
        },
        {
          id: '3',
          name: 'Third Project',
          last_updated: '2023-10-03T12:00:00Z',
          height: 900,
          width: 100,
          owner_id: '2',
          assets: [],
        },
      ] as Row[],
      // project_textures: [
      //   { id: '1', owner_id: '1' },
      //   { id: '3', owner_id: '1' },
      //   { id: '4', owner_id: '2' },
      // ] as Row[],
    },
    // storage: {
    //   'project-textures': {
    //     '1': firstImage,
    //   } as Record<string, File>,
    //   'project-miniatures': {} as Record<string, File>,
    // },
  }
}

export let dbMock: ReturnType<typeof __getCleanDBMock>

let errorsQueue: Array<Error | null> = []
// example: [null, Error, null] will return error only with the second usage of "supabaseCliebt.from()"
/* This is not THE BEST solution because a test need to know in what order requests are made
so it's a bit of "implementation change detection" but I haven't came up with something better for now */
export function __setErrorQueue(queue: Array<Error | null>) {
  errorsQueue = queue
}

beforeEach(() => {
  dbMock = __getCleanDBMock()
  errorsQueue = []
})

const supabaseClientMock = {
  from: (tableId: keyof typeof dbMock.tables) => {
    const nextError = errorsQueue.shift() || null
    return {
      ...supabaseClientMock,
      select: () => supabaseClientMock.select(dbMock.tables[tableId] as Row[], nextError),
      insert: supabaseClientMock.insert.bind(null, tableId, nextError),
    }
  },
  select: (data: Row[], error: Error | null = null) => {
    return {
      data,
      error,
      single: supabaseClientMock.single.bind(null, data, error),
      eq: supabaseClientMock.eq.bind(null, data, error),
    }
  },
  single: (data: Row[], error: Error | null = null) => {
    if (error) {
      return {
        error,
        data,
      }
    }
    if (data.length !== 1) {
      return {
        error: new Error('Expected a single row, but got multiple rows or zero.'),
      }
    }
    return {
      data: data[0],
    }
  },
  eq: (data: Row[], error: Error | null = null, key: string, value: string | number) => {
    const filteredData = data.filter((item) => item[key] === value)
    return {
      data: filteredData,
      error: error,
      order: supabaseClientMock.order.bind(null, filteredData, error),
      single: supabaseClientMock.single.bind(null, filteredData, error),
      eq: (key: string, value: string | number) =>
        supabaseClientMock.eq(filteredData, error, key, value), // cannot do bind because of TS recursion
    }
  },
  order: (data: Row[], error: Error | null = null) => ({
    data,
    error,
  }),
  insert: (
    tableId: keyof typeof dbMock.tables,
    error: Error | null = null,
    data: Record<string, string | number> | Record<string, string | number>[]
  ) => {
    const rows = Array.isArray(data) ? data : [data]
    const newRows = rows.map((row, i) => ({
      id: (dbMock.tables[tableId].length + 1 + i).toString(),
      ...Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, value === undefined ? null : value])
      ),
    }))

    dbMock.tables[tableId].push(...newRows)

    return {
      error,
      select: () => supabaseClientMock.select(newRows, error),
    }
  },
  // storage: {
  //   from: (bucketId: keyof typeof dbMock.storage) => {
  //     const nextError = errorsQueue.shift() || null

  //     return {
  //       upload: supabaseClientMock.upload.bind(null, bucketId, nextError),
  //       download: (path: string) => ({
  //         error: nextError,
  //         data: dbMock.storage[bucketId][path] || null,
  //       }),
  //     }
  //   },
  // },
  // upload: (
  //   bucketId: keyof typeof dbMock.storage,
  //   error: Error | null = null,
  //   filePath: string,
  //   file: File
  // ) => {
  //   dbMock.storage[bucketId][filePath] = file

  //   return {
  //     error,
  //     data: { id: '1', path: filePath, fullPath: `${bucketId}/${filePath}` },
  //   }
  // },
}

export default supabaseClientMock
