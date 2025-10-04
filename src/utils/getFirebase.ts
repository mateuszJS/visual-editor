import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

interface FirebaseService {
  app: ReturnType<typeof initializeApp>
  auth: ReturnType<typeof getAuth>
}

let firebase: FirebaseService | null = null

export default function getFirebase(): FirebaseService {
  if (!firebase) {
    const firebaseConfig = {
      apiKey: 'AIzaSyCNMhmwRRFax6YNRkphLenJEiATlzeb98M',
      authDomain: 'visual-editor-caf87.firebaseapp.com',
      projectId: 'visual-editor-caf87',
      storageBucket: 'visual-editor-caf87.firebasestorage.app',
      messagingSenderId: '245084596875',
      appId: '1:245084596875:web:2b9c956dca97cb1636828e',
      measurementId: 'G-ZGCMYFTPBD',
    }

    // Initialize Firebase
    firebase = {
      app: initializeApp(firebaseConfig),
      auth: getAuth(),
    }
  }

  return firebase
}
