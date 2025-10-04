import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

interface FirebaseService {
  app: ReturnType<typeof initializeApp>
  auth: ReturnType<typeof getAuth>
  firestore: ReturnType<typeof getFirestore>
}

let firebase: FirebaseService | null = null

export default function getFirebase(): FirebaseService {
  if (!firebase) {
    const app = initializeApp({
      apiKey: 'AIzaSyCNMhmwRRFax6YNRkphLenJEiATlzeb98M',
      authDomain: 'visual-editor-caf87.firebaseapp.com',
      projectId: 'visual-editor-caf87',
      storageBucket: 'visual-editor-caf87.firebasestorage.app',
      messagingSenderId: '245084596875',
      appId: '1:245084596875:web:2b9c956dca97cb1636828e',
      measurementId: 'G-ZGCMYFTPBD',
    })
    // Initialize Firebase
    firebase = {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
    }
  }

  return firebase
}
