import { createSlice } from "@reduxjs/toolkit"
import type { Track } from "../../models/Spotify"


interface SpotifyState {
    searchResults: Track[],
    playingTrack: Track | null,
    isPlaying: boolean,
    device_id: string,
    duration: number,
    progress: number,
    paused: boolean
}

const initialState: SpotifyState = {
    searchResults: [],
    playingTrack: null,
    isPlaying: true,
    device_id: '',
    duration: 0,
    progress: 0,
    paused: false
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
        },
        setDuration: (state, action) => {
            state.duration = action.payload
        },
        setProgress: (state, action) => {
            state.progress = action.payload
        },
        setPaused: (state, action) => {
            state.paused = action.payload
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload
        }
    }
})

export const { setSearchResults, setPlayingTrack, setDeviceId, setDuration, setProgress, setPaused, setIsPlaying } = spotifySlice.actions
export default spotifySlice.reducer