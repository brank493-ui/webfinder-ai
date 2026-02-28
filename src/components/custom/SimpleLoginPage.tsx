'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguageStore } from '@/store/useLanguageStore';

// Owner credentials
const OWNER = {
  email: 'brank493@gmail.com',
  credential: 'lago2.1B',
  name: 'Fongang Lamago Brank',
};

interface Props {
  onLoginSuccess: () => void;
}

export function SimpleLoginPage({ onLoginSuccess }: Props) {
  const [credential, setCredential] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguageStore();

  const handleLogin = () => {
    setError('');
    setLoading(true);
    
    console.log('Login button clicked');
    console.log('Credential:', credential);
    
    if (credential.trim().toLowerCase() === OWNER.credential.toLowerCase()) {
      console.log('Owner login - setting state');
      useAuthStore.setState({
        user: {
          id: 'owner-' + Date.now(),
          email: OWNER.email,
          name: OWNER.name,
          role: 'owner',
          provider: 'credential',
          credentialNumber: OWNER.credential,
          hasCompletedOnboarding: true,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
        },
        isAuthenticated: true,
      });
      setLoading(false);
      onLoginSuccess();
    } else {
      setError(t('auth.invalidCredential'));
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
      padding: '16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '32px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            WebFinder AI
          </h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>
            {t('common.businessDiscovery')}
          </p>
        </div>

        {/* Login Form */}
        <div style={{ marginTop: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#374151',
          }}>
            {t('auth.credentialNumber')}
          </label>
          <input
            type="text"
            placeholder={t('auth.ownerHint')}
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              marginBottom: '16px',
            }}
            disabled={loading}
          />

          {error && (
            <div style={{
              padding: '12px',
              background: '#fef2f2',
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? t('auth.signingIn') : t('auth.signIn')}
          </button>
        </div>

        {/* Help */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            {t('auth.needHelp')}{' '}
            <a href="mailto:brank493@gmail.com" style={{ color: '#2563eb' }}>
              brank493@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
