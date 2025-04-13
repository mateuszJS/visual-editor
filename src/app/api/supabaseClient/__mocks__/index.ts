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
          id: 0,
          is_bot: false,
          language: 'en-US',
          login_method: 'google',
          name: null,
          oidc_google_id: 'google-1',
          os: 'Mac OS',
        },
      ] as Row[],
      projects: [] as Row[],
    },
  }
}

export let dbMock: ReturnType<typeof __getCleanDBMock>

beforeEach(() => {
  dbMock = __getCleanDBMock()
})

const supabaseClientMock = {
  from: (tableId: keyof typeof dbMock.tables) => {
    return {
      ...supabaseClientMock,
      select: () => supabaseClientMock.select(dbMock.tables[tableId]),
      insert: supabaseClientMock.insert.bind(null, tableId),
    }
  },
  select: (data: Row[], error: Error | null = null) => {
    return {
      data,
      error,
      eq: (key: string, value: string | number) => {
        const rowsData = data.filter((item) => item[key] === value)
        return Promise.resolve({
          data: rowsData,
          error: null,
          single: rowsData[0],
        })
      },
      single: () => {
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
    data: Record<string, string | number>,
    error: Error | null = null
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
    console.log('==================')
    console.log(dbMock) // This console log correctly shows two users in DB
    return {
      error,
      select: () => supabaseClientMock.select([newRow]),
    }
  },
}

export default supabaseClientMock
