import '../App.css'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import Google from '../assets/Google.svg'
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

export const Reg = () => {
    const loginWithGoogle = useGoogleLogin({onSuccess: () => {}, });
    const navigate = useNavigate();
      return (
    <div className='Reg'>
        <img src={MiddleLogo} className='MiddleLogo'  />
        <div className='Rec'></div>
        <span className='MiddleText'>
            Доєднайся до нашої музичної спільноти!
        </span>
        <span className='RegEmail'>
           E-Mail
        </span>
        <div className='InputEmail'>
           <input type="text" placeholder='Уведіть пошту' className='InputText' />
        </div>
        <div className='RegHeader'>
            <img src={LogoReg} className='RegLogo' />
      </div>
      <button className='ContButton' onClick={() => navigate('/create')}>
        
      </button>
      <span className='ContButtonText'>Продовжити</span>
      <span className='TextOR'>Або</span>
      <button className='GoogleReg' onClick={() => loginWithGoogle()}>
        
      </button>
      <img src={Google} className='GoogleCont' />
      <span className='GoogleText'>
        Зареєструватися через гугл
      </span>
    <p className="HaveAccount">
  Вже маєте акаунт?
  </p>
  <Link to="/login" className="LoginLink">
  Увійти
  </Link>

    </div>
  );
};