import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import "./style.css"

interface HeroSectionMarginProps {
  playlist: any | null
  isLoading: boolean
  loadingMessage: string
  error: string | null
  onGenerate: (prompt: string) => void
  onReset: () => void
  onPlayPlaylist: () => void
  isLiked: boolean
  onToggleLike: () => void
}

export const HeroSectionMargin = ({
  playlist,
  isLoading,
  loadingMessage,
  error,
  onGenerate,
  onReset,
  onPlayPlaylist,
  isLiked,
  onToggleLike
}: HeroSectionMarginProps): React.JSX.Element => {
  const { t, i18n } = useTranslation()
  const [promptText, setPromptText] = useState("")

  const suggestionsUk = [
    "Космічний кодинг під атмосферні синти",
    "Нічна поїздка під динамічний ретровейв",
    "Максимальне розслаблення та ембієнт",
    "Бадьорий кібер-поп для тренувань"
  ]

  const suggestionsEn = [
    "Cosmic coding with atmospheric synths",
    "Night drive under dynamic retrowave",
    "Deep relaxation and ambient textures",
    "Upbeat cyber-pop for workouts"
  ]

  const suggestions = i18n.language === "en" ? suggestionsEn : suggestionsUk

  const handleChipClick = (suggestion: string) => {
    setPromptText(suggestion)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (promptText.trim()) {
      onGenerate(promptText)
    }
  }

  // Format total duration: e.g. "2 год 45 хв" or "2h 45m"
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    
    if (i18n.language === "en") {
      return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`
    } else {
      return `${hours > 0 ? `${hours} год ` : ""}${minutes} хв`
    }
  }

  return (
    <div className="hero-section-margin">
      <div className="hero-section">
        <img
          className="mask-group"
          alt="Background"
          src="/src/pages/ai-mix/components/HeroSectionMargin/mask-group.svg"
        />
        <div className="gradient" />

        <div className="container">
          {isLoading ? (
            <div className="ai-loading-container">
              <div className="ai-loading-spinner" />
              <div className="ai-loading-text">{loadingMessage}</div>
            </div>
          ) : !playlist ? (
            <div className="playlist-details" style={{ left: 0, width: "100%", top: "calc(50% - 130px)" }}>
              <div className="container-2">
                <div className="overlay-border">
                  <div className="container-3">
                    <img
                      className="icon"
                      alt="AI icon"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/icon.svg"
                    />
                  </div>
                  <div className="text-wrapper">{t("aimix.generated", { defaultValue: "ШІ Згенеровано" })}</div>
                </div>
              </div>

              <div className="heading">
                <div className="text-wrapper-3" style={{ fontSize: "36px", lineHeight: "44px" }}>
                  {t("aimix.generation_title", { defaultValue: "Згенерувати персональний ШІ Мікс" })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="ai-prompt-container">
                <textarea
                  className="ai-prompt-textarea"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder={t("aimix.prompt_placeholder", { defaultValue: "Опишіть ваш настрій, жанр чи атмосферу (наприклад: 'Космічний релакс під ембієнт')..." })}
                />
                
                {error && <div className="ai-error-message">{error}</div>}

                <div className="ai-prompt-chips">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="ai-prompt-chip"
                      onClick={() => handleChipClick(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="container-6" style={{ marginTop: "8px" }}>
                  <button
                    className="button"
                    type="submit"
                    disabled={!promptText.trim()}
                    style={{ opacity: promptText.trim() ? 1 : 0.6 }}
                  >
                    <div className="text-wrapper-5" style={{ color: "#a98fdb" }}>
                      {t("aimix.generate_btn", { defaultValue: "Створити ШІ мікс" })}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="cover-image">
                <div className="AI-generated" />
                <div className="div" />
              </div>

              <div className="playlist-details">
                <div className="container-2">
                  <div className="overlay-border">
                    <div className="container-3">
                      <img
                        className="icon"
                        alt="AI icon"
                        src="/src/pages/ai-mix/components/HeroSectionMargin/icon.svg"
                      />
                    </div>
                    <div className="text-wrapper">{t("aimix.generated", { defaultValue: "ШІ Згенеровано" })}</div>
                  </div>

                  <div className="container-3">
                    <div className="text-wrapper-2">{t("aimix.updated_today", { defaultValue: "Оновлено: Сьогодні" })}</div>
                  </div>
                </div>

                <div className="heading">
                  <div className="text-wrapper-3">{playlist.title}</div>
                </div>

                <div className="groovra-AI-core-wrapper">
                  <p className="groovra-AI-core">{playlist.description}</p>
                </div>

                <div className="margin">
                  <div className="container-4">
                    <div className="container-5">
                      <div className="container-3">
                        <img
                          className="img"
                          alt="Listeners"
                          src="/src/pages/ai-mix/components/HeroSectionMargin/image.svg"
                        />
                      </div>
                      <div className="text-wrapper-4">
                        {playlist.trackCount} {playlist.trackCount === 1 ? t("tracks_count_one", { count: 1, defaultValue: "трек" }) : t("tracks_count_many", { count: playlist.trackCount, defaultValue: "треків" })}
                      </div>
                    </div>

                    <div className="container-5">
                      <div className="container-3">
                        <img
                          className="icon-2"
                          alt="Duration"
                          src="/src/pages/ai-mix/components/HeroSectionMargin/icon-2.svg"
                        />
                      </div>
                      <div className="text-wrapper-4">{formatDuration(playlist.totalDurationSeconds)}</div>
                    </div>
                  </div>
                </div>

                <div className="container-wrapper">
                  <div className="container-6">
                    <button className="button" type="button" onClick={onPlayPlaylist} aria-label={t("aimix.listen_btn", { defaultValue: "Слухати" })}>
                      <div className="icon-wrapper">
                        <img
                          className="icon-3"
                          alt="Play"
                          src="/src/pages/ai-mix/components/HeroSectionMargin/icon-3.svg"
                        />
                      </div>
                      <div className="text-wrapper-5">{t("aimix.listen_btn", { defaultValue: "Слухати" })}</div>
                    </button>

                    <div
                      className="div-wrapper"
                      role="button"
                      tabIndex={0}
                      onClick={onToggleLike}
                      aria-label={isLiked ? "Видалити з вибраного" : "Додати до вибраного"}
                      style={{ color: isLiked ? "#71deef" : "#a98fdb", borderColor: isLiked ? "#71deef" : "#a98fdb" }}
                    >
                      <div className="icon-wrapper">
                        <img
                          className="icon-4"
                          alt="Like"
                          src="/src/pages/ai-mix/components/HeroSectionMargin/icon-4.svg"
                          style={{ filter: isLiked ? "hue-rotate(180deg) saturate(3)" : "none" }}
                        />
                      </div>
                    </div>

                    <button
                      className="button"
                      type="button"
                      onClick={onReset}
                      style={{ border: "1px dashed rgba(169, 143, 219, 0.4)" }}
                    >
                      <div className="text-wrapper-5" style={{ color: "#a98fdb" }}>
                        {t("aimix.generate_new", { defaultValue: "Створити інший" })}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
