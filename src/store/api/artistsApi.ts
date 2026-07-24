import { baseApi } from './baseApi'
import type { Track } from '../../context/player-context'

export interface Artist {
  artistId: string
  name: string
  bio?: string
  avatarUrl?: string
  followersCount?: number
  isFollowing?: boolean
  popularTracks?: Track[]
}

export const artistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArtists: builder.query<Artist[], void>({
      query: () => '/music/artists',
      providesTags: ['Artist'],
    }),

    getArtistById: builder.query<Artist, string>({
      query: (artistId) => `/music/artists/${artistId}`,
      providesTags: (_result, _error, id) => [{ type: 'Artist', id }],
    }),

    followArtist: builder.mutation<void, string>({
      query: (artistId) => ({
        url: `/music/artists/${artistId}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Artist', id }, 'Artist'],
    }),

    unfollowArtist: builder.mutation<void, string>({
      query: (artistId) => ({
        url: `/music/artists/${artistId}/follow`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Artist', id }, 'Artist'],
    }),
  }),
})

export const {
  useGetArtistsQuery,
  useGetArtistByIdQuery,
  useFollowArtistMutation,
  useUnfollowArtistMutation,
} = artistsApi
