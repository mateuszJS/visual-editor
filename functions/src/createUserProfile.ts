// This function is V1 because the V2 API does not yet support auth triggers.

import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'

// Initialize the Firebase Admin SDK
// This is necessary to interact with Firestore and other Firebase services
admin.initializeApp()

// Get a reference to the Firestore database
const db = admin.firestore()

functions.runWith({ maxInstances: 10 })

// Cloud Function triggered when a new user is created in Firebase Authentication
export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user

  // Create a new document in the 'users' collection with the user's UID as the document ID
  const userRef = db.collection('users').doc(uid)

  // Define the initial data for the user profile
  const userData = {
    email: email || null,
    displayName: displayName || null,
    photoURL: photoURL || null,
    // TODO: test same email address with different provider, make sure we dont override
    // createdAt field
    createdAt: admin.firestore.FieldValue.serverTimestamp(), // Timestamp for creation
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(), // Timestamp for last login
  }

  try {
    await userRef.set(userData, { merge: true }) // 'merge: true' ensures existing fields aren't overwritten if the document somehow exists
  } catch (error) {
    console.error(`Error creating user profile for UID: ${uid}`, error)
    // You might want to log this error to Stackdriver Logging or send an alert
  }
})
