import '../App.css'
import { useState } from 'react';
import Logo from '../assets/Logo.svg'
import Home from '../assets/IconHome.svg'

export const Main = () => {
    const [activeTab, setActiveTab] = useState('Home');
    return (
        <div className='Main'>
            <div className='Sidebar'>
                <div className='SidebarHeader'>
                    <img src={Logo} className='Logo' alt="Groovra Logo" />
                    <span className='Groovra'>GROOVRA</span>
                </div>
                <div className={`NavItem ${activeTab === 'Home' ? 'active' : ''}`} 
                onClick={() => setActiveTab('Home')}>
                {activeTab === 'Home' && <div className="ActiveLine" />}
                    <img src={Home} />
                    <span className='NavText'>Home</span>
                </div>

            </div>
        </div>
    );
};