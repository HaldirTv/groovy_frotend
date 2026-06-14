import '../App.css'
import LogoReg from '../assets/LogoReg.svg'
import MiddleLogo from '../assets/MiddleLogo.svg'
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { register, confirmRegister } from '../api/auth';
import { storeAccessToken } from '../api/tokenStore';

export const Create = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email: string = (location.state as { email?: string } | null)?.email ?? '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showCodeModal, setShowCodeModal] = useState(false);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [codeLoading, setCodeLoading] = useState(false);

    const handleContinue = async () => {

        setLoading(true);
        try {
            await register({
                username: email.split('@')[0],
                email,
                password,
                role: 'Listener',
            });
            setShowCodeModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmCode = async (fullCode: string) => {
        setCodeLoading(true);
        try {
            const result = await confirmRegister({ email, code: fullCode });
            if (result.Token) storeAccessToken(result.Token);
            navigate('/main');
        } catch {

        } finally {
            setCodeLoading(false);
        }
    };

    const handleCodeChange = (value: string, index: number) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);

        if (newCode.every((c) => c !== '')) {
            void handleConfirmCode(newCode.join(''));
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
           <input
             type="password"
             placeholder='Пароль'
             className='CreatePass'
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
        </div>
        <div className='ContCreate'></div>
        <span className='Cont'>
            Має містити не менше 8 символів!
        </span>
        <span className='ConfirmPass'>
            Підтвердити пароль
        </span>
        <div className='InputConfirmPass'>
           <input
             type="password"
             placeholder='Повторіть пароль'
             className='TextConfirmPass'
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.target.value)}
           />
        </div>
        <button className='ContButtonPass' onClick={handleContinue} disabled={loading}>

      </button>
      <span className='ContButtonPassText'>
            {loading ? 'Завантаження' : 'Продовжити'}
      </span>

      {showCodeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '8px', padding: '24px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', textAlign: 'center'}}>
            <p style={{ color: '#202124', fontSize: '14px', marginBottom: '16px' }}>Ми надіслали код підтвердження на {email}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {code.map((symbol, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={symbol}
                  onChange={(e) => handleCodeChange(e.target.value, index)}
                  disabled={codeLoading}
                  style={{ width: '36px', height: '44px', textAlign: 'center', fontSize: '18px', border: '1px solid #dadce0', borderRadius: '4px', outline: 'none' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
        </div>
       );
    };