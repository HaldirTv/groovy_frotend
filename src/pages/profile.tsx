import '../App.css'
import Group from '../assets/Group 3 (1).svg'
import home from '../assets/Home.svg'
import Search from '../assets/Search.svg'
import Library from '../assets/Library.svg'
import Playlist from '../assets/Playlist.svg'
import Liked from '../assets/Liked.svg'
import AI from '../assets/AI.svg'
import Downloads from '../assets/Downloads.svg'

export const Profile = () => {
    
    return (
        <div className='Profile'>
            <img src={Group} className='HeaderTextProfile' />
            <div className='ContPlayer'></div>
            <div className='Line'></div>
            <img src={home} className='HomeLogo' />
            <span className='HomeText'>Home</span>
            <img src={Search} className='SearchLogo' />
            <span className='SearchText'>Search</span>
            <img src={Library} className='LibraryLogo' />
            <span className='LibraryText'>Library</span>
            <span className='Collection'>YOUR COLLECTIONS</span>
            <img src={Playlist} className='PlaylistLogo' />
            <span className='PlaylistText'>Playlist</span>
            <img src={Liked} className='LikedLogo'/>
            <span className='LikedText'>Liked</span>
            <img src={AI} className='AILogo' />
            <span className='AIText'>AI Mix</span>
            <img src={Downloads} className='DownloadsLogo' />
            <span className='DownloadText'>Downloads</span>
            
        </div>
    );
};