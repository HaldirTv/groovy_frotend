import '../App.css'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { Link, useNavigate } from 'react-router-dom';

export const Forgot = () => {
    const navigate = useNavigate();
    return (
        <div className='Reg'>
            <img src={MiddleLogo} className='ForgotMiddleLogo'  />
            <div className='RegHeader'>
            <img src={LogoReg} className='RegLogo' />
            <div className='ForgotCont'></div>
            <span className='RepPass'>Відновлення паролю</span>
            <span className='EmailRepPass'>E-Mail</span>
            <div className='ContEmailRep'>
                <input type="text" placeholder='Уведіть пошту' className='ContEmailRepText' />
            </div>
            <button onClick={() => navigate('/emailcod')} className='ButtonRep'></button>
            <span className='ButtonTextRep'>Продовжити</span>
            <Link to="/reg" className='BackTo'>Повернутися до сторінки реєстрації</Link>
            
      </div>
        </div>
    )
};