import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { setDeviceId } from "../store/slices/SpotifySlice";


declare global {
    interface Window {
        Spotify: typeof Spotify;
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

const useSpotifyPlayer = () => {
    const dispatch = useAppDispatch()
    const { accessToken } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (!accessToken) return;

        if (!document.getElementById('spotify-sdk')) {
            const script = document.createElement('script');
            script.id = 'spotify-sdk';
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new Spotify.Player({
                name: 'Custom Player',
                getOAuthToken: cb => cb(accessToken),
            });

            player.addListener('ready', ({ device_id }) => {
                dispatch(setDeviceId(device_id));
                console.log('Ready with Device ID', device_id);
            });

            player.connect();
        };
    }, [accessToken, dispatch]);

}

export default useSpotifyPlayer