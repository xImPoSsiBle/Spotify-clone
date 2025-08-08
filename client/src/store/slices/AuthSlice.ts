import { createSlice } from "@reduxjs/toolkit"


interface AuthState {
    accessToken: string
    refreshToken: string
    expiresIn: number | null
}

const initialState: AuthState = {
    accessToken: '',
    refreshToken: '',
    expiresIn: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.expiresIn = action.payload.expiresIn
        },
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken
            state.expiresIn = action.payload.expiresIn
        }
    }
})

export const { setTokens, updateAccessToken } = authSlice.actions
export default authSlice.reducer