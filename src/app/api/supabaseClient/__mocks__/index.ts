type FieldValue = string | number | null | boolean
type Row = Record<string, FieldValue>

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
          id: 1,
          is_bot: false,
          language: 'en-US',
          login_method: 'google',
          name: null,
          oidc_google_id: 'google-1',
          os: 'Mac OS',
        },
      ] as Row[],
      projects: [
        {
          id: 1,
          owner_id: 1,
        },
        {
          id: 2,
          owner_id: 1,
        },
        {
          id: 3,
          owner_id: 2,
        },
      ] as Row[],
    },
    storage: {
      'project-assets': {} as Record<string, File>,
    },
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
      select: () => supabaseClientMock.select(dbMock.tables[tableId], nextError),
      insert: supabaseClientMock.insert.bind(null, tableId, nextError),
    }
  },
  select: (selectedData: Row[], error: Error | null = null) => {
    const data = error ? null : selectedData
    return {
      data,
      error,
      eq: (key: string, value: string | number) => {
        return Promise.resolve({
          data: data ? data.filter((item) => item[key] === value) : null,
          error: error,
        })
      },
      single: () => {
        if (!data) {
          return {
            error,
            data,
          }
        }
        if (data.length !== 1) {
          throw new Error('Expected a single row, but got multiple rows or zero.')
        }
        return {
          data: data[0],
        }
      },
    }
  },
  insert: (
    tableId: keyof typeof dbMock.tables,
    error: Error | null = null,
    data: Record<string, string | number>
  ) => {
    const newRow = {
      id: dbMock.tables[tableId].length,
      ...Object.entries(data).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value === undefined ? null : value,
        }),
        {}
      ),
    }

    dbMock.tables[tableId].push(newRow)

    return {
      error,
      select: () => supabaseClientMock.select([newRow], error),
    }
  },
  storage: {
    from: (bucketId: keyof typeof dbMock.storage) => {
      const nextError = errorsQueue.shift() || null

      return {
        upload: supabaseClientMock.upload.bind(null, bucketId, nextError),
        download: (path: string) => ({
          error: nextError,
          data: dbMock.storage[bucketId][path] || null,
        }),
      }
    },
  },
  upload: (
    bucketId: keyof typeof dbMock.storage,
    error: Error | null = null,
    filePath: string,
    file: File
  ) => {
    dbMock.storage[bucketId][filePath] = file

    return {
      error,
      data: { id: '1', path: filePath, fullPath: `${bucketId}/${filePath}` },
    }
  },
}

export default supabaseClientMock
