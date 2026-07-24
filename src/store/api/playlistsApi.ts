import { baseApi } from './baseApi'
import type { Track } from '../../context/player-context'
import type { PagedResult } from '../../types/shared'

export interface Playlist {
  playlistId: string
  title: string
  description?: string
  coverImageUrl?: string
  isPublic: boolean
  tracksCount: number
  userId: string
  tracks?: Track[]
  createdAt?: string
}

export interface CreatePlaylistData {
  title: string
  description?: string
  isPublic?: boolean
}

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserPlaylists: builder.query<PagedResult<Playlist> | Playlist[], void>({
      query: () => '/music/playlists',
      providesTags: ['Playlist'],
    }),

    getPlaylistById: builder.query<Playlist, string>({
      query: (playlistId) => `/music/playlists/${playlistId}`,
      providesTags: (_result, _error, id) => [{ type: 'Playlist', id }],
    }),

    createPlaylist: builder.mutation<Playlist, CreatePlaylistData>({
      query: (data) => ({
        url: '/music/playlists',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Playlist'],
    }),

    updatePlaylist: builder.mutation<Playlist, { playlistId: string; title: string; description?: string; isPublic?: boolean }>({
      query: ({ playlistId, ...data }) => ({
        url: `/music/playlists/${playlistId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),

    deletePlaylist: builder.mutation<void, string>({
      query: (playlistId) => ({
        url: `/music/playlists/${playlistId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Playlist'],
    }),

    addTrackToPlaylist: builder.mutation<void, { playlistId: string; trackId: string }>({
      query: ({ playlistId, trackId }) => ({
        url: `/music/playlists/${playlistId}/tracks`,
        method: 'POST',
        body: { trackId },
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),

    removeTrackFromPlaylist: builder.mutation<void, { playlistId: string; trackId: string }>({
      query: ({ playlistId, trackId }) => ({
        url: `/music/playlists/${playlistId}/tracks/${trackId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [{ type: 'Playlist', id: playlistId }, 'Playlist'],
    }),
  }),
})

export const {
  useGetUserPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddTrackToPlaylistMutation,
  useRemoveTrackFromPlaylistMutation,
} = playlistsApi
