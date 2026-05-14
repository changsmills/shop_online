import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')} style={{ fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}>
        English
      </button>
      <button onClick={() => changeLanguage('sw')} style={{ fontWeight: i18n.language === 'sw' ? 'bold' : 'normal' }}>
        Kiswahili
      </button>
    </div>
  );
};

export default LanguageSwitcher;