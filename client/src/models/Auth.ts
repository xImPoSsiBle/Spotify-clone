export interface Auth {
    accessToken: string | null
    refreshToken: string | null
    expiresIn: number | null
}