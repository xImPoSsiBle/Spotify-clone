import type { Track } from "../../models/Spotify"


interface TrackSearchResultProps {
    track: Track,
    chooseTrack: (track: Track) => void
}

const TrackSearchResult: React.FC<TrackSearchResultProps> = ({ track, chooseTrack }) => {

    const handlePlay = () => {
        chooseTrack(track)
    }

    return (
        <div
            className="w-[90%] flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={handlePlay}
        >
            <img
                className="w-[64px] h-[64px] rounded-md shadow-md object-cover"
                src={track.albumUrl}
                alt={track.title}
            />
            <div className="ml-4 flex flex-col justify-center overflow-hidden">
                <div className="font-semibold truncate max-w-[200px]">
                    {track.title}
                </div>
                <div className="text-sm text-gray-400 truncate max-w-[200px]">
                    {track.artist}
                </div>
            </div>
        </div>
    )
}

export default TrackSearchResult