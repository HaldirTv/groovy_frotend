import React from "react"
import { useTranslation } from 'react-i18next'
import "./style.css"

const ASSETS = "/src/pages/ai-mix/components/NewAiAlbums"

const albums = [
  { img: `${ASSETS}/image.png`,      name: "Cybernetic Oasis",   tracks: "12 Tracks",   tracksEn: "12 Tracks"   },
  { img: `${ASSETS}/mask-group.png`,  name: "Neon Rain",          tracks: "10 Треків",   tracksEn: "10 Tracks"   },
  { img: `${ASSETS}/mask-group-2.png`,name: "Synthesized Mind",   tracks: "8 Треків",    tracksEn: "8 Tracks"    },
  { img: `${ASSETS}/mask-group-3.png`,name: "Digital Horizon",    tracks: "14 Треків",   tracksEn: "14 Tracks"   },
  { img: `${ASSETS}/mask-group-4.png`,name: "Neural Waves",       tracks: "9 Треків",    tracksEn: "9 Tracks"    },
  { img: `${ASSETS}/mask-group-5.png`,name: "Virtual Echoes",     tracks: "11 Треків",   tracksEn: "11 Tracks"   },
]

export const NewAiAlbums = (): React.JSX.Element => {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  return (
    <div className="new-ai-albums">
      
      <div className="container-header">
        <div className="heading-trending">
          <h2 className="text-wrapper-trending">{t('aimix.stats_title')}</h2>
        </div>
        <button className="button-more-albums" type="button" aria-label={t('aimix.more_albums')}>
          <span className="text-wrapper-more">{t('aimix.more_albums')}</span>
          <img
            className="icon-arrow"
            alt="Arrow"
            src="/src/pages/ai-mix/components/NewAiAlbums/icon.svg"
          />
        </button>
      </div>

      
      <div className="container-albums-grid">
        {albums.map((album, index) => (
          <div className="container-album-card" key={index}>
            <div className="image-album-cover">
              <img className="img-album" alt={album.name} src={album.img} />
            </div>
            <div className="container-album-info">
              <div className="text-wrapper-album-name">{album.name}</div>
              <div className="text-wrapper-tracks-count">
                {isEn ? album.tracksEn : album.tracks}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
