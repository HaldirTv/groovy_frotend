let accessToken: string | null = null

export const storeAccessToken = (token: string) => {
  accessToken = token
}

export const getAccessToken = () => {
  return accessToken
}

export const clearAccessToken = () => {
  accessToken = null
}
