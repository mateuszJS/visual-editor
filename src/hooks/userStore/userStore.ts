'use client'

import type { SanitizedUser } from '@/app/api/utils/sanitizeUserData'
import errorStore from '@/stores/error'
import fetcher from '@/utils/fetcher'
import { getErrorMessage } from '@/utils/fetcher/getErrorMessage'
import getFirebase from '@/utils/getFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { proxy } from 'valtio'

export interface UserStore {
  user: SanitizedUser | null | undefined // null if not logged in, undefined if request is pending and we don't yet know
}

const userStore = proxy<UserStore>({
  user: undefined,
})

export async function initUserStore() {
  onAuthStateChanged(getFirebase().auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid
      // ...
      console.log('User is signed in with UID:', uid)

      const docRef = doc(getFirebase().firestore, 'users', user.uid)

      //       const userId = firebase.auth().currentUser.uid;
      // const userProfileRef = db.collection('users').doc(userId);
      // userProfileRef.get().then(doc => {
      //   if (doc.exists) {
      //     console.log("User Profile:", doc.data());
      //   }
      // });

      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data())
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!')
      }
    } else {
      // User is signed out
      // ...
      console.log('User is signed out')
    }
  })

  try {
    const response = await fetcher('/api/me', {
      disableAuth401Redirect: true,
    })

    if (response.ok) {
      userStore.user = (await response.json()) as SanitizedUser
    } else {
      userStore.user = null
    }
  } catch (error) {
    userStore.user = null
    errorStore.message = 'Error fetching user data: ' + getErrorMessage(error)
  }
}

export default userStore
