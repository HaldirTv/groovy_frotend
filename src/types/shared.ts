// Shared pagination type — single source of truth
// Was duplicated in albums.ts, playlists.ts, library.tsx
export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

// Common track fields shared across history, favorites, artist tracks
export interface TrackBaseItem {
  trackId: string
  title: string
  artistName: string
  audioUrl?: string
  coverImageUrl?: string
  durationSeconds: number
}
