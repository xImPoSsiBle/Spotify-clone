import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
    code: string
}

interface LoginResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
}

interface RefreshResponse {
    accessToken: string
    expiresIn: number
}

interface RefreshRequest {
    refreshToken: string
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3001'}),
    endpoints: (builder) => ({
        fetchLogin: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: '/login',
                method: 'POST',
                body
            })
        }),
        fetchRefresh: builder.mutation<RefreshResponse, RefreshRequest>({
            query: (body) => ({
                url: '/refresh',
                method: 'POST',
                body
            })
        })
    })
})

export const { useFetchLoginMutation, useFetchRefreshMutation } = authApi