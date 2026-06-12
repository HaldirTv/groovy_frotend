import '../App.css'
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg'
import Home from '../assets/IconHome.svg'
import Search from '../assets/IconSearch.svg'
import Library from '../assets/IconLibrary.svg'
import Playlist from '../assets/IconPlaylist.svg'
import Liked from '../assets/IconLiked.svg'
import AI from '../assets/IconAI.svg'
import Downloads from '../assets/IconDownloads.svg'
import BackLogo from '../assets/Frame 4.svg'
import HeaderSearch from '../assets/HeaderSearch.svg'
import Notification from '../assets/IconNotification.svg'
import Avatar from '../assets/IconAvatar.svg'
import Right from '../assets/IconRight.svg'
import Volume from '../assets/IconVolume.svg'
import Button from '../assets/Button.svg'
import Remix from '../assets/IconRemix.svg'
import Settings from '../assets/IconSettings.svg'
import LeftArrow from '../assets/LeftArrowLogo.svg'
import Pause from '../assets/IconPause.svg'
import RightArrow from '../assets/RightArrowLogo.svg'
import Ref from '../assets/IconRef.svg'
import Arrow from '../assets/IconArrow.svg'
import Cover from '../assets/Cover.svg'

export const Main = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const navigate = useNavigate();
    const profileName = "Profile";

    const [volume, setVolume] = useState(70); 
    const trackRef = useRef<HTMLDivElement>(null);

    const handleSliderClick = (e: { clientX: number; }) => {
        if (!trackRef.current) return;
        
        const rect = trackRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left; 
        const width = rect.width;
        
        let newVolume = Math.round((clickX / width) * 100);
        newVolume = Math.max(0, Math.min(100, newVolume));
        
        setVolume(newVolume);
    };
    return (
        <div className='Main'>
            <div className='Main2'>
                <div className='TrendingNow'>
                        <div className='ContTextTrendingNow'>
                            <span className='LisNowTrending'>Слухають зараз</span>
                            <span className='TrendNowText'>У тренді зараз</span>
                        </div>
                        <button className='ButtonViewAll'>
                            <span className='TextViewAll'>VIEW ALL</span>
                            <img src={Arrow} className='ArrowViewAll' />
                        </button>
                    </div>
                <div className='Personalized'>
                <div className='PersonalizedContText'>
                <div className='PersonalizedText'>
                    <span className='PersonalizedTextHead'>ПЕРСОНАЛІЗОВАНИЙ АЛГОРИТМ</span>
                </div>
                <span className='PersonalizedTextF'>Музика за стилем та настроєм</span>
                </div>
                <button className='PersonalizedButtonView'>
                    <span className='ButtonTextView'>VIEW ALL</span>
                    <img src={Arrow} className='ArrowViewAll' />
                </button>
                </div>

                <div></div>

                <div className='MusicCardCont'>
                    <div className='MusicCard'>
                        <div className='OverCover'>
                            <img src={Cover} className='CoverImg' />
                        </div>
                        <div className='ContMusicCardText'>
                            <span className='HeadText'>Назва треку</span>
                            <span className='AuthorText'>Виконавець</span>
                            <span className='StyleTrack'>POP</span>
                        </div>
                    </div>
                <div className='MusicCard'>
                    <div className='OverCover'>
                        <img src={Cover} className='CoverImg' />
                    </div>
                    <div className='ContMusicCardText'>
                        <span className='HeadText'>Назва треку</span>
                        <span className='AuthorText'>Виконавець</span>
                        <span className='StyleTrack'>POP</span>
                    </div>
                </div>
                <div className='MusicCard'>
                    <div className='OverCover'>
                        <img src={Cover} className='CoverImg' />
                    </div>
                    <div className='ContMusicCardText'>
                        <span className='HeadText'>Назва треку</span>
                        <span className='AuthorText'>Виконавець</span>
                        <span className='StyleTrack'>POP</span>
                    </div>
                </div>
                <div className='MusicCard'>
                    <div className='OverCover'>
                        <img src={Cover} className='CoverImg' />
                    </div>
                    <div className='ContMusicCardText'>
                        <span className='HeadText'>Назва треку</span>
                        <span className='AuthorText'>Виконавець</span>
                        <span className='StyleTrack'>POP</span>
                    </div>
                </div>
                <div className='MusicCard'>
                    <div className='OverCover'>
                        <img src={Cover} className='CoverImg' />
                    </div>
                    <div className='ContMusicCardText'>
                        <span className='HeadText'>Назва треку</span>
                        <span className='AuthorText'>Виконавець</span>
                        <span className='StyleTrack'>POP</span>
                    </div>
                </div>
                <div className='MusicCard'>
                    <div className='OverCover'>
                        <img src={Cover} className='CoverImg' />
                    </div>
                    <div className='ContMusicCardText'>
                        <span className='HeadText'>Назва треку</span>
                        <span className='AuthorText'>Виконавець</span>
                        <span className='StyleTrack'>POP</span>
                    </div>
                </div>
                <div className='MusicCard'>
                    <div className='OverCover'>
                        <img src={Cover} className='CoverImg' />
                    </div>
                    <div className='ContMusicCardText'>
                        <span className='HeadText'>Назва треку</span>
                        <span className='AuthorText'>Виконавець</span>
                        <span className='StyleTrack'>POP</span>
                    </div>
                </div>
                <div className='MusicCard'>
                    <div className='OverCover'>
                        <img src={Cover} className='CoverImg' />
                    </div>
                    <div className='ContMusicCardText'>
                        <span className='HeadText'>Назва треку</span>
                        <span className='AuthorText'>Виконавець</span>
                        <span className='StyleTrack'>POP</span>
                    </div>
                </div>

            

                </div>
            <img src={BackLogo} className='BackLogo'/>
            <div className='ContMainHello'>
                <span className='MainHeaderText'>Добрий вечір, </span>
                <div className='NameText'>
                    <span className='ProfileText'>{profileName}</span>
                    
                </div>
            </div>
            <div className='OpCont'>
                    <span className='OpText '>Час набирати ауру, оберіть плейлист</span>
                    </div>
            <div className='MainLine'></div>
            </div>
            <div className='Sidebar'>
                <div className='SidebarHeader'>
                    <img src={Logo} className='Logo' />
                    <span className='Groovra'>GROOVRA</span>
                </div>
                <div className={`NavItem ${activeTab === 'Home' ? 'active' : ''}`} 
                onClick={() => setActiveTab('Home')}>
                {activeTab === 'Home' && <div className="ActiveLine" />}
                    <img src={Home} />
                    <span className='NavText'>Головна</span>
                </div>
                <div className={`NavItem ${activeTab === 'Search' ? 'active' : ''}`} 
                onClick={() => setActiveTab('Search')}> 
                {activeTab === 'Search' && <div className="ActiveLine" />} 
                    <img src={Search} /> 
                    <span className='NavText'>Пошук</span> 
                </div>
                <div className={`NavItem ${activeTab === 'Library' ? 'active' : ''}`}
                onClick={() => setActiveTab('Library')}>
                {activeTab === 'Library' && <div className='ActiveLine'/>}    
                    <img src={Library} />
                    <span className='NavText'>Бібліотека</span>
                </div>
                    <div className='ContTextColl'>
                        <span className='TextColl'>Ваші Колекції</span>
                    </div>
                <div className={`NavItem ${activeTab === 'Playlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('Playlist')}>
                {activeTab === 'Playlist' && <div className='ActiveLine'/>}
                    <img src={Playlist}  />
                    <span className='NavText'>Плейлисти</span>
                </div>
                <div className={`NavItem ${activeTab === 'Liked' ? 'active' : ''}`}
                onClick={() => setActiveTab('Liked')}>
                {activeTab === 'Liked' && <div className='ActiveLine'/>}
                    <img src={Liked}  />
                    <span className='NavText'>Улюблене</span>
                </div>
                <div className={`NavItem ${activeTab === 'AI' ? 'active' : ''}`}
                onClick={() => setActiveTab('AI')}>
                {activeTab === 'AI' && <div className='ActiveLine'/>}
                    <img src={AI}  />
                    <span className='NavText'>AI мікс</span>
                </div>
                <div className={`NavItem ${activeTab === 'Downloads' ? 'active' : ''}`}
                onClick={() => setActiveTab('Downloads')}>
                {activeTab === 'Downloads' && <div className='ActiveLine'/>}
                    <img src={Downloads}  />
                    <span className='NavText'>Завантаження</span>
                </div>
                <div className={`NavItem ${activeTab === 'Settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('Settings')}>
                {activeTab === 'Settings' && <div className='ActiveLine'/>}
                    <img src={Settings}  />
                    <span className='NavText'>Налаштування</span>
                </div>

                </div>
                <div className='MainHeader'>
                    <div className='ContSearch'>
                        <div className='SecContHeader'>
                        <img src={HeaderSearch} className='HeaderSearch' />
                        <input type="text" className='InputSearch' placeholder='Пошук треків, виконавців або настроїв...' />
                        </div>
                    </div>
                    <div className='UserCont'>
                    <img src={Notification} className='Notificationicon'  />
                    <div className='profileCont'>
                    <img src={Avatar} className='AvatarIcon' />
                    <button className='ButtonProfile'  onClick={() => navigate('/profile')}>{profileName}</button>
                    </div>
                    </div>
                </div>
                <div className='FooterPlayer'>
                    <div className='TrackContainer'>
                    <div className='CurrentPlaying '></div>
                    
                    <span className='NameOfTrack'>Track</span>
                    <span className='Author'>Author</span>

                    <button className='IconLiked '>
                            <img src={Liked} />
                        </button>
                    </div>

                     <div className='ContPlayBack'> 
                         <div className='PlayeerCont'>
                            <button className='ButtonRemix'>
                                <img src={Remix} className='LogoRemix' />
                            </button>
                            <button className='LeftArrowButton'>
                                <img src={LeftArrow} className='LeftArrow'/>
                            </button>
                            <button className='PauseButton'>
                                <img src={Pause} className='PauseLogo'/>
                            </button>
                            <button className='ButtonRightArrow'>
                                <img src={RightArrow} className='RightArrowLogo' />
                            </button>
                            <button className='RefButton'>
                                <img src={Ref} className='RefLogo'/>
                            </button>

                        </div>

                        <div className='ContStartTime'>
                            <span className='StartTime'>00:00</span>
                            <div className='PlayBackLine'></div>
                            <span className='EndTime'>99:99</span>
                        </div>
                    </div> 
                  

                    <div className='Volume'>
                    <button className='ButtonIcon'><img src={Button} className='ButtonIcon' /></button>
                    <img src={Volume} className='VolumeIcon' />
                    <div className='ContVolume' ref={trackRef} onClick={handleSliderClick}>
                    <div className='VolumeFill' style={{ width: `${volume}%` }}></div>
                    </div>
                    
                    
                    <button className='ButtonRight'><img src={Right} /></button>
                    </div>
                    
                    </div>
                    

                </div>
    );
};