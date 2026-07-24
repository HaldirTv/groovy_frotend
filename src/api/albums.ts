import { apiFetch, GATEWAY_URL } from './api-client'
import type { PagedResult } from '../types/shared'

export interface AlbumListItem {
  id: string
  title: string
  artistName: string
  coverImageUrl?: string
  trackCount: number
  totalDurationSeconds: number
  releaseDate?: string
  isLiked: boolean
  collageCovers: string[]
}

export interface AlbumTrackItem {
  trackId: string
  title: string
  artistName: string
  durationSeconds: number
  audioUrl: string
  coverImageUrl?: string
}

export interface Album extends AlbumListItem {
  userId: string
  description?: string
  createdAt: string
  tracks: AlbumTrackItem[]
}

export type { PagedResult } from '../types/shared'

// Backend PagedResultDto/AlbumListItemDto/AlbumDto use PascalCase fields; normalize to the
// camelCase shape above regardless of which casing System.Text.Json ends up emitting.
const normalizeAlbumListItem = (raw: Record<string, unknown>): AlbumListItem => ({
  id: String(raw.id ?? raw.Id ?? ''),
  title: String(raw.title ?? raw.Title ?? ''),
  artistName: String(raw.artistName ?? raw.ArtistName ?? ''),
  coverImageUrl: (raw.coverImageUrl ?? raw.CoverImageUrl) as string | undefined,
  trackCount: Number(raw.trackCount ?? raw.TrackCount ?? 0),
  totalDurationSeconds: Number(raw.totalDurationSeconds ?? raw.TotalDurationSeconds ?? 0),
  releaseDate: (raw.releaseDate ?? raw.ReleaseDate) as string | undefined,
  isLiked: Boolean(raw.isLiked ?? raw.IsLiked ?? false),
  collageCovers: (raw.collageCovers ?? raw.CollageCovers ?? []) as string[],
})

const normalizeAlbum = (raw: Record<string, unknown>): Album => ({
  ...normalizeAlbumListItem(raw),
  userId: String(raw.userId ?? raw.UserId ?? ''),
  description: (raw.description ?? raw.Description) as string | undefined,
  createdAt: String(raw.createdAt ?? raw.CreatedAt ?? ''),
  tracks: ((raw.tracks ?? raw.Tracks ?? []) as Record<string, unknown>[]).map((t) => ({
    trackId: String(t.trackId ?? t.TrackId ?? ''),
    title: String(t.title ?? t.Title ?? ''),
    artistName: String(t.artistName ?? t.ArtistName ?? ''),
    durationSeconds: Number(t.durationSeconds ?? t.DurationSeconds ?? 0),
    audioUrl: String(t.audioUrl ?? t.AudioUrl ?? ''),
    coverImageUrl: (t.coverImageUrl ?? t.CoverImageUrl) as string | undefined,
  })),
})

export interface FetchAlbumsParams {
  search?: string
  genre?: string
  userId?: string
  pageNumber?: number
  pageSize?: number
}

const buildAlbumsQuery = (params: FetchAlbumsParams): string => {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.genre) query.set('genre', params.genre)
  if (params.userId) query.set('userId', params.userId)
  query.set('pageNumber', String(params.pageNumber ?? 1))
  query.set('pageSize', String(params.pageSize ?? 20))
  return query.toString()
}

export const fetchAlbums = async (params: FetchAlbumsParams = {}): Promise<PagedResult<AlbumListItem>> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/albums?${buildAlbumsQuery(params)}`, {
    method: 'GET',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося завантажити альбоми: ${res.status}`)
  }

  const data = await res.json()
  const items = (data.items ?? data.Items ?? []) as Record<string, unknown>[]
  return {
    items: items.map(normalizeAlbumListItem),
    totalCount: Number(data.totalCount ?? data.TotalCount ?? items.length),
    pageNumber: Number(data.pageNumber ?? data.PageNumber ?? params.pageNumber ?? 1),
    pageSize: Number(data.pageSize ?? data.PageSize ?? params.pageSize ?? 20),
  }
}

export const fetchAlbumById = async (id: string): Promise<Album> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/albums/${id}`, {
    method: 'GET',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося завантажити альбом: ${res.status}`)
  }

  return normalizeAlbum(await res.json())
}

export const fetchLikedAlbums = async (): Promise<AlbumListItem[]> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/favorites/albums`, {
    method: 'GET',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося завантажити збережені альбоми: ${res.status}`)
  }

  const data = (await res.json()) as Record<string, unknown>[]
  return data.map(normalizeAlbumListItem)
}

export const likeAlbum = async (albumId: string): Promise<void> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/favorites/albums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ albumId }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося зберегти альбом: ${res.status}`)
  }
}

export const unlikeAlbum = async (albumId: string): Promise<void> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/favorites/albums/${albumId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося видалити альбом зі збережених: ${res.status}`)
  }
}

export const deleteAlbum = async (albumId: string): Promise<void> => {
  const res = await apiFetch(`${GATEWAY_URL}/music/albums/${albumId}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.Message || data?.message || `Не вдалося видалити альбом: ${res.status}`)
  }
}
