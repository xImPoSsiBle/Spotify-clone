import { useEffect, useState } from "react"
import useAuth from "../../hooks/useAuth"
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult"
import Player from "../Player/Player"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { setPlayingTrack, setSearchResults } from "../../store/slices/SpotifySlice"
import useSpotifyPlayer from "../../hooks/useSpotifyPlayer"
import { spotifyApi } from "../../lib/spotifyWebApi"
import type { Track } from "../../models/Spotify"
import Loader from "../Loader/Loader"
import InfiniteScroll from "react-infinite-scroll-component"

interface DashboardProps {
  code: string
}

const Dashboard: React.FC<DashboardProps> = ({ code }) => {
  const dispatch = useAppDispatch()
  const { searchResults, device_id } = useAppSelector(state => state.spotify)

  const accessToken = useAuth(code)
  useSpotifyPlayer()
  const [search, setSearch] = useState("")
  const [nextUrl, setNextUrl] = useState("")

  const chooseTrack = (track: Track) => {
    dispatch(setPlayingTrack(track))
  }

  const fetchMoreTracks = async () => {
    const resp = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log(resp)
    const data = await resp.json()
    console.log(data)
    const newTracks = data.tracks.items.map((track: any) => {
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
    })

    dispatch(setSearchResults([...searchResults, ...newTracks]))
    setNextUrl(data.tracks.next)
  }

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) {
      dispatch(setSearchResults([]))
      return
    }

    if (!accessToken || !device_id) return

    let cancel = false
    spotifyApi.searchTracks(search)
      .then((res: any) => {
        console.log(res)
        if (cancel) return
        const newTracks = res.body.tracks.items.map((track: any) => {
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
        })

        dispatch(setSearchResults([...searchResults, ...newTracks]))
        setNextUrl(res.body.tracks.next)
      })

    return () => {
      cancel = true
    }
  }, [search, accessToken])

  return (
    <div className="flex flex-col h-screen">
      {!device_id && <Loader />}
      <input
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[90%] mx-auto mt-4 mb-3 px-4 py-3 rounded-full placeholder-gray-400 outline-none border border-gray-400 focus:border-[#1db954] focus:shadow-[0_0_10px_#1db95470] transition-all duration-300"
      />
      <div id="list" className="flex flex-col overflow-y-scroll mb-25">
        {searchResults.length > 0
          && <InfiniteScroll
            dataLength={searchResults.length}
            next={fetchMoreTracks}
            hasMore={!!nextUrl}
            loader={<h4>Loading...</h4>}
            scrollableTarget="list"
          >
            {searchResults.map((track: Track) => (
              <TrackSearchResult track={track} chooseTrack={chooseTrack} key={track.uri} />
            ))}
          </InfiniteScroll>
        }
      </div>
      <Player />
    </div>
  )
}

export default Dashboard