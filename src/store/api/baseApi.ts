import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { getAccessToken, getOrCreateDeviceId, clearAuth, setAccessToken } from '../../api/api-client'
import { GATEWAY_URL } from '../../api/api-client'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: GATEWAY_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    const deviceId = getOrCreateDeviceId()
    headers.set('X-Device-Id', deviceId)
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        credentials: 'include',
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      const data = refreshResult.data as { accessToken?: string }
      if (data.accessToken) {
        setAccessToken(data.accessToken)
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        clearAuth()
      }
    } else {
      clearAuth()
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Profile', 'Track', 'LikedTracks', 'Album', 'Playlist', 'Artist', 'Comment', 'Download'],
  endpoints: () => ({}),
})
