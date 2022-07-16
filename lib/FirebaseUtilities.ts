import axios from "axios";
// import { initializeApp } from "firebase/app";
// import {
//   doc,
//   getDoc,
//   getFirestore,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   collection,
//   setDoc,
// } from "firebase/firestore/lite";
// import { Score } from "../components/Valuation/LandLikeBox";
import { Metaverse } from "./metaverse";

const URL = "http://localhost:3002/firebase/";

// // Firebase Init
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE,
//   authDomain: "mgh-app-d6122.firebaseapp.com",
//   projectId: "mgh-app-d6122",
//   storageBucket: "mgh-app-d6122.appspot.com",
//   messagingSenderId: "335800469615",
//   appId: "1:335800469615:web:a90434b4ff8ff6e9c2259a",
//   measurementId: "G-SYMJ1J305Q",
// };
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Getting User Instance (WatchList Lands)
export async function getUserInfo(walletAddress: string) {
  const user = await calls(URL + "getUserInfo", {
    walletAddress: walletAddress,
  });
  return user.res;
}

// Creating a User
export async function createUser(walletAddress: string) {
  await calls(URL + "createUser", { walletAddress: walletAddress });
}

// Add Missing Watchlist in case there's an update/new metaverse and user had already been created
export async function addMissingWatchlist(
  walletAddress: string,
  watchlist: string
) {
  await calls(URL + "addMissingWatchlist", {
    walletAddress: walletAddress,
    watchlist: watchlist,
  });
}

// Add Land to User's WatchList
export async function addLandToWatchList(
  landId: string,
  walletAddress: string,
  metaverse: Metaverse
) {
  await calls(URL + "addLandToWatchList", {
    walletAddress: walletAddress,
    landId: landId,
    metaverse: metaverse,
  });
}

// Remove Land from User's WatchList
export async function removeLandFromWatchList(
  landId: string,
  walletAddress: string,
  metaverse: Metaverse
) {
  await calls(URL + "removeLandFromWatchList", {
    walletAddress: walletAddress,
    landId: landId,
    metaverse: metaverse,
  });

}

/* Valuation scores  */

//get valuation scores
export async function getValuationScores(landId: string, metaverse: Metaverse) {
  console.log(">>get")
  const score= await calls(URL + "getValuationScores", {
    landId: landId,
    metaverse: metaverse,
  });
  console.log(">>score",score.res)
  return score.res
}

// Creating a valuation score
export async function createValuationScore(
  landId: string,
  metaverse: Metaverse
) {
  console.log("likes")
  await calls(URL + "createValuationScore", {
    landId: landId,
    metaverse: metaverse,
  });
}

// Like Land Valuation
export async function likeLand(
  landId: string,
  address: string,
  metaverse: Metaverse
) {
  await calls(URL + "likeLand", {
    landId: landId,
    address:address,
    metaverse: metaverse,
  });
}

// Dislike Land Valuation
export async function dislikeLand(
  landId: string,
  address: string,
  metaverse: Metaverse
) {
  await calls(URL + "dislikeLand", {
    landId: landId,
    address:address,
    metaverse: metaverse,
  });
}

// Retrieve valuation daily data
export async function getValuationDailyData(metaverse: Metaverse) {
  const values = await calls(URL + "getValuationDailyData", {
    metaverse: metaverse,
  });
  return values.res;
}

async function calls(URL: string, body: object) {
  let { data } = await axios.post(URL, body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return data;
}
