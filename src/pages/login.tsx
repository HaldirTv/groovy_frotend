import '../App.css'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import Google from '../assets/Google.svg'
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export const Log = () => {
  const navigate = useNavigate();
  const loginWithGoogle = useGoogleLogin({onSuccess: () => {}, });
  return (
    <div className='Reg'>
        <img src={MiddleLogo} className='MiddleLogo'  />
        <span className='WelcomeText'>
            З поверненням!
        </span>
        <div className='RegHeader'>
            <img src={LogoReg} className='RegLogo' />
      </div>
      <div className='Conta'></div>
      <span className='LogEmail'>
      Електронна пошта
      </span>
      <div className='LogInputEmail'>
           <input type="text" placeholder='Уведіть пошту' className='InputText' />
        </div>
        <span className='LogPass'>
            Пароль
        </span>
        <div className='InputLogPass'>
           <input type="text" placeholder='Пароль' className='InputTextPass' />
        </div>
        <Link to="/forgotpassword" className='LogForgot'>Забули пароль?</Link>
        <button className='ContButtonLog' onClick={() => navigate('/main')}>
        
      </button>
      <button className='GoogleLog' onClick={() => loginWithGoogle()}>
        
      </button>
      <img src={Google} className='GoogleContLog' />
      <span className='GoogleTextLog'>
       Увійти через гугл
      </span>
      <span className='ContButtonTextLog'>Продовжити</span>
      <span className='LogOR'>Або</span>
      <span className='DontHaveAccount'>Ще не маєте акаунту?</span>
  <Link to="/reg" className="CreateLink">
    Зареєструватися
  </Link>
    </div>
  );
}