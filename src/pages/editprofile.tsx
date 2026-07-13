import './profile.css'
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation()
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
                    <span className="EditProfileTitle">{t('editprofile.title')}</span>
                    <button className="EditProfileClose" onClick={onClose}>
                        <img src={Exit} className="EditProfileCloseIcon" alt="Close" />
                    </button>
                </div>
 
                <div className="EditProfileTopSection">
                    <div className="EditProfileAvatarCol">
                        <div className="EditProfileAvatar">
                            <img src={avatarPreviewUrl} className="EditProfileAvatarImg" alt="Avatar" />
                        </div>
 
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                        <button className="ChangePhotoBtn" onClick={() => fileInputRef.current?.click()}>
                            {t('editprofile.change_photo')}
                        </button>
                    </div>
 
                    <div className="EditProfileFormCol">
                        <div className="EditProfileField EditProfileFieldFull">
                            <span className="EditProfileName">{t('editprofile.display_name')}</span>
                            <input className="EditName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
 
                        <div className="EditProfileFieldRow">
                            <div className="EditProfileField">
                                <span className="EditProfileFirstName">{t('editprofile.first_name')}</span>
                                <input className="EditFirstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="EditProfileField">
                                <span className="EditProfileLastName">{t('editprofile.last_name')}</span>
                                <input className="EditLastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
 
                        <div className="EditProfileFieldRow">
                            <div className="EditProfileField">
                                <span className="EditProfileCity">{t('editprofile.city')}</span>
                                <input className="EditCity" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>
                            <div className="EditProfileField">
                                <span className="EditProfileCountry">{t('editprofile.country')}</span>
                                <input className="EditCountry" value={country} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                        </div>
 
                        <div className="EditProfileField EditProfileFieldFull">
                            <span className="EditProfileBio">{t('editprofile.bio')}</span>
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
                        <span className="EditProfileLinkTitle">{t('editprofile.links_title')}</span>
                        <button className="EditProfileBadgeBtn" onClick={() => setLinkTipOpen((prev) => !prev)} type="button">
                            <span className="EditProfileBadge" />
                            <span className="EditProfileBadge2" />
                        </button>
 
                        {LinkTipOpen && (
                            <div className="EditProfileTooltip">
                                {t('editprofile.tooltip')}
                            </div>
                        )}
                    </div>
 
                    {LinkRowOpen && (
                        <div className="EditProfWebLink">
                            <div className="EditProfWebLinkInput">
                                <img src={LinkIcon} className="EditProfWebLinkIcon" alt="" />
                                <input className="EditProfWebLinkInputField" placeholder={t('editprofile.link_placeholder')} value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
                            </div>
                            <input className="EditProfWebLinkName" placeholder={t('editprofile.link_name_placeholder')} value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} />
                            <button className="EditProfWebLinkDeleteBtn" onClick={handleRemoveLinkRow}>
                                <img src={TrashIcon} className="EditProfWebLinkDeleteIcon" alt="Delete" />
                            </button>
                        </div>
                    )}
 
                    {SupportRowOpen && (
                        <>
                            <div className="EditProfPaypalLink">
                                <div className="EditProfWebLinkInput EditProfPaypalLinkInput">
                                    <img src={DollarIcon} className="EditProfWebLinkIcon" alt="" />
                                    <input className="EditProfPaypalLinkInputField" placeholder={t('editprofile.support_placeholder')} value={supportLink} onChange={(e) => setSupportLink(e.target.value)} />
                                </div>
                                <button className="EditProfPaypalDeleteBtn" onClick={handleRemoveSupportRow}>
                                    <img src={TrashIcon} className="EditProfPaypalDeleteIcon" alt="Delete" />
                                </button>
                            </div>
                            <p className="EditProfPaypalHint">{t('editprofile.support_hint')}</p>
                        </>
                    )}
 
                    <div className="EditProfileAddBtnsRow">
                        {!LinkRowOpen && (
                            <button className="EditProfileAddBtn" onClick={() => setLinkRowOpen(true)}>
                                {t('editprofile.add_link')}
                            </button>
                        )}
                        {!SupportRowOpen && (
                            <button className="EditProfileSupportBtn" onClick={() => setSupportRowOpen(true)}>
                                {t('editprofile.add_support')}
                            </button>
                        )}
                    </div>
                </div>
 
                <div className="EditProfileBottomBtnsRow">
                    <button className="EditProfileCancelBtn" onClick={onClose}>{t('editprofile.cancel')}</button>
                    <button
                        className={`EditProfileSaveBtn ${isDirty ? 'active' : ''}`}
                        onClick={handleSave}
                        disabled={!isDirty}
                    >
                        {t('editprofile.save')}
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default EditProfile;