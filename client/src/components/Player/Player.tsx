import { use, useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { spotifyApi } from "../../lib/spotifyWebApi"
import ProgressBar from "../ProgressBar/ProgressBar"


const Player = () => {
    const dispatch = useAppDispatch()
    const { accessToken } = useAppSelector(state => state.auth)
    const { device_id, playingTrack } = useAppSelector(state => state.spotify)

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);

    const handlePlay = async () => {
        if (!device_id || !accessToken || !playingTrack) return

        await spotifyApi.play({
            device_id,
            uris: [playingTrack.uri]
        })

        setIsPlaying(true)
    }

    const togglePlayPause = async () => {
        if (!device_id || !accessToken || !playingTrack) return

        if (isPlaying) {
            await spotifyApi.pause({
                device_id
            })
            setIsPlaying(false)
        } else {
            await spotifyApi.play({
                device_id
            })
            setIsPlaying(true)
        }
    }

    const getTrackState = useCallback(async () => {
        if (!device_id || !accessToken || !playingTrack) return;

        const trackState = await spotifyApi.getMyCurrentPlaybackState({ device_id });

        if (!trackState.body) return;

        const progress = trackState.body.progress_ms;
        const duration = trackState.body.item?.duration_ms ?? 0;

        setDuration(duration);
        setProgress(progress);
    }, [device_id, accessToken, playingTrack, dispatch]);

    const handleVolumeCommit = async () => {
        if (!device_id || !accessToken || !playingTrack) return

        try {
            await spotifyApi.setVolume(volume, { device_id });
        } catch (error) {
            console.error('Ошибка при установке громкости: ', error)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            getTrackState()
        }, 1000)

        return () => clearInterval(interval)
    }, [getTrackState, isPlaying])

    useEffect(() => {
        handlePlay()
    }, [playingTrack?.uri])

    if (!accessToken || !playingTrack?.uri) return null

    return (
        <div className="w-full h-[70px] bg-[#282828] text-white fixed bottom-0 flex items-center justify-center">
            <div className="h-full w-[90%] flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        className="w-[50px] h-[50px] mr-5"
                        src={playingTrack?.albumUrl}
                        alt="track image"
                    />
                    <div className="max-w-[200px] truncate">
                        <h1 className="text-lg font-semibold">
                            {playingTrack?.title}
                        </h1>
                        <p className="text-sm text-gray-400">{playingTrack?.artist}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span onClick={togglePlayPause}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </span>

                    <div className="flex items-center">
                        {formatTime(progress)}
                        <ProgressBar
                            progress={progress}
                            duration={duration}
                        />
                        {formatTime(duration)}
                    </div>
                </div>
                <div>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        onMouseUp={handleVolumeCommit}
                        onTouchEnd={handleVolumeCommit}
                    />
                </div>
            </div>
        </div>
    )
}

export default Player;