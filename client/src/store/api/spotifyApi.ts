import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";




export const spotifyApi = createApi({
    reducerPath: 'spotifyApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.spotify.com/v1/',
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).auth.accessToken

            if(token){
                headers.set('Content-Type', 'application/json'),
                headers.set('Authorization', `Bearer ${token}`)
            }

            return headers;
        }
    }),
    endpoints: (builder) => ({
        playTrack: builder.mutation<void, {device_id: string, trackUri: string}>({
            query: ({device_id, trackUri}) => ({
                url: `/me/player/play?device_id=${device_id}`,
                method: 'PUT',
                body: {
                    uris: [trackUri]
                }
            })
        })
    })
})

export const {usePlayTrackMutation} = spotifyApi