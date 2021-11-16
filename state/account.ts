import { createSlice } from '@reduxjs/toolkit'

import { Network, AccountState } from "./types";

const initialState: AccountState = { 
    connected: false, 
    provider: undefined
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    connect: (state, action) => {
        state.connected = true
        state.provider = action.payload
    },
    disconnect: state => initialState,
  }
})

// Action creators are generated for each case reducer function
export const { connect, disconnect } = accountSlice.actions

export default accountSlice.reducer