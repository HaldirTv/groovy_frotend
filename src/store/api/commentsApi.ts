import { baseApi } from './baseApi'

export interface Comment {
  commentId: string
  trackId: string
  userId: string
  userName: string
  userAvatarUrl?: string
  text: string
  createdAt: string
}

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrackComments: builder.query<Comment[], string>({
      query: (trackId) => `/music/tracks/${trackId}/comments`,
      providesTags: (_result, _error, trackId) => [{ type: 'Comment', id: trackId }],
    }),

    addComment: builder.mutation<Comment, { trackId: string; text: string }>({
      query: ({ trackId, text }) => ({
        url: `/music/tracks/${trackId}/comments`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (_result, _error, { trackId }) => [{ type: 'Comment', id: trackId }],
    }),

    deleteComment: builder.mutation<void, { commentId: string; trackId: string }>({
      query: ({ commentId }) => ({
        url: `/music/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { trackId }) => [{ type: 'Comment', id: trackId }],
    }),
  }),
})

export const {
  useGetTrackCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = commentsApi
