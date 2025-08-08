import { useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth"
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult"
import Player from "../Player/Player"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { setPlayingTrack, setSearchResults } from "../../store/slices/SpotifySlice"
import useSpotifyPlayer from "../../hooks/useSpotifyPlayer"
import { spotifyApi } from "../../lib/spotifyWebApi"

interface DashboardProps {
  code: string
}

const Dashboard: React.FC<DashboardProps> = ({ code }) => {
  const dispatch = useAppDispatch()
  const { searchResults, playingTrack } = useAppSelector(state => state.spotify)

  const accessToken = useAuth(code)
  useSpotifyPlayer()
  const [search, setSearch] = useState("")
  const [lyrics, setLyrics] = useState("")
  // console.log(searchResults)

  const chooseTrack = (track: any) => {
    dispatch(setPlayingTrack(track))
    setSearch("")
    setLyrics("")
  }

  useEffect(() => {
    if (!playingTrack) return

    axios.get(`http://localhost:3001/lyrics`, {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist
      }
    }).then(res => {
      setLyrics(res.data.lyrics)
    })
  }, [playingTrack])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) {
      dispatch(setSearchResults([]))
      return
    }

    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search)
      .then((res: any) => {
        if (cancel) return
        dispatch(setSearchResults(res.body.tracks.items.map((track: any) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest: any, image: any) => {
              if (image.height < smallest.height) return image
              return smallest
            }, track.album.images[0])

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url
          }
        })))
      })

    return () => {
      cancel = true
    }
  }, [search, accessToken])

  return (
    <div className="flex flex-col h-screen">
      <input
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grow overflow-y-auto flex flex-col gap-y-5">
        {searchResults.map((track: any) => (
          <TrackSearchResult track={track} chooseTrack={chooseTrack} key={track.uri} />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center">
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player />
      </div>
    </div>
  )
}

export default Dashboard