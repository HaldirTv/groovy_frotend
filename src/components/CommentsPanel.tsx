import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAccessToken } from '../api/api-client'
import { fetchComments, postComment, toggleCommentLike, deleteComment, type TrackComment } from '../api/comments'

interface CommentsPanelProps {
  trackId: string
  isOpen: boolean
  onClose: () => void
}

const formatRelativeTime = (isoDate: string, t: (key: string) => string): string => {
  const timestamp = new Date(isoDate).getTime()
  if (Number.isNaN(timestamp)) return ''
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))

  if (diffSeconds < 60) return t('trackPage.comments_just_now')
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} ${t('trackPage.comments_minutes_ago')}`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} ${t('trackPage.comments_hours_ago')}`
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} ${t('trackPage.comments_days_ago')}`

  // Старше недели "N днів тому" перестаёт что-либо говорить — показываем дату.
  const date = new Date(timestamp)
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${date.getFullYear()}`
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({ trackId, isOpen, onClose }) => {
  const { t } = useTranslation()
  const isAuthenticated = !!getAccessToken() || !!localStorage.getItem('UserEmail')

  const [comments, setComments] = useState<TrackComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newText, setNewText] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  useEffect(() => {
    if (!isOpen || !trackId) return
    let cancelled = false
    setIsLoading(true)
    fetchComments(trackId)
      .then((data) => { if (!cancelled) setComments(data) })
      .catch((err) => console.error('[Comments] Failed to load:', err))
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [isOpen, trackId])

  if (!isOpen) return null

  const handlePost = async () => {
    const text = newText.trim()
    if (!text || isPosting) return
    setIsPosting(true)
    try {
      const created = await postComment(trackId, text)
      setComments((prev) => [created, ...prev])
      setNewText('')
    } catch (err) {
      console.error('[Comments] Failed to post:', err)
    } finally {
      setIsPosting(false)
    }
  }

  const handleLike = async (commentId: string) => {
    setComments((prev) => prev.map((c) => c.id === commentId
      ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
      : c))
    try {
      await toggleCommentLike(commentId)
    } catch (err) {
      console.error('[Comments] Failed to toggle like:', err)
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error('[Comments] Failed to delete:', err)
    }
  }

  return (
    <div className="ModalOverlay" onClick={onClose}>
      <div className="CommentsModal" onClick={(e) => e.stopPropagation()}>
        <h3 className="CommentsModalTitle">{t('trackPage.comments_title')}</h3>

        {isAuthenticated ? (
          <div className="CommentsInputRow">
            <input
              className="CommentsInput"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePost() }}
              placeholder={t('trackPage.comments_placeholder')}
              maxLength={2000}
            />
            <button className="ActionBtn" onClick={handlePost} disabled={isPosting || !newText.trim()}>
              {t('trackPage.comments_post')}
            </button>
          </div>
        ) : (
          <p className="CommentsLoginHint">{t('trackPage.comments_login_required')}</p>
        )}

        <div className="CommentsList">
          {isLoading ? (
            <p style={{ color: '#A1A1AA' }}>...</p>
          ) : comments.length === 0 ? (
            <p style={{ color: '#A1A1AA' }}>{t('trackPage.comments_empty')}</p>
          ) : (
            comments.map((c) => (
              <div className="CommentItem" key={c.id}>
                <div className="CommentItemHeader">
                  <span className="CommentAuthor">{c.authorName}</span>
                  <span className="CommentTime">{formatRelativeTime(c.createdAt, t)}</span>
                </div>
                <p className="CommentText">{c.text}</p>
                <div className="CommentItemActions">
                  <button
                    className={`CommentLikeBtn ${c.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(c.id)}
                    disabled={!isAuthenticated}
                  >
                    ♥ {c.likes}
                  </button>
                  {c.isOwn && (
                    <button className="CommentDeleteBtn" onClick={() => handleDelete(c.id)}>
                      {t('trackPage.comments_delete')}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <button className="SettingsLogoutBtn" style={{ marginTop: '15px' }} onClick={onClose}>
          {t('trackPage.minimise')}
        </button>
      </div>
    </div>
  )
}
