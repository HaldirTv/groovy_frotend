import '../App.css'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'

export const Recovery = () => {
    return (
        <div className='Reg'>
            <img src={MiddleLogo} className='MiddleLogoRec'  />
        <div className='RegHeader'>
            <img src={LogoReg} className='RegLogo' />
        </div>
        <div className='ContCreate'></div>
        <span className='Recovery'>Відновлення паролю</span>
        <span className='Type'>Введіть новий пароль</span>
        <div className='NewPass'>
            <input type="text" placeholder='Пароль' className='IputNewPass'/>
        </div>
        <span className='WarNewPass'>Має містити не менше 8 символів!</span>
        <span className='ConfNewPass'>Підтвердити пароль</span>
        <div className='ContConfNewPass'>
            <input type="text" placeholder='Повторіть пароль' className='InputConfNewPass'/>
        </div>
        <button className='ButtonNewPass'>
            
        </button>
        <span className='TextButtonNewPass'>Продовжити</span>
        </div>

    )
};