type FieldValue = string | number | null | boolean
type Row = Record<string, FieldValue>

export function getInitialDB(arg = '') {
  console.log('getInitialDB' + arg)
  return {
    tables: {
      users: [
        {
          id: 'user-1',
          email: 'test@example.com',
          oidc_google_id: 'google-1',
        },
      ] as Row[],
      projects: [] as Row[],
    },
  }
}

const mockDB = getInitialDB()
export function getMockDB() {
  return mockDB
}

const supabaseClientMock = {
  from: (tableId: keyof typeof mockDB.tables) => {
    return {
      ...supabaseClientMock,
      select: () => supabaseClientMock.select(mockDB.tables[tableId]),
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
    tableId: keyof typeof mockDB.tables,
    data: Record<string, string | number>,
    error: Error | null = null
  ) => {
    const newRow = {
      id: mockDB.tables[tableId].length,
      ...Object.entries(data).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value === undefined ? null : value,
        }),
        {}
      ),
    }
    mockDB.tables[tableId].push(newRow)
    console.log('==================')
    console.log(mockDB) // This console log correctly shows two users in DB
    return {
      error,
      select: () => supabaseClientMock.select([newRow]),
    }
  },
}

afterEach(() => {
  // mockDB = getInitialDB()
})

export default supabaseClientMock
