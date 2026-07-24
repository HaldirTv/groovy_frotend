import React, { useState } from 'react'
import { useShareModal } from '../context/share-modal-context'
import { useChat } from '../context/chat-context'
import { getCurrentUserId } from '../api/api-client'
import { searchUsers, type UserSearchResult } from '../api/auth'
import { resolveMediaUrl } from '../api/profile'
import { Avatar } from './chat-avatar'
import { buildView } from './chat-view-helpers'

const SendIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
)
const CopyIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
)

const trackShareUrl = (trackId: string): string => {
  const savedLang = localStorage.getItem('lang') || 'uk'
  const prefix = savedLang === 'en' ? '/en' : ''
  return `${window.location.origin}${prefix}/track?trackId=${trackId}`
}

export const ShareTrackModal: React.FC = () => {
  const { isOpen, track, closeModal } = useShareModal()
  const { conversations, createConversation, shareTrack } = useChat()
  const currentUserId = getCurrentUserId()

  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [copyLabel, setCopyLabel] = useState('Скопіювати посилання')
  const [userQuery, setUserQuery] = useState('')
  const [userResults, setUserResults] = useState<UserSearchResult[]>([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)

  const resetLocalState = () => {
    setSentIds(new Set())
    setCopyLabel('Скопіювати посилання')
    setUserQuery('')
    setUserResults([])
  }

  const handleClose = () => {
    resetLocalState()
    closeModal()
  }

  if (!isOpen || !track) return null

  const views = conversations.map((c) => buildView(c, currentUserId))

  const handleSendToConversation = async (conversationId: string) => {
    await shareTrack(conversationId, track.trackId)
    setSentIds((prev) => new Set(prev).add(conversationId))
  }

  const handleSendToUser = async (userId: string) => {
    const summary = await createConversation([userId])
    if (!summary) return
    await shareTrack(summary.id, track.trackId)
    setSentIds((prev) => new Set(prev).add(userId))
  }

  const runUserSearch = async (q: string) => {
    if (!q.trim()) {
      setUserResults([])
      return
    }
    setIsSearchingUsers(true)
    try {
      setUserResults(await searchUsers(q.trim()))
    } catch {
      setUserResults([])
    } finally {
      setIsSearchingUsers(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackShareUrl(track.trackId))
      .then(() => {
        setCopyLabel('Скопійовано!')
        setTimeout(() => setCopyLabel('Скопіювати посилання'), 2000)
      })
      .catch(() => setCopyLabel('Не вдалося скопіювати'))
  }

  return (
    <div className="ModalOverlay" onClick={handleClose}>
      <div className="PlaylistModal ShareTrackModal" onClick={(e) => e.stopPropagation()}>
        <h3 className="PlaylistModalTitle">Поділитися треком</h3>

        <div className="ShareTrackTrackPreview">
          {track.coverImageUrl ? (
            <img src={track.coverImageUrl} alt={track.title} className="ChatTrackCover" />
          ) : (
            <div className="ChatTrackCover ChatTrackCoverFallback" aria-hidden="true" />
          )}
          <div className="ChatTrackInfo">
            <span className="ChatTrackTitle">{track.title}</span>
            <span className="ChatTrackArtist">{track.artistName}</span>
          </div>
        </div>

        <div className="ShareTrackSection">
          <div className="ShareTrackSectionHeader">Останні діалоги</div>
          <div className="ShareTrackList">
            {views.length === 0 && <div className="ChatListEmpty">У вас поки немає бесід</div>}
            {views.map((v) => (
              <div className="ShareTrackRow" key={v.id}>
                <Avatar name={v.displayName} seed={v.colorSeed} isGroup={v.isGroup} />
                <span className="ShareTrackRowName">{v.displayName}</span>
                <button
                  type="button"
                  className="ShareTrackSendBtn"
                  disabled={sentIds.has(v.id)}
                  onClick={() => handleSendToConversation(v.id)}
                >
                  {sentIds.has(v.id) ? 'Надіслано ✓' : (<><SendIcon /> Надіслати</>)}
                </button>
              </div>
            ))}
          </div>

          <div className="ShareTrackUserSearch">
            <input
              type="text"
              placeholder="Знайти користувача..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runUserSearch(userQuery) }}
            />
            <button type="button" onClick={() => runUserSearch(userQuery)}>Знайти</button>
          </div>
          {isSearchingUsers && <div className="ChatListEmpty">Пошук...</div>}
          {!isSearchingUsers && userQuery.trim() && userResults.length === 0 && (
            <div className="ChatListEmpty">Нікого не знайдено</div>
          )}
          <div className="ShareTrackList">
            {userResults.map((u) => (
              <div className="ShareTrackRow" key={u.userId}>
                {u.avatarUrl ? (
                  <img src={resolveMediaUrl(u.avatarUrl)} alt={u.username} className="ChatAvatar sm" />
                ) : (
                  <Avatar name={u.username} seed={u.userId} />
                )}
                <span className="ShareTrackRowName">{u.username}</span>
                <button
                  type="button"
                  className="ShareTrackSendBtn"
                  disabled={sentIds.has(u.userId)}
                  onClick={() => handleSendToUser(u.userId)}
                >
                  {sentIds.has(u.userId) ? 'Надіслано ✓' : (<><SendIcon /> Надіслати</>)}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="ShareTrackSection">
          <div className="ShareTrackSectionHeader">Пряме посилання</div>
          <div className="ShareLinkRow">
            <input type="text" className="ShareLinkInput" readOnly value={trackShareUrl(track.trackId)} />
            <button type="button" className="ShareLinkCopyBtn" onClick={handleCopyLink}>
              <CopyIcon /> {copyLabel}
            </button>
          </div>
        </div>

        <button type="button" className="PlaylistModalCancelBtn" onClick={handleClose}>
          Закрити
        </button>
      </div>
    </div>
  )
}
