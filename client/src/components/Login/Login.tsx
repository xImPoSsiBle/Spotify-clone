

const AUTH_URL =
  `https://accounts.spotify.com/authorize?client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20user-top-read%20user-read-recently-played`;

const Login = () => {
    return (
        <div className="min-h-[100vh] flex items-center justify-center">
            <a href={AUTH_URL} className="h-[50px] w-[200px] bg-[#1db954] text-white rounded flex items-center justify-center">Login with Spotify</a>
        </div>
    )
}

export default Login