import React from "react"
import "./style.css"

// SVG assets — заміни файли коли будуть готові
// Очікувані файли в цій папці:
//   icon.svg        → AI-бейдж іконка
//   icon-2.svg      → іконка годинника
//   icon-3.svg      → іконка відтворення (play)
//   icon-4.svg      → іконка лайку/серця
//   icon-5.svg      → іконка "ще" (три крапки)
//   image.svg       → іконка слухачів
//   mask-group.svg  → фонове зображення секції
//   AI-generated-playlist-cover.png → обкладинка плейлиста

export const HeroSectionMargin = (): React.JSX.Element => {
  return (
    <div className="hero-section-margin">
      <div className="hero-section">
        {/* Background: replace src with actual file when available */}
        <img
          className="mask-group"
          alt="Background"
          src="/src/pages/ai-mix/components/HeroSectionMargin/mask-group.svg"
        />

        <div className="gradient" />

        <div className="container">
          {/* Cover Image */}
          <div className="cover-image">
            <div className="AI-generated" />
            <div className="div" />
          </div>

          {/* Playlist Details */}
          <div className="playlist-details">

            {/* Top badges row */}
            <div className="container-2">
              <div className="overlay-border">
                <div className="container-3">
                  <img
                    className="icon"
                    alt="AI icon"
                    src="/src/pages/ai-mix/components/HeroSectionMargin/icon.svg"
                  />
                </div>
                <div className="text-wrapper">ШІ Згенеровано</div>
              </div>

              <div className="container-3">
                <div className="text-wrapper-2">Оновлено: Сьогодні</div>
              </div>
            </div>

            {/* Title */}
            <div className="heading">
              <div className="text-wrapper-3">Кіберпанк ШІ: Нейронні Біти</div>
            </div>

            {/* Description */}
            <div className="groovra-AI-core-wrapper">
              <p className="groovra-AI-core">
                Пориньте у синтетичні звукові ландшафти, згенеровані нашою найновішою моделлю <br />
                &apos;Groovra AI Core&apos;. Ідеально для кодування або нічних поїздок.
              </p>
            </div>

            {/* Stats */}
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
                  <div className="text-wrapper-4">142K Слухачів</div>
                </div>

                <div className="container-5">
                  <div className="container-3">
                    <img
                      className="icon-2"
                      alt="Duration"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/icon-2.svg"
                    />
                  </div>
                  <div className="text-wrapper-4">2 год 45 хв</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="container-wrapper">
              <div className="container-6">
                <button className="button" type="button" aria-label="Слухати плейлист">
                  <div className="icon-wrapper">
                    <img
                      className="icon-3"
                      alt="Play"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/icon-3.svg"
                    />
                  </div>
                  <div className="text-wrapper-5">Слухати</div>
                </button>

                <div
                  className="div-wrapper"
                  role="button"
                  tabIndex={0}
                  aria-label="Додати до вибраного"
                >
                  <div className="icon-wrapper">
                    <img
                      className="icon-4"
                      alt="Like"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/icon-4.svg"
                    />
                  </div>
                </div>

                <div
                  className="div-wrapper"
                  role="button"
                  tabIndex={0}
                  aria-label="Більше опцій"
                >
                  <div className="icon-wrapper">
                    <img
                      className="icon-5"
                      alt="More options"
                      src="/src/pages/ai-mix/components/HeroSectionMargin/icon-5.svg"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
