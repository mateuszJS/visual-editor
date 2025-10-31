const db: IDBDatabase | null = null
let dbPromise: Promise<IDBDatabase> | null = null

function initDB(onSuccess: (db: IDBDatabase) => void) {
  const requestDB = self.indexedDB.open('DB', 1)

  requestDB.onerror = (event) => {
    console.error(`Database error: ${(event.target as IDBOpenDBRequest).error?.message}`)
  }

  requestDB.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result
    db.createObjectStore('projects', { keyPath: 'id' })
  }

  requestDB.onsuccess = (event) => {
    onSuccess((event.target as IDBOpenDBRequest).result)
  }
}

export function getDB(): Promise<IDBDatabase> {
  if (db) {
    return Promise.resolve(db)
  }

  if (dbPromise) {
    return dbPromise
  }

  // If this is the first time, create the promise to open the DB.
  // We store the promise so subsequent calls can use it.
  dbPromise = new Promise((resolve) => {
    initDB(resolve)
  })

  return dbPromise
}
