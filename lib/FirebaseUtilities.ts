import { initializeApp } from 'firebase/app'
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  setDoc,
} from 'firebase/firestore/lite'

// Firebase Init
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: 'mgh-app-d6122.firebaseapp.com',
  projectId: 'mgh-app-d6122',
  storageBucket: 'mgh-app-d6122.appspot.com',
  messagingSenderId: '335800469615',
  appId: '1:335800469615:web:a90434b4ff8ff6e9c2259a',
  measurementId: 'G-SYMJ1J305Q',
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Getting User Instance
export async function getUserInfo(walletAddress: string) {
  const userRef = doc(db, 'users', walletAddress)
  const user = await getDoc(userRef)
  return user.data()
}

// Creating a User
export async function createUser(walletAddress: string) {
  const users = collection(db, 'users')
  await setDoc(doc(users, walletAddress), {
    'sandbox-watchlist': [],
    'decentraland-watchlist': [],
  })
}

// Add Land to User's WatchList
export async function addLandToWatchList(
  landId: number,
  walletAddress: string
) {
  const user = doc(db, 'users', walletAddress)

  await updateDoc(user, {
    'sandbox-watchlist': arrayUnion(landId),
  })
  const updatedData = await getUserInfo(walletAddress)
  return updatedData
}

// Remove Land from User's WatchList
export async function removeLandFromWatchList(
  landId: number,
  walletAddress: string
) {
  const user = doc(db, 'users', walletAddress)
  await updateDoc(user, {
    'sandbox-watchlist': arrayRemove(landId),
  })
  const updatedData = await getUserInfo(walletAddress)
  return updatedData
}
