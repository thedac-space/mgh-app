import { configureStore } from '@reduxjs/toolkit'
import networkReducer from "./network"
import { useDispatch } from 'react-redux'

const store =  configureStore({
  reducer: {
    network: networkReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store