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
                
            <img src={BackLogo} className='BackLogo'/>
            <div className='ContMainHello'>
                <span className='MainHeaderText'>Good evening, </span>
                <div className='NameText'>
                    <span className='ProfileText'>{profileName}</span>
                    
                </div>
            </div>
            <div className='OpCont'>
                    <span className='OpText '>It's time to grow your aura, choose a playlist</span>
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
                    <span className='NavText'>Home</span>
                </div>
                <div className={`NavItem ${activeTab === 'Search' ? 'active' : ''}`} 
                onClick={() => setActiveTab('Search')}> 
                {activeTab === 'Search' && <div className="ActiveLine" />} 
                    <img src={Search} /> 
                    <span className='NavText'>Search</span> 
                </div>
                <div className={`NavItem ${activeTab === 'Library' ? 'active' : ''}`}
                onClick={() => setActiveTab('Library')}>
                {activeTab === 'Library' && <div className='ActiveLine'/>}    
                    <img src={Library} />
                    <span className='NavText'>Library</span>
                </div>
                    <div className='ContTextColl'>
                        <span className='TextColl'>YOUR COLLECTIONS</span>
                    </div>
                <div className={`NavItem ${activeTab === 'Playlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('Playlist')}>
                {activeTab === 'Playlist' && <div className='ActiveLine'/>}
                    <img src={Playlist}  />
                    <span className='NavText'>Playlist</span>
                </div>
                <div className={`NavItem ${activeTab === 'Liked' ? 'active' : ''}`}
                onClick={() => setActiveTab('Liked')}>
                {activeTab === 'Liked' && <div className='ActiveLine'/>}
                    <img src={Liked}  />
                    <span className='NavText'>Liked</span>
                </div>
                <div className={`NavItem ${activeTab === 'AI' ? 'active' : ''}`}
                onClick={() => setActiveTab('AI')}>
                {activeTab === 'AI' && <div className='ActiveLine'/>}
                    <img src={AI}  />
                    <span className='NavText'>AI mix</span>
                </div>
                <div className={`NavItem ${activeTab === 'Downloads' ? 'active' : ''}`}
                onClick={() => setActiveTab('Downloads')}>
                {activeTab === 'Downloads' && <div className='ActiveLine'/>}
                    <img src={Downloads}  />
                    <span className='NavText'>Downloads</span>
                </div>

                </div>
                <div className='MainHeader'>
                    <div className='ContSearch'>
                        <div className='SecContHeader'>
                        <img src={HeaderSearch} className='HeaderSearch' />
                        <input type="text" className='InputSearch' placeholder='Search for tracks, artists, or moods...' />
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

                    {/* <div className='ContPlayBack'> 
                        <div className='ContStartTime'>
                            <span className='StartTime'>00:00</span>
                            <div className='PlayBackLine'></div>
                        </div>
                        <div className='PlayeerCont'>
                        <button className='ButtonRemix'>
                            <img src={Remix} className='LogoRemix' />
                        </button>
                    </div>
                    </div> */}
                  

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