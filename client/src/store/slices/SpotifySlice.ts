import { createSlice } from "@reduxjs/toolkit"
import type { Track } from "../../models/Spotify"


interface SpotifyState {
    searchResults: Track[],
    playingTrack: Track | null,
    device_id: string,
}

const initialState: SpotifyState = {
    searchResults: [],
    playingTrack: null,
    device_id: '',
}

export const spotifySlice = createSlice({
    name: 'spotify',
    initialState,
    reducers: {
        setSearchResults: (state, action) => {
            state.searchResults = action.payload
        },
        setPlayingTrack: (state, action) => {
            state.playingTrack = action.payload
        },
        setDeviceId: (state, action) => {
            state.device_id = action.payload
        }
    }
})

export const { setSearchResults, setPlayingTrack, setDeviceId } = spotifySlice.actions
export default spotifySlice.reducer