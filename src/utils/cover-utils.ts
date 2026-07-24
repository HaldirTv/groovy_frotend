import Cover from '../assets/Cover.svg'
import CoverLight from '../assets/CoverLight.svg'
import { GATEWAY_URL, resolveMediaUrl } from '../api/api-client'

export type ThemeMode = 'light' | 'dark'

/**
 * Returns default SVG cover asset for the specified theme mode.
 */
export const getFallbackCover = (theme: ThemeMode = 'dark'): string => {
  return theme === 'light' ? CoverLight : Cover
}

/**
 * Resolves any cover/icon image URL (absolute, relative, blob, data URL) to a valid URL string.
 * If rawUrl is null/undefined/empty, returns theme-appropriate fallback SVG.
 */
export const resolveCoverUrl = (
  rawUrl?: string | null,
  theme: ThemeMode = 'dark'
): string => {
  if (!rawUrl || !rawUrl.trim()) {
    return getFallbackCover(theme)
  }

  const trimmed = rawUrl.trim()

  // Full URL or data/blob URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return resolveMediaUrl(trimmed) || trimmed
  }

  // Local frontend assets
  if (trimmed.startsWith('/src/') || trimmed.startsWith('src/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  }

  // Backend files relative path
  const cleanPath = trimmed.replace(/\\/g, '/').replace(/^\/+/, '')

  if (cleanPath.startsWith('music/files/')) {
    return `${GATEWAY_URL}/${cleanPath}`
  }

  return `${GATEWAY_URL}/music/files/${cleanPath}`
}
