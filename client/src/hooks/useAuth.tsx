import { useEffect } from "react"
import { useFetchLoginMutation, useFetchRefreshMutation } from "../store/api/authApi"
import { useAppDispatch, useAppSelector } from "./redux"
import { setTokens, updateAccessToken } from "../store/slices/AuthSlice"


const useAuth = (code: string) => {
  const dispatch = useAppDispatch()
  const { accessToken, refreshToken, expiresIn } = useAppSelector(state => state.auth)
  const [fetchLogin] = useFetchLoginMutation()
  const [fetchRefresh] = useFetchRefreshMutation()


  useEffect(() => {
    fetchLogin({ code }).unwrap()
      .then(data => {
        dispatch(setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn
        }))
        window.history.pushState({}, '', '/')
      })
      .catch((err) => {
        console.error('Ошибка авторизации:', err)
        window.location.href = '/'
      })
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return

    const interval = setInterval(() => {
      fetchRefresh({ refreshToken })
        .unwrap()
        .then(data => {
          dispatch(updateAccessToken({
            accessToken: data.accessToken,
            expiresIn: data.expiresIn
          }))
        })
        .catch((err) => {
          console.error('Ошибка авторизации:', err)
          window.location.href = '/'
        })
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  return accessToken;
}

export default useAuth