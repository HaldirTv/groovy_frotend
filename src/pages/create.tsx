import '../App.css'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { useNavigate } from 'react-router-dom';

export const Create = () => {
        const navigate = useNavigate();
      return (
        <div className='Reg'>
            <img src={MiddleLogo} className='MiddleLogo'  />
        <div className='RegHeader'>
            <img src={LogoReg} className='RegLogo' />
        </div>
        <span className='CreateText'>
            Створення акаунту
        </span>
        <span className='PassCreate'>
            Пароль
        </span>
        <div className='InputCreatePass'>
           <input type="text" placeholder='Пароль' className='CreatePass' />
        </div>
        <div className='ContCreate'></div>
        <span className='Cont'>
            Має містити не менше 8 символів!
        </span>
        <span className='ConfirmPass'>
            Підтвердити пароль
        </span>
        <div className='InputConfirmPass'>
           <input type="text" placeholder='Повторіть пароль' className='TextConfirmPass' />
        </div>
        <button className='ContButtonPass' onClick={() => navigate('/main')}>
        
      </button>
      <span className='ContButtonPassText'>
            Продовжити
      </span>
        </div>
       );
    };