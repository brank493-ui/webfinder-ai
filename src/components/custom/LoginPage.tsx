'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Key,
  Loader2,
  AlertCircle,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  UserCircle,
  CheckCircle2,
} from 'lucide-react';
import { LanguageSwitcher } from '@/components/custom/LanguageSwitcher';

// Owner credentials for direct login
const OWNER_CREDENTIALS = {
  email: 'brank493@gmail.com',
  credentialNumber: 'lago2.1B',
  name: 'Fongang Lamago Brank',
};

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { data: session, status } = useSession();
  const { register, isLoading: storeLoading, error: storeError, clearError } = useAuthStore();
  
  // Sign In State
  const [loginMethod, setLoginMethod] = useState<'credential' | 'email'>('credential');
  const [credentialNumber, setCredentialNumber] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Registration State
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regGender, setRegGender] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('');
  const [regCity, setRegCity] = useState('');
  
  // UI State
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activePage, setActivePage] = useState<'signin' | 'register'>('signin');

  const displayError = localError || storeError;

  // Sync NextAuth session with Zustand store
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      useAuthStore.setState({
        user: {
          id: (session.user as any).id || 'google-user',
          email: session.user.email || '',
          name: session.user.name || '',
          role: session.user.email === OWNER_CREDENTIALS.email ? 'owner' : 'user',
          provider: 'google',
          avatar: (session.user as any).avatar || session.user.image,
          credentialNumber: (session.user as any).credentialNumber,
          hasCompletedOnboarding: (session.user as any).hasCompletedOnboarding || false,
        },
        isAuthenticated: true,
      });
      onLoginSuccess();
    }
  }, [session, status, onLoginSuccess]);

  // Handle Credential Login
  const handleCredentialLogin = () => {
    console.log('handleCredentialLogin called');
    setLocalError('');
    clearError();
    setIsLoading(true);

    const cred = credentialNumber.trim();
    console.log('Credential entered:', cred);
    
    // Check if it's the owner's credential (case-insensitive)
    if (cred.toLowerCase() === OWNER_CREDENTIALS.credentialNumber.toLowerCase()) {
      console.log('Owner credential login detected - setting owner role');
      useAuthStore.setState({
        user: {
          id: 'owner-' + Date.now(),
          email: OWNER_CREDENTIALS.email,
          name: OWNER_CREDENTIALS.name,
          role: 'owner',
          provider: 'credential',
          credentialNumber: OWNER_CREDENTIALS.credentialNumber,
          hasCompletedOnboarding: true,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
        },
        isAuthenticated: true,
      });
      setIsLoading(false);
      onLoginSuccess();
      return;
    }

    // For other users, call the API
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentialNumber: cred }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          useAuthStore.setState({
            user: data.user,
            isAuthenticated: true,
          });
          onLoginSuccess();
        } else {
          setLocalError(data.error || 'Invalid credential number');
        }
      })
      .catch(() => {
        setLocalError('Network error. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  // Handle Email/Password Login
  const handleEmailLogin = () => {
    setLocalError('');
    clearError();
    setIsLoading(true);

    const email = signInEmail.trim().toLowerCase();
    const password = signInPassword.trim();

    // Check if it's the owner's email with credential as password
    if (email === OWNER_CREDENTIALS.email && password.toLowerCase() === OWNER_CREDENTIALS.credentialNumber.toLowerCase()) {
      console.log('Owner login detected - setting owner role');
      useAuthStore.setState({
        user: {
          id: 'owner-' + Date.now(),
          email: OWNER_CREDENTIALS.email,
          name: OWNER_CREDENTIALS.name,
          role: 'owner',
          provider: 'credential',
          credentialNumber: OWNER_CREDENTIALS.credentialNumber,
          hasCompletedOnboarding: true,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner',
        },
        isAuthenticated: true,
      });
      setIsLoading(false);
      onLoginSuccess();
      return;
    }

    // For other users, call the API
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          useAuthStore.setState({
            user: data.user,
            isAuthenticated: true,
          });
          onLoginSuccess();
        } else {
          setLocalError(data.error || 'Invalid email or password');
        }
      })
      .catch(() => {
        setLocalError('Network error. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    if (confirm('Use Google account for brank493@gmail.com? (Click OK for owner, Cancel for regular user)')) {
      useAuthStore.setState({
        user: {
          id: 'owner-google',
          email: OWNER_CREDENTIALS.email,
          name: OWNER_CREDENTIALS.name,
          role: 'owner',
          provider: 'google',
          credentialNumber: OWNER_CREDENTIALS.credentialNumber,
          hasCompletedOnboarding: true,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner-google',
        },
        isAuthenticated: true,
      });
      onLoginSuccess();
    }
  };

  // Handle Registration
  const handleRegister = () => {
    setLocalError('');
    clearError();
    setIsLoading(true);

    // Validation
    if (!regEmail.trim()) {
      setLocalError('Email is required');
      setIsLoading(false);
      return;
    }
    if (!regPassword.trim() || regPassword.length < 6) {
      setLocalError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setLocalError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (!regName.trim()) {
      setLocalError('First name is required');
      setIsLoading(false);
      return;
    }

    register({
      email: regEmail.trim(),
      password: regPassword,
      name: regName.trim(),
      surname: regSurname.trim() || undefined,
      gender: regGender || undefined,
      phone: regPhone.trim() || undefined,
      country: regCountry.trim() || undefined,
      city: regCity.trim() || undefined,
    })
      .then(result => {
        if (result.success) {
          setShowSuccess(true);
          setSuccessMessage('Account created successfully! Your credential number has been sent to your email.');
          setTimeout(() => {
            onLoginSuccess();
          }, 3000);
        } else {
          setLocalError(result.error || 'Registration failed');
        }
      })
      .catch(() => {
        setLocalError('Network error. Please try again.');
      })
      .finally(() => setIsLoading(false));
  };

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Created!</h2>
            <p className="text-gray-600 mb-4">{successMessage}</p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Redirecting to your dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Language Switcher - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="/webfinder-logo-new.png"
              alt="WebFinder Logo"
              className="h-16 w-16 rounded-xl"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            WebFinder AI
          </h1>
          <p className="text-muted-foreground mt-2">
            Business Discovery Platform
          </p>
        </div>

        <Card className="shadow-xl">
          {/* Tab Headers */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activePage === 'signin'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => { setActivePage('signin'); setLocalError(''); clearError(); }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                activePage === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => { setActivePage('register'); setLocalError(''); clearError(); }}
            >
              Register
            </button>
          </div>

          <CardContent className="pt-4">
            {/* Sign In Page */}
            {activePage === 'signin' && (
              <div className="space-y-4">
                {/* Login Method Tabs */}
                <div className="flex border rounded-lg p-1 bg-muted/50">
                  <button
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      loginMethod === 'credential'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => { setLoginMethod('credential'); setLocalError(''); }}
                  >
                    Credential
                  </button>
                  <button
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      loginMethod === 'email'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => { setLoginMethod('email'); setLocalError(''); }}
                  >
                    Email
                  </button>
                </div>

                {/* Credential Login */}
                {loginMethod === 'credential' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="credentialNumber">Credential Number</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="credentialNumber"
                          type="text"
                          placeholder="Enter your credential number"
                          value={credentialNumber}
                          onChange={(e) => setCredentialNumber(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCredentialLogin()}
                          className="pl-11 h-12 text-lg"
                          disabled={isLoading}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter your credential number (e.g., lago2.1B for owner)
                      </p>
                    </div>

                    {displayError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{displayError}</span>
                      </div>
                    )}

                    <Button 
                      onClick={handleCredentialLogin}
                      className="w-full h-12 text-lg" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="h-5 w-5 mr-2" />
                      )}
                      Sign In
                    </Button>
                  </div>
                )}

                {/* Email/Password Login */}
                {loginMethod === 'email' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signInEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signInEmail"
                          type="email"
                          placeholder="your@email.com"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          className="pl-11 h-12"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signInPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signInPassword"
                          type="password"
                          placeholder="Enter your password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                          className="pl-11 h-12"
                          disabled={isLoading}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Owner: use your credential number as password
                      </p>
                    </div>

                    {displayError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{displayError}</span>
                      </div>
                    )}

                    <Button 
                      onClick={handleEmailLogin}
                      className="w-full h-12 text-lg" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="h-5 w-5 mr-2" />
                      )}
                      Sign In
                    </Button>
                  </div>
                )}

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            )}

            {/* Register Page */}
            {activePage === 'register' && (
              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="regEmail">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="regEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="pl-11 h-11"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regPassword"
                        type="password"
                        placeholder="Min 6 chars"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regConfirmPassword">Confirm *</Label>
                    <Input
                      id="regConfirmPassword"
                      type="password"
                      placeholder="Confirm"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="h-11"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="regName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regName"
                        type="text"
                        placeholder="John"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regSurname">Surname</Label>
                    <Input
                      id="regSurname"
                      type="text"
                      placeholder="Doe"
                      value={regSurname}
                      onChange={(e) => setRegSurname(e.target.value)}
                      className="h-11"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Gender and Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="regGender">Gender</Label>
                    <Select value={regGender} onValueChange={setRegGender} disabled={isLoading}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regPhone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regPhone"
                        type="tel"
                        placeholder="+237 6XX XXX XXX"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Country and City */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="regCountry">Country</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="regCountry"
                        type="text"
                        placeholder="Cameroon"
                        value={regCountry}
                        onChange={(e) => setRegCountry(e.target.value)}
                        className="pl-10 h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regCity">City</Label>
                    <Input
                      id="regCity"
                      type="text"
                      placeholder="Douala"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="h-11"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {displayError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{displayError}</span>
                  </div>
                )}

                <Button 
                  onClick={handleRegister}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <UserCircle className="h-5 w-5 mr-2" />
                  )}
                  Create Account
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By creating an account, you&apos;ll receive a credential number via email
                  for future logins on any device.
                </p>
              </div>
            )}

            {/* Help Section */}
            <div className="text-center pt-4 border-t mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Need help?
              </p>
              <p className="text-xs text-muted-foreground">
                Contact us at{' '}
                <a href="mailto:brank493@gmail.com" className="text-blue-600 hover:underline font-medium">
                  brank493@gmail.com
                </a>{' '}
                or call{' '}
                <a href="tel:+237693401619" className="text-blue-600 hover:underline font-medium">
                  +237 693 401 619
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} WebFinder AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
