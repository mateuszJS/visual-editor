// .prepare('SELECT id, email, name, photo FROM users WHERE oidc_google_id = ?')
const dbMockData: {
  users: {
    id: number
    email: string
    name: string
    photo: string
    oidc_google_id: string
  }[]
  projects: []
} = {
  users: [],
  projects: [],
}

export function getD1DatabaseMock(): D1Database {
  return {
    prepare(query: string): D1PreparedStatement {
      let boundParams: unknown[] = []

      return {
        bind(...params: unknown[]): D1PreparedStatement {
          boundParams = params
          return this
        },

        async first<T = Record<string, unknown>>(): Promise<T | null> {
          const selectUserByGoogleId = /SELECT .* FROM users WHERE oidc_google_id = \?/i
          if (selectUserByGoogleId.test(query)) {
            const googleId = boundParams[0]
            const user = dbMockData.users.find((u) => u.oidc_google_id === googleId)
            return (user ? { ...user } : null) as T | null
          }

          console.warn(`D1 Mock: .first() not implemented for query: "${query}"`)
          return null
        },

        async all<T = unknown>(): Promise<D1Result<T>> {
          console.warn(`D1 Mock: .all() not implemented for query: "${query}"`)
          return { results: [], success: true, meta: {} }
        },

        async run<T = unknown>(): Promise<D1Result<T>> {
          const insertUser = /INSERT INTO users \((.*)\) VALUES \((.*)\)/i
          const match = query.match(insertUser)

          if (match) {
            const columns = match[1].split(',').map((c) => c.trim())
            const newUser: any = { id: dbMockData.users.length + 1 }
            columns.forEach((col, index) => {
              newUser[col] = boundParams[index]
            })
            dbMockData.users.push(newUser)
            return {
              results: [],
              success: true,
              meta: { last_row_id: newUser.id, changes: 1, duration: 0 },
            }
          }

          console.warn(`D1 Mock: .run() not implemented for query: "${query}"`)
          return { results: [], success: true, meta: {} }
        },
      }
    },
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
      console.warn('D1 Mock: .batch() not implemented')
      return Promise.resolve([])
    },
    exec(query: string): Promise<D1ExecResult> {
      console.warn('D1 Mock: .exec() not implemented')
      return Promise.resolve({ count: 0, duration: 0 })
    },
    dump(): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(0))
    },
  } as D1Database
}
