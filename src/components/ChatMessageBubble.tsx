import React, { useEffect, useRef, useState } from 'react'
import type { ChatMessageDto, SharedTrackDto } from '../api/chat-client'
import { VoiceMessagePlayer } from './VoiceMessagePlayer'
import { downloadFile } from '../utils/download'

const formatMessageTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes: number | null): string => {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

// Коротке текстове прев'ю для reply/pin-цитати — той самий набір міток, що і
// previewForMessage у chat-context.tsx для превью останнього повідомлення в списку.
const previewForReply = (type: string, textSnippet: string | null, mediaFileName: string | null): string => {
  switch (type) {
    case 'TrackShare': return 'Трек'
    case 'Image': return 'Фото'
    case 'Voice': return 'Голосове повідомлення'
    case 'File': return mediaFileName ? `Файл: ${mediaFileName}` : 'Файл'
    default: return textSnippet ?? ''
  }
}

const PlayTriangleIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
)
const MoreIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>
)
const FileIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
)
const DownloadFileIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
)
const MenuDownloadIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
)
const ReplyIcon: React.FC = () => (
  <svg width="15" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></svg>
)
const ForwardIcon: React.FC = () => (
  <svg width="17" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 17 20 12 15 7" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" /></svg>
)
const MenuPinIcon: React.FC = () => (
  <svg width="10" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></svg>
)
const MenuDeleteIcon: React.FC = () => (
  <svg width="13" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
)

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Розбиває текст на шматки навколо збігів пошукового запиту (без урахування регістру)
// для підсвітки <mark>. Порожній/пробільний query — рендеримо текст як є.
const highlightText = (text: string, query?: string): React.ReactNode => {
  if (!query || !query.trim()) return text
  const parts = text.split(new RegExp(`(${escapeRegExp(query.trim())})`, 'gi'))
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    part.toLowerCase() === query.trim().toLowerCase() ? <mark key={i} className="ChatSearchMark">{part}</mark> : part
  )
}

interface ChatMessageBubbleProps {
  message: ChatMessageDto
  mine: boolean
  isEditing: boolean
  editValue: string
  isPinned: boolean
  highlightQuery?: string
  isActiveMatch?: boolean
  onPlayTrack: (track: SharedTrackDto, createdAt: string) => void
  onStartEdit: (messageId: string, currentText: string) => void
  onEditChange: (value: string) => void
  onEditSave: () => void
  onEditCancel: () => void
  onRequestDelete: (messageId: string, mine: boolean) => void
  onReply: (message: ChatMessageDto) => void
  onForward: (message: ChatMessageDto) => void
  onTogglePin: (messageId: string, isPinned: boolean) => void
  onReplyPreviewClick: (messageId: string) => void
  onImageClick: (url: string, fileName: string | null) => void
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message: m,
  mine,
  isEditing,
  editValue,
  isPinned,
  highlightQuery,
  isActiveMatch,
  onPlayTrack,
  onStartEdit,
  onEditChange,
  onEditSave,
  onEditCancel,
  onRequestDelete,
  onReply,
  onForward,
  onTogglePin,
  onReplyPreviewClick,
  onImageClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Скачати доступне лише для повідомлень із файлом-медіа (Image/File) — узгоджено
  // з дизайном Figma (варіанти "фото" і "pdf/файл" мають кнопку, "текст" — ні).
  // Voice навмисно без кнопки — жоден з наданих макетів цей кейс не покриває.
  const canDownload = (m.type === 'Image' || m.type === 'File') && !!m.mediaUrl
  const hasHeader = (m.type === 'Image' || m.type === 'File') && !!m.mediaUrl

  const handleDownload = async () => {
    if (!m.mediaUrl) return
    setIsDownloading(true)
    try {
      await downloadFile(m.mediaUrl, m.mediaFileName)
    } catch (err) {
      console.error('[chat] Failed to download media:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className={`ChatBubbleRow ${mine ? 'me' : 'them'} ${isActiveMatch ? 'search-active' : ''}`} data-message-id={m.id}>
      <div className="ChatBubbleMenuWrap" ref={menuRef}>
        <button
          type="button"
          className="ChatBubbleMenuTrigger"
          aria-label="Дії з повідомленням"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <MoreIcon />
        </button>
        {menuOpen && (
          <div className="ChatBubbleMenu">
            {hasHeader && m.type === 'Image' && (
              <div className="ChatBubbleMenuHeader">
                <img src={m.mediaUrl!} alt={m.mediaFileName ?? ''} className="ChatBubbleMenuHeaderThumb" />
                <span className="ChatBubbleMenuHeaderName">{m.mediaFileName ?? 'Зображення'}</span>
              </div>
            )}
            {hasHeader && m.type === 'File' && (
              <div className="ChatBubbleMenuFileCard">
                <span className="ChatBubbleMenuFileIconBox"><FileIcon /></span>
                <span className="ChatBubbleMenuFileInfo">
                  <span className="ChatBubbleMenuFileName">{m.mediaFileName ?? 'Файл'}</span>
                  <span className="ChatBubbleMenuFileSize">{formatFileSize(m.mediaFileSizeBytes)}</span>
                </span>
              </div>
            )}

            {canDownload && (
              <button
                type="button"
                className="ChatBubbleMenuItem"
                disabled={isDownloading}
                onClick={() => { setMenuOpen(false); void handleDownload() }}
              >
                <MenuDownloadIcon /> Скачати
              </button>
            )}
            {mine && m.type === 'Text' && (
              <button
                type="button"
                className="ChatBubbleMenuItem"
                onClick={() => { setMenuOpen(false); onStartEdit(m.id, m.text ?? '') }}
              >
                Редагувати
              </button>
            )}
            <button
              type="button"
              className="ChatBubbleMenuItem"
              onClick={() => { setMenuOpen(false); onReply(m) }}
            >
              <ReplyIcon /> Відповісти
            </button>
            <button
              type="button"
              className="ChatBubbleMenuItem"
              onClick={() => { setMenuOpen(false); onForward(m) }}
            >
              <ForwardIcon /> Переслати
            </button>
            <button
              type="button"
              className="ChatBubbleMenuItem"
              onClick={() => { setMenuOpen(false); onTogglePin(m.id, isPinned) }}
            >
              <MenuPinIcon /> {isPinned ? 'Відкріпити' : 'Закріпити'}
            </button>
            <div className="ChatBubbleMenuDivider" />
            <button
              type="button"
              className="ChatBubbleMenuItem delete"
              onClick={() => { setMenuOpen(false); onRequestDelete(m.id, mine) }}
            >
              <MenuDeleteIcon /> Видалити
            </button>
          </div>
        )}
      </div>

      <div className="ChatBubbleContentCol">
        {(m.replyTo || m.forwardedFromSenderName) && (
          <div className="ChatBubbleMeta">
            {m.forwardedFromSenderName && (
              <span className="ChatForwardedLabel">Переслано від {m.forwardedFromSenderName}</span>
            )}
            {m.replyTo && (
              <button
                type="button"
                className="ChatReplyQuote"
                onClick={() => onReplyPreviewClick(m.replyTo!.messageId)}
              >
                <span className="ChatReplyQuoteName">{m.replyTo.senderName}</span>
                <span className="ChatReplyQuoteText">
                  {previewForReply(m.replyTo.type, m.replyTo.textSnippet, m.replyTo.mediaFileName)}
                </span>
              </button>
            )}
          </div>
        )}

        {m.type === 'Text' && !isEditing && (
          <div className="ChatBubble">
            <p>{highlightText(m.text ?? '', highlightQuery)}</p>
            <span className="ChatBubbleTime">
              {m.isEdited && <span className="ChatBubbleEditedLabel">змінено · </span>}
              {formatMessageTime(m.createdAt)}
            </span>
          </div>
        )}

        {m.type === 'Text' && isEditing && (
          <div className="ChatBubble ChatBubble-editing">
            <input
              type="text"
              className="ChatBubbleEditInput"
              value={editValue}
              autoFocus
              onChange={(e) => onEditChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onEditSave()
                if (e.key === 'Escape') onEditCancel()
              }}
            />
            <div className="ChatBubbleEditActions">
              <button type="button" onClick={onEditSave}>Зберегти</button>
              <button type="button" onClick={onEditCancel}>Скасувати</button>
            </div>
          </div>
        )}

        {m.type === 'TrackShare' && m.track && (
          <div className="ChatBubble ChatBubble-track">
            {m.track.coverImageUrl ? (
              <img src={m.track.coverImageUrl} alt={m.track.title} className="ChatTrackCover" />
            ) : (
              <div className="ChatTrackCover ChatTrackCoverFallback" aria-hidden="true" />
            )}
            <div className="ChatTrackInfo">
              <span className="ChatTrackTitle">{m.track.title}</span>
              <span className="ChatTrackArtist">{m.track.artistName}</span>
            </div>
            <button
              type="button"
              className="ChatTrackPlayBtn"
              aria-label="Відтворити трек"
              onClick={() => onPlayTrack(m.track!, m.createdAt)}
            >
              <PlayTriangleIcon />
            </button>
            <span className="ChatTrackDuration">{formatDuration(m.track.durationSeconds)}</span>
            <span className="ChatBubbleTime">{formatMessageTime(m.createdAt)}</span>
          </div>
        )}

        {m.type === 'Image' && m.mediaUrl && (
          <div className="ChatBubble ChatBubble-media">
            <button
              type="button"
              className="ChatImageBtn"
              aria-label="Переглянути зображення"
              onClick={() => onImageClick(m.mediaUrl!, m.mediaFileName)}
            >
              <img src={m.mediaUrl} alt={m.mediaFileName ?? 'Зображення'} className="ChatImage" />
            </button>
            <span className="ChatBubbleTime">{formatMessageTime(m.createdAt)}</span>
          </div>
        )}

        {m.type === 'Voice' && m.mediaUrl && (
          <>
            <div className="ChatBubble ChatBubble-voice">
              <VoiceMessagePlayer mediaUrl={m.mediaUrl} />
            </div>
            <span className="ChatBubbleTime ChatBubbleTime-voice">{formatMessageTime(m.createdAt)}</span>
          </>
        )}

        {m.type === 'File' && m.mediaUrl && (
          <div className="ChatBubble ChatBubble-file">
            <FileIcon />
            <span className="ChatFileMeta">
              <span className="ChatFileName">{m.mediaFileName ?? 'Файл'}</span>
              <span className="ChatFileSize">{formatFileSize(m.mediaFileSizeBytes)}</span>
            </span>
            <button
              type="button"
              className="ChatFileDownloadBtn"
              aria-label="Завантажити файл"
              disabled={isDownloading}
              onClick={() => void handleDownload()}
            >
              <DownloadFileIcon />
            </button>
            <span className="ChatBubbleTime">{formatMessageTime(m.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
