import SpotifyWebApi from 'spotify-web-api-node';


export const spotifyApi = new SpotifyWebApi({
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID
})