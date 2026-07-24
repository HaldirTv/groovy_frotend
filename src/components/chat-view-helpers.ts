import type { ConversationSummaryDto } from '../api/chat-client'

const AVATAR_COLORS = [
  'linear-gradient(135deg, #72DEEF 0%, #3E8FA8 100%)',
  'linear-gradient(135deg, #A98FDB 0%, #6C4FBF 100%)',
  'linear-gradient(135deg, #FFB347 0%, #C77B26 100%)',
  'linear-gradient(135deg, #7BC67E 0%, #3F8C46 100%)',
  'linear-gradient(135deg, #F291C9 0%, #B14E90 100%)',
]

export const colorForSeed = (seed: string): string => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export const initialsFor = (name: string): string => {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  const parts = trimmed.split(/\s+/)
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : trimmed.slice(0, 2).toUpperCase()
}

export const isSameCalendarDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

export const formatConversationTime = (iso: string): string => {
  const date = new Date(iso)
  return isSameCalendarDay(date, new Date())
    ? date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })
}

// Розділювач дат в історії чату: "Сьогодні"/"Вчора" для двох останніх календарних днів,
// інакше "12 жовтня" (uk-UA long-формат місяця вже дає родовий відмінок сам по собі).
export const formatDateDivider = (iso: string): string => {
  const date = new Date(iso)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameCalendarDay(date, now)) return 'Сьогодні'
  if (isSameCalendarDay(date, yesterday)) return 'Вчора'
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })
}

export interface ConversationView {
  id: string
  isGroup: boolean
  displayName: string
  subtitle: string
  timeLabel: string
  colorSeed: string
  avatarUrl: string | null
  isPending: boolean
  raw: ConversationSummaryDto
}

export const buildView = (c: ConversationSummaryDto, currentUserId: string | null): ConversationView => {
  let displayName: string
  let colorSeed: string
  if (c.isGroup) {
    displayName = c.title || 'Групова бесіда'
    colorSeed = c.id
  } else {
    const other = c.participants.find((p) => p.userId !== currentUserId)
    displayName = other?.userName || 'Користувач'
    colorSeed = other?.userId || c.id
  }
  return {
    id: c.id,
    isGroup: c.isGroup,
    displayName,
    subtitle: c.status === 'Pending' ? 'Запит на переписку' : (c.lastMessagePreview || 'Немає повідомлень'),
    timeLabel: formatConversationTime(c.lastMessageAt || c.createdAt),
    colorSeed,
    avatarUrl: c.avatarUrl,
    isPending: c.status === 'Pending' && c.requestedByUserId !== currentUserId,
    raw: c,
  }
}
