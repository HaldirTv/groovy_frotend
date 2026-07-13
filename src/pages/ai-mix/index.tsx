import React from "react"
import { HeroSectionMargin } from "./components/HeroSectionMargin"
import { SectionStatistics } from "./components/SectionStatistics"
import { SectionRealTime } from "./components/SectionRealTime"
import { NewAiAlbums } from "./components/NewAiAlbums"
import { NewHowAiCreates } from "./components/NewHowAiCreates"
import { AiMixesSection } from "./components/AiMixesSection"
import { ContentGridAi } from "./components/ContentGridAi"
import { FooterFromJson } from "../../components/footer-from-json"
import "./ai-mix.css"

export const AiMixPage = (): React.JSX.Element => {
  return (
    <div className="ai-mix-page">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="bg-glow bg-glow-3" />

      <HeroSectionMargin />
      <SectionStatistics />
      <SectionRealTime />
      <NewAiAlbums />
      <NewHowAiCreates />
      <AiMixesSection />
      <ContentGridAi />
      <FooterFromJson />
    </div>
  )
}

