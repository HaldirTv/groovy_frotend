import '../App.css'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Create = () => {
        const navigate = useNavigate();
        const [password, setPassword] = useState('');
        const handleContinue = () => {
        if (password.length >= 8) {
            navigate('/main');
        }
    };
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
           <input type="text" placeholder='Пароль' className='CreatePass' value={password} onChange={(e) => setPassword(e.target.value)}/>
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
        <button className='ContButtonPass' onClick={handleContinue}>
        
      </button>
      <span className='ContButtonPassText'>
            Продовжити
      </span>
        </div>
       );
    };