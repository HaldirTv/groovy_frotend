import React, { useState } from 'react'
import { useForwardModal } from '../context/forward-modal-context'
import { useChat } from '../context/chat-context'
import { getCurrentUserId } from '../api/api-client'
import { searchUsers, type UserSearchResult } from '../api/auth'
import { resolveMediaUrl } from '../api/profile'
import type { MediaMessageType } from '../api/chat-client'
import { Avatar } from './chat-avatar'
import { buildView } from './chat-view-helpers'

const SendIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
)

// Структурна копія ShareTrackModal — та сама логіка "останні діалоги + пошук
// користувача", але відправляє довільне повідомлення (текст/трек/медіа) через
// forwardedFromMessageId замість завжди створювати новий трек-шеринг.
export const ForwardMessageModal: React.FC = () => {
  const { isOpen, message, closeModal } = useForwardModal()
  const { conversations, createConversation, sendMessage, shareTrack, sendMediaMessage } = useChat()
  const currentUserId = getCurrentUserId()

  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [userQuery, setUserQuery] = useState('')
  const [userResults, setUserResults] = useState<UserSearchResult[]>([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)

  const resetLocalState = () => {
    setSentIds(new Set())
    setUserQuery('')
    setUserResults([])
  }

  const handleClose = () => {
    resetLocalState()
    closeModal()
  }

  if (!isOpen || !message) return null

  const views = conversations.map((c) => buildView(c, currentUserId))

  const forwardTo = async (conversationId: string) => {
    if (message.type === 'Text') {
      await sendMessage(conversationId, message.text ?? '', undefined, message.id)
    } else if (message.type === 'TrackShare' && message.track) {
      await shareTrack(conversationId, message.track.trackId, undefined, message.id)
    } else if (message.mediaUrl) {
      await sendMediaMessage(
        conversationId,
        message.mediaUrl,
        message.type as MediaMessageType,
        message.mediaFileName ?? undefined,
        message.mediaFileSizeBytes ?? undefined,
        undefined,
        message.id
      )
    }
  }

  const handleSendToConversation = async (conversationId: string) => {
    await forwardTo(conversationId)
    setSentIds((prev) => new Set(prev).add(conversationId))
  }

  const handleSendToUser = async (userId: string) => {
    const summary = await createConversation([userId])
    if (!summary) return
    await forwardTo(summary.id)
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

  return (
    <div className="ModalOverlay" onClick={handleClose}>
      <div className="PlaylistModal ShareTrackModal" onClick={(e) => e.stopPropagation()}>
        <h3 className="PlaylistModalTitle">Переслати повідомлення</h3>

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

        <button type="button" className="PlaylistModalCancelBtn" onClick={handleClose}>
          Закрити
        </button>
      </div>
    </div>
  )
}
