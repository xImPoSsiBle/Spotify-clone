import { useCallback, useEffect, useState } from "react"
import { useAppSelector } from "../../hooks/redux"
import { spotifyApi } from "../../lib/spotifyWebApi"
import ProgressBar from "../ProgressBar/ProgressBar"
import { FaPause, FaPlay } from "react-icons/fa6"


const Player = () => {
    const { accessToken } = useAppSelector(state => state.auth)
    const { device_id, playingTrack } = useAppSelector(state => state.spotify)

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isSeeking, setIsSeeking] = useState(false);

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
        if (!device_id || !accessToken || !playingTrack || isSeeking) return;

        const trackState = await spotifyApi.getMyCurrentPlaybackState({ device_id });

        if (!trackState.body) return;

        const progress = trackState.body.progress_ms;
        const duration = trackState.body.item?.duration_ms ?? 0;

        setDuration(duration);
        setProgress(progress);
    }, [device_id, accessToken, playingTrack, isSeeking]);



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

    const handleSeekChange = (newProgressMs: number) => {
        setIsSeeking(true);
        setProgress(newProgressMs);
    };

    const handleSeekCommit = async (newProgressMs: number) => {
        if (!device_id || !accessToken) return;
        try {
            setIsSeeking(true);
            setProgress(newProgressMs);

            await spotifyApi.seek(Math.floor(newProgressMs));
        } catch (error) {
            console.error("Ошибка при перемотке:", error);
        } finally {
            setTimeout(() => setIsSeeking(false), 1500);
        }
    };

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
        <div className="w-full h-[90px] bg-[#181818] text-white fixed bottom-0 flex items-center justify-center mt-4">
            <div className="h-full w-[92%] flex items-center justify-between">
                <div className="flex items-center w-[30%]">
                    <img
                        className="w-[56px] h-[56px] rounded-md mr-4 shadow-lg"
                        src={playingTrack?.albumUrl}
                        alt="track image"
                    />
                    <div className="max-w-[180px] truncate">
                        <h1 className="text-base font-semibold truncate">{playingTrack?.title}</h1>
                        <p className="text-sm text-gray-400 truncate">{playingTrack?.artist}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center w-[40%]">
                    <div className="w-full flex justify-center">
                        <button onClick={togglePlayPause} className="w-10 cursor-pointer">
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 w-full mt-1">
                        <span className="text-xs text-gray-400 w-[40px] text-right">{formatTime(progress)}</span>
                        <ProgressBar
                            progress={progress}
                            duration={duration}
                            onSeekChange={handleSeekChange}
                            onSeekCommit={handleSeekCommit}
                        />
                        <span className="text-xs text-gray-400 w-[40px]">{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2 w-[20%] justify-end">
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        onMouseUp={handleVolumeCommit}
                        onTouchEnd={handleVolumeCommit}
                        style={{
                            background: `linear-gradient(90deg, #1DB954 ${volume}%, #4d4d4d ${volume}%)`,
                        }}
                        className="w-[100px] h-[3px] rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                </div>
            </div>
        </div>
    );

}

export default Player;