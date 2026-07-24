import { baseApi } from './baseApi'
import type { Track } from '../../context/player-context'
import type { PagedResult } from '../../types/shared'

export interface Album {
  albumId: string
  title: string
  artistName: string
  coverImageUrl?: string
  releaseYear?: number
  genre?: string
  tracksCount?: number
  tracks?: Track[]
}

export const albumsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlbums: builder.query<PagedResult<Album> | Album[], { pageNumber?: number; pageSize?: number } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString())
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
        return `/music/albums?${queryParams.toString()}`
      },
      providesTags: ['Album'],
    }),

    getAlbumById: builder.query<Album, string>({
      query: (albumId) => `/music/albums/${albumId}`,
      providesTags: (_result, _error, id) => [{ type: 'Album', id }],
    }),

    createAlbum: builder.mutation<Album, FormData>({
      query: (formData) => ({
        url: '/music/albums',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Album'],
    }),

    deleteAlbum: builder.mutation<void, string>({
      query: (albumId) => ({
        url: `/music/albums/${albumId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Album'],
    }),
  }),
})

export const {
  useGetAlbumsQuery,
  useGetAlbumByIdQuery,
  useCreateAlbumMutation,
  useDeleteAlbumMutation,
} = albumsApi
