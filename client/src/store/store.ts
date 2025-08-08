import { combineReducers, configureStore } from "@reduxjs/toolkit";
import spotifyReducer from "./slices/SpotifySlice"
import authReducer from "./slices/AuthSlice"
import { authApi } from "./api/authApi";
import { spotifyApi } from "./api/spotifyApi";


const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [spotifyApi.reducerPath]: spotifyApi.reducer,
    spotify: spotifyReducer,
    auth: authReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware).concat(spotifyApi.middleware),
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']