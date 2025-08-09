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
        <div className="flex items-center cursor-pointer" onClick={handlePlay}>
            <img
                className="w-[64px] h-[64px]"
                src={track.albumUrl}
                alt="track image"
            />
            <div className="ml-3">
                <div>{track.title}</div>
                <div className="text-gray-500">{track.artist}</div>
            </div>
        </div>
    )
}

export default TrackSearchResult