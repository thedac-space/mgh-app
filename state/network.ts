import { createSlice } from '@reduxjs/toolkit'

import { Network, NetworkState } from "./types";

const initialState: NetworkState = { value: Network.ETHEREUM }

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    changeToPolygon: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = Network.POLYGON
    },
    changeToEthereum: state => {
      state.value = Network.ETHEREUM
    }
  }
})

// Action creators are generated for each case reducer function
export const { changeToPolygon, changeToEthereum } = networkSlice.actions

export default networkSlice.reducer