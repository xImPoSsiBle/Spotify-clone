import { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { spotifyApi } from "../../lib/spotifyWebApi"
import { setDuration, setIsPlaying, setProgress } from "../../store/slices/SpotifySlice"


const Player = () => {
    const dispatch = useAppDispatch()
    const { accessToken } = useAppSelector(state => state.auth)
    const { device_id, playingTrack, isPlaying, progress, duration } = useAppSelector(state => state.spotify)

    const handlePlay = async () => {
        if (!device_id || !accessToken || !playingTrack) return

        await spotifyApi.play({
            device_id,
            uris: [playingTrack.uri]
        })
    }

    const togglePlayPause = async () => {
        if (!device_id || !accessToken || !playingTrack) return

        if (isPlaying) {
            await spotifyApi.pause({
                device_id
            })
            dispatch(setIsPlaying(false))
        } else {
            await spotifyApi.play({
                device_id
            })
            dispatch(setIsPlaying(true))
        }
    }

    const getTrackState = useCallback(async () => {
        if (!device_id || !accessToken || !playingTrack) return;

        const trackState = await spotifyApi.getMyCurrentPlaybackState({ device_id });

        if (!trackState.body) return;

        const progress = trackState.body.progress_ms;
        const duration = trackState.body.item?.duration_ms ?? 0;
    
        dispatch(setDuration(duration));
        dispatch(setProgress(progress));
    }, [device_id, accessToken, playingTrack, dispatch]);

    useEffect(() => {
        if(!isPlaying) return

        const interval = setInterval(() => {
            getTrackState()
        }, 1000)

        return () => clearInterval(interval)
    }, [getTrackState, isPlaying])

    useEffect(() => {
        handlePlay()
    }, [playingTrack?.uri])

    if (!accessToken) return null

    return (
        <div className="w-full h-[50px] bg-[#282828] text-white fixed bottom-0 flex items-center justify-center">
            <div>
                <h1 className="text-lg font-semibold">{playingTrack?.title}</h1>
                <p className="text-sm text-gray-400">{playingTrack?.artist}</p>
            </div>
            <div className="ml-5" onClick={togglePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </div>
            <div className="ml-5">
                {Math.floor((progress / 1000) / 60)}:{Math.floor((progress / 1000) % 60)}/{Math.floor((duration / 1000) / 60)}:{Math.floor((duration / 1000) % 60)}
            </div>
        </div>
    )
}

export default Player