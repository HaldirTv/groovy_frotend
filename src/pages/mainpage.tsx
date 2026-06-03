import '../App.css'
import { useState } from 'react';
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

export const Main = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const navigate = useNavigate();
    return (
        <div className='Main'>
            <div className='Main2'>
                
            <img src={BackLogo} className='BackLogo'/>
            <div className='ContMainHello'>
            <div className='MainLine'></div>
            </div>
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
                    <button className='ButtonProfile'  onClick={() => navigate('/profile')}>Profile</button>
                    </div>
                    </div>
                </div>
            </div>
    );
};