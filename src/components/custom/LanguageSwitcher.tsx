'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Globe, Check } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          position: 'relative',
        }}
        title={t('language.selectLanguage')}
      >
        <Globe style={{ width: '20px', height: '20px', color: '#6b7280' }} />
        <span style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          fontSize: '10px',
          fontWeight: 'bold',
          background: '#2563eb',
          color: 'white',
          borderRadius: '50%',
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {language.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
            }}
          />
          
          {/* Dropdown */}
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            minWidth: '140px',
            zIndex: 50,
            overflow: 'hidden',
          }}>
            {/* English Option */}
            <button
              onClick={() => {
                setLanguage('en');
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                background: language === 'en' ? '#f3f4f6' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🇬🇧</span>
                <span>{t('language.english')}</span>
              </span>
              {language === 'en' && <Check style={{ width: '16px', height: '16px', color: '#16a34a' }} />}
            </button>

            {/* French Option */}
            <button
              onClick={() => {
                setLanguage('fr');
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                background: language === 'fr' ? '#f3f4f6' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🇫🇷</span>
                <span>{t('language.french')}</span>
              </span>
              {language === 'fr' && <Check style={{ width: '16px', height: '16px', color: '#16a34a' }} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
