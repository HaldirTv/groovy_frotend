import '../App.css'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { useState } from 'react';

export const Cod = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value; 
    setCode(newCode);
    };
    return (
        <div className='Reg'>
            <img src={MiddleLogo} className='CodMiddleLogo'  />
             <div className='RegHeader'>
            <img src={LogoReg} className='RegLogo' />
            </div>
            <span className='CodMainText'>Відновлення паролю</span>
            <span className='CodText'>Ми надіслали код підтвердження на вашу пошту!</span>
            <div className="CodContainer">
        {code.map((symbol, index) => (
          <input key={index} type="text" maxLength={1} value={symbol}
            onChange={(e) => handleChange(e.target.value, index)} className="CodInput" />
        ))}
      </div>
        </div>
    )
};