import './profile.css'
import { useState, useRef, useEffect } from 'react';
import Exit from '../assets/ExitIcon.svg' 
import LinkIcon from '../assets/LinkIcon.svg'
import DollarIcon from '../assets/DollarIcon.svg'
import TrashIcon from '../assets/TrashIcon.svg'

type EditUser = {
    avatar: string;
    name: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    bio: string; 
};

export type ProfileData = {
    displayName: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    bio: string;
    avatarFile: File | null;
    avatarPreviewUrl: string;
    linkUrl: string;
    linkLabel: string;
    supportLink: string;
};

type EditProfileProps = {
    user: EditUser;
    onClose: () => void;
    onSave: (data: ProfileData) => void;
};

export const EditProfile = ({ user, onClose, onSave }: EditProfileProps) => {
    const [displayName, setDisplayName] = useState(user.name);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [city, setCity] = useState(user.city);
    const [country, setCountry] = useState(user.country);
    const [bio, setBio] = useState(user.bio);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(user.avatar);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [LinkTipOpen, setLinkTipOpen] = useState(false);
    const linkTipRef = useRef<HTMLDivElement>(null);

    const [LinkRowOpen, setLinkRowOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkLabel, setLinkLabel] = useState('');

    const [SupportRowOpen, setSupportRowOpen] = useState(false);
    const [supportLink, setSupportLink] = useState('');

    useEffect(() => {
        if (!LinkTipOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (linkTipRef.current && !linkTipRef.current.contains(e.target as Node)) {
                setLinkTipOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [LinkTipOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveLinkRow = () => {
        setLinkUrl('');
        setLinkLabel('');
        setLinkRowOpen(false);
    };

    const handleRemoveSupportRow = () => {
        setSupportLink('');
        setSupportRowOpen(false);
    };

    const isDirty =
        displayName !== user.name ||
        firstName !== user.firstName ||
        lastName !== user.lastName ||
        city !== user.city ||
        country !== user.country ||
        bio !== user.bio ||
        avatarFile !== null ||
        linkUrl !== '' ||
        linkLabel !== '' ||
        supportLink !== ''; 

    const handleSave = () => {
        if (!isDirty) return;
        onSave({ displayName, firstName, lastName, city, country, bio, avatarFile, avatarPreviewUrl, linkUrl, linkLabel, supportLink });
    };

    return (
        <div className="EditProfile">
            <div className="EditProfileModal">
                <div className="EditProfileHeader">
                    <span className="EditProfileTitle">Редагувати профіль</span>
                    <button className="EditProfileClose" onClick={onClose}>
                        <img src={Exit} className="EditProfileCloseIcon" />
                    </button>
                </div>
 
                <div className="EditProfileTopSection">
                    <div className="EditProfileAvatarCol">
                        <div className="EditProfileAvatar">
                            <img src={avatarPreviewUrl} className="EditProfileAvatarImg" />
                        </div>
 
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                        <button className="ChangePhotoBtn" onClick={() => fileInputRef.current?.click()}>
                            Змінити фото
                        </button>
                    </div>
 
                    <div className="EditProfileFormCol">
                        <div className="EditProfileField EditProfileFieldFull">
                            <span className="EditProfileName">Відображуване ім'я*</span>
                            <input className="EditName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
 
                        <div className="EditProfileFieldRow">
                            <div className="EditProfileField">
                                <span className="EditProfileFirstName">Ім'я</span>
                                <input className="EditFirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="EditProfileField">
                                <span className="EditProfileLastName">Прізвище</span>
                                <input className="EditLastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
 
                        <div className="EditProfileFieldRow">
                            <div className="EditProfileField">
                                <span className="EditProfileCity">Місто</span>
                                <input className="EditCity" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                            <div className="EditProfileField">
                                <span className="EditProfileCountry">Країна</span>
                                <input className="EditCountry" value={country} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                        </div>
 
                        <div className="EditProfileField EditProfileFieldFull">
                            <span className="EditProfileBio">Про себе</span>
                            <div className="EditProfileTextareaWrap">
                                <textarea className="EditProfileTextarea" value={bio} onChange={(e) => setBio(e.target.value)} />
                                <span className="EditProfileResize1" />
                                <span className="EditProfileResize2" />
                            </div>
                        </div>
                    </div>
                </div>
 
                <div className="EditProfileLinksSection">
                    <div className="EditProfileLinkTitleRow" ref={linkTipRef}>
                        <span className="EditProfileLinkTitle">Ваші посилання</span>
                        <button className="EditProfileBadgeBtn" onClick={() => setLinkTipOpen((prev) => !prev)} >
                            <span className="EditProfileBadge" />
                            <span className="EditProfileBadge2" />
                        </button>
 
                        {LinkTipOpen && (
                            <div className="EditProfileTooltip">
                                Додайте посилання на свій вебсайт і профілі в соціальних мережах,
                                щоб ваша аудиторія могла легко знайти вас на будь-якій платформі.
                            </div>
                        )}
                    </div>
 
                    {LinkRowOpen && (
                        <div className="EditProfWebLink">
                            <div className="EditProfWebLinkInput">
                                <img src={LinkIcon} className="EditProfWebLinkIcon" />
                                <input className="EditProfWebLinkInputField" placeholder="Вебсайт або електронна пошта" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                            </div>
                            <input className="EditProfWebLinkName" placeholder="Коротка назва" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} />
                            <button className="EditProfWebLinkDeleteBtn" onClick={handleRemoveLinkRow}>
                                <img src={TrashIcon} className="EditProfWebLinkDeleteIcon" />
                            </button>
                        </div>
                    )}
 
                    {SupportRowOpen && (
                        <>
                            <div className="EditProfPaypalLink">
                                <div className="EditProfWebLinkInput EditProfPaypalLinkInput">
                                    <img src={DollarIcon} className="EditProfWebLinkIcon" />
                                    <input className="EditProfPaypalLinkInputField" placeholder="paypal.me/username" value={supportLink} onChange={(e) => setSupportLink(e.target.value)} />
                                </div>
                                <button className="EditProfPaypalDeleteBtn" onClick={handleRemoveSupportRow}>
                                    <img src={TrashIcon} className="EditProfPaypalDeleteIcon" />
                                </button>
                            </div>
                            <p className="EditProfPaypalHint">Підтримувані платформи: PayPal, Cash App, Venmo, Bandcamp, Shopify, Kickstarter, Patreon та GoFundMe.</p>
                        </>
                    )}
 
                    <div className="EditProfileAddBtnsRow">
                        {!LinkRowOpen && (
                            <button className="EditProfileAddBtn" onClick={() => setLinkRowOpen(true)}>
                                Додати посилання
                            </button>
                        )}
                        {!SupportRowOpen && (
                            <button className="EditProfileSupportBtn" onClick={() => setSupportRowOpen(true)}>
                                Додати посилання підтримки
                            </button>
                        )}
                    </div>
                </div>
 
                <div className="EditProfileBottomBtnsRow">
                    <button className="EditProfileCancelBtn" onClick={onClose}>Скасувати</button>
                    <button
                        className={`EditProfileSaveBtn ${isDirty ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={!isDirty}
                    >
                        Зберегти зміни
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default EditProfile;