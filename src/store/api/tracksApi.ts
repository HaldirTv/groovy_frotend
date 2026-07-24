import { baseApi } from './baseApi'
import type { Track } from '../../context/player-context'
import type { PagedResult } from '../../types/shared'

export interface GetTracksParams {
  search?: string
  pageNumber?: number
  pageSize?: number
  genre?: string
}

export interface MoodRecommendation {
  mood: string
  tracks: Track[]
}

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTracks: builder.query<PagedResult<Track>, GetTracksParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params?.search) queryParams.append('search', params.search)
        if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString())
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
        if (params?.genre) queryParams.append('genre', params.genre)
        return `/music/tracks?${queryParams.toString()}`
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ trackId }) => ({ type: 'Track' as const, id: trackId })),
              { type: 'Track', id: 'LIST' },
            ]
          : [{ type: 'Track', id: 'LIST' }],
    }),

    getTrackById: builder.query<Track, string>({
      query: (trackId) => `/music/tracks/${trackId}`,
      providesTags: (_result, _error, id) => [{ type: 'Track', id }],
    }),

    getPopularTracks: builder.query<Track[], number | void>({
      query: (take = 10) => `/music/tracks/popular?take=${take}`,
      providesTags: [{ type: 'Track', id: 'POPULAR' }],
    }),

    getLikedTracks: builder.query<Track[], void>({
      query: () => '/music/tracks/liked',
      providesTags: ['LikedTracks'],
    }),

    getLibraryTracks: builder.query<PagedResult<Track>, { pageNumber?: number; pageSize?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString())
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
        return `/music/library?${queryParams.toString()}`
      },
      providesTags: ['Track'],
    }),

    likeTrack: builder.mutation<void, string>({
      query: (trackId) => ({
        url: `/music/tracks/${trackId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['LikedTracks', { type: 'Track', id: 'LIST' }],
    }),

    unlikeTrack: builder.mutation<void, string>({
      query: (trackId) => ({
        url: `/music/tracks/${trackId}/like`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LikedTracks', { type: 'Track', id: 'LIST' }],
    }),

    getMoodRecommendations: builder.query<MoodRecommendation[], number | void>({
      query: (take = 8) => `/music/tracks/recommendations?take=${take}`,
      providesTags: [{ type: 'Track', id: 'MOOD' }],
    }),

    getGenres: builder.query<string[], void>({
      query: () => '/music/tracks/genres',
    }),

    uploadTrack: builder.mutation<Track, FormData>({
      query: (formData) => ({
        url: '/music/tracks/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Track', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetTracksQuery,
  useLazyGetTracksQuery,
  useGetTrackByIdQuery,
  useGetPopularTracksQuery,
  useGetLikedTracksQuery,
  useGetLibraryTracksQuery,
  useLikeTrackMutation,
  useUnlikeTrackMutation,
  useGetMoodRecommendationsQuery,
  useGetGenresQuery,
  useUploadTrackMutation,
} = tracksApi
