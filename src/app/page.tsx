'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/useAuthStore';
import { Header } from '@/components/custom/Header';
import { HeroSection } from '@/components/custom/HeroSection';
import { BusinessList } from '@/components/custom/BusinessList';
import { ChatPanel } from '@/components/custom/ChatPanel';
import { PricingSection } from '@/components/custom/PricingSection';
import { Footer } from '@/components/custom/Footer';
import { AdminDashboard } from '@/components/custom/AdminDashboard';
import { WorkspaceManager } from '@/components/custom/WorkspaceManager';
import { DomainManager } from '@/components/custom/DomainManager';
import { EmailCampaigns } from '@/components/custom/EmailCampaigns';
import { AnalyticsDashboard } from '@/components/custom/AnalyticsDashboard';
import { WebsiteEditor } from '@/components/custom/WebsiteEditor';
import { CustomerPortal } from '@/components/custom/CustomerPortal';
import { NotificationCenter } from '@/components/custom/NotificationCenter';
import { TeamManagement } from '@/components/custom/TeamManagement';
import { BillingInvoicing } from '@/components/custom/BillingInvoicing';
import { DeploymentCenter } from '@/components/custom/DeploymentCenter';
import { UserTrackingDashboard } from '@/components/custom/UserTrackingDashboard';
import { UserHomePage } from '@/components/custom/UserHomePage';
import { UserGalleryPage } from '@/components/custom/UserGalleryPage';
import { ClientOnboardingPage } from '@/components/custom/ClientOnboardingPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  LayoutDashboard,
  Briefcase,
  Globe2,
  Mail,
  BarChart3,
  Rocket,
  Building2,
  Users,
  CreditCard,
  Bell,
  Edit3,
  LogOut,
  User,
  Eye,
  ClipboardList,
  Home as HomeIcon,
  Image as ImageIcon,
  Phone,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LanguageSwitcher } from '@/components/custom/LanguageSwitcher';
import { useLanguageStore } from '@/store/useLanguageStore';

// Owner credentials
const OWNER = {
  email: 'brank493@gmail.com',
  credential: 'lago2.1B',
  name: 'Fongang Lamago Brank',
};

export default function Home() {
  const [credential, setCredential] = useState('');
  const [message, setMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState<'credential' | 'email'>('credential');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Registration form fields
  const [regFirstName, setRegFirstName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regGender, setRegGender] = useState('');
  const [regCountry, setRegCountry] = useState('');
  const [regCity, setRegCity] = useState('');
  
  // Get auth state
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Get NextAuth session
  const { data: session, status } = useSession();
  
  // Get translations
  const { t } = useLanguageStore();
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('discover');
  const [activeToolsTab, setActiveToolsTab] = useState('domains');
  const [activeEnterpriseTab, setActiveEnterpriseTab] = useState('team');
  const [userPage, setUserPage] = useState<'home' | 'dashboard' | 'onboarding' | 'gallery'>('home');
  const [showUserHomePreview, setShowUserHomePreview] = useState(false);

  // Sync NextAuth session with Zustand
  useEffect(() => {
    if (session?.user && status === 'authenticated' && !isAuthenticated) {
      const sessionUser = session.user;
      const isOwner = sessionUser.email?.toLowerCase() === OWNER.email.toLowerCase();

      useAuthStore.setState({
        user: {
          id: (sessionUser as any).id || `google-${Date.now()}`,
          email: sessionUser.email || '',
          name: sessionUser.name || sessionUser.email?.split('@')[0] || 'User',
          role: (sessionUser as any).role || (isOwner ? 'owner' : 'user'),
          provider: (sessionUser as any).provider || 'google',
          credentialNumber: (sessionUser as any).credentialNumber,
          hasCompletedOnboarding: (sessionUser as any).hasCompletedOnboarding ?? (isOwner ? true : false),
          avatar: (sessionUser as any).avatar || sessionUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sessionUser.email}`,
        },
        isAuthenticated: true,
      });
    }
  }, [session, status, isAuthenticated]);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMessage(t('auth.redirectingGoogle'));
    
    // Redirect to NextAuth Google OAuth endpoint
    window.location.href = '/api/auth/signin/google?callbackUrl=/';
  };

  // Handle Registration
  const handleRegister = async () => {
    // Validate required fields
    if (!regFirstName || !regEmail || !regPassword) {
      setMessage(t('register.requiredField'));
      return;
    }

    // Validate password length
    if (regPassword.length < 8) {
      setMessage(t('register.weakPassword'));
      return;
    }

    // Validate password match
    if (regPassword !== regConfirmPassword) {
      setMessage(t('register.passwordMismatch'));
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setMessage(t('auth.invalidEmail'));
      return;
    }

    setRegisterLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          name: regFirstName,
          surname: regSurname,
          gender: regGender,
          phone: regPhone,
          country: regCountry,
          city: regCity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(t('register.success'));
        // Auto-login after successful registration
        useAuthStore.setState({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            provider: data.user.provider,
            credentialNumber: data.user.credentialNumber,
            hasCompletedOnboarding: false,
            avatar: data.user.avatar,
          },
          isAuthenticated: true,
        });
      } else {
        setMessage(data.error || t('register.error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(t('register.error'));
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handle login
  const handleLogin = () => {
    setMessage(t('auth.checkingCredentials'));
    
    if (loginMethod === 'credential') {
      if (credential.trim().toLowerCase() === OWNER.credential.toLowerCase()) {
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
        setMessage('');
      } else {
        setMessage(t('auth.invalidCredential'));
      }
    } else {
      // Email login
      if (email.trim().toLowerCase() === OWNER.email.toLowerCase() && password.trim().toLowerCase() === OWNER.credential.toLowerCase()) {
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
        setMessage('');
      } else {
        setMessage(t('auth.invalidEmailPassword'));
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  };

  // If authenticated, show dashboard
  if (isAuthenticated && user) {
    const isOwnerUser = user.role === 'owner';
    
    // User/Client Dashboard - Full Navigation
    if (!isOwnerUser) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img src="/webfinder-logo-new.png" alt="WebFinder Logo" className="h-10 w-10 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    WebFinder AI
                  </span>
                  <span className="text-xs text-muted-foreground">{t('common.projectPortal')}</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1">
                <Button variant={userPage === 'home' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('home')} className={userPage === 'home' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  <HomeIcon className="h-4 w-4 mr-2" />{t('nav.home')}
                </Button>
                <Button variant={userPage === 'dashboard' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('dashboard')} className={userPage === 'dashboard' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />{t('nav.dashboard')}
                </Button>
                <Button variant={userPage === 'onboarding' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('onboarding')} className={userPage === 'onboarding' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  <ClipboardList className="h-4 w-4 mr-2" />{t('nav.onboarding')}
                </Button>
                <Button variant={userPage === 'gallery' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('gallery')} className={userPage === 'gallery' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  <ImageIcon className="h-4 w-4 mr-2" />{t('nav.gallery')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Phone className="h-4 w-4 mr-2" />{t('nav.contact')}
                </Button>
              </nav>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="h-9 w-9 border-2 border-blue-300 shadow-md">
                        <AvatarImage src={user.avatar} alt={user.name || 'User'} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                          {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-semibold">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.provider === 'google' ? 'Google' : t('auth.credential')}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-3 p-1">
                        <Avatar className="h-12 w-12 border-2 border-blue-200">
                          <AvatarImage src={user.avatar} alt={user.name || 'User'} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-lg font-semibold">
                            {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                          <span className="text-xs text-blue-600 capitalize mt-0.5">{user.provider === 'google' ? t('auth.googleAccount') : t('auth.credentialLogin')}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setUserPage('home')}><HomeIcon className="h-4 w-4 mr-2" />{t('nav.home')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserPage('dashboard')}><LayoutDashboard className="h-4 w-4 mr-2" />{t('nav.dashboard')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserPage('onboarding')}><ClipboardList className="h-4 w-4 mr-2" />{t('nav.onboarding')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserPage('gallery')}><ImageIcon className="h-4 w-4 mr-2" />{t('nav.gallery')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' })}><Phone className="h-4 w-4 mr-2" />{t('nav.contact')}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600"><LogOut className="h-4 w-4 mr-2" />{t('auth.signOut')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t px-2 py-2 flex justify-around gap-1">
              <Button variant={userPage === 'home' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('home')} className={userPage === 'home' ? 'bg-blue-600 hover:bg-blue-700' : ''}><HomeIcon className="h-4 w-4" /></Button>
              <Button variant={userPage === 'dashboard' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('dashboard')} className={userPage === 'dashboard' ? 'bg-blue-600 hover:bg-blue-700' : ''}><LayoutDashboard className="h-4 w-4" /></Button>
              <Button variant={userPage === 'onboarding' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('onboarding')} className={userPage === 'onboarding' ? 'bg-blue-600 hover:bg-blue-700' : ''}><ClipboardList className="h-4 w-4" /></Button>
              <Button variant={userPage === 'gallery' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('gallery')} className={userPage === 'gallery' ? 'bg-blue-600 hover:bg-blue-700' : ''}><ImageIcon className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' })}><Phone className="h-4 w-4" /></Button>
            </div>
          </header>

          {/* User Content */}
          <main className="flex-1">
            {userPage === 'home' && <UserHomePage onNavigate={setUserPage} />}
            {userPage === 'dashboard' && <div className="container mx-auto px-4 py-6"><UserTrackingDashboard onEditOnboarding={() => setUserPage('onboarding')} /></div>}
            {userPage === 'onboarding' && (
              <div className="container mx-auto px-4 py-6 space-y-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-blue-600" />{t('owner.projectInfo')}</CardTitle>
                    <CardDescription>{t('owner.updateProjectDetails')}</CardDescription>
                  </CardHeader>
                </Card>
                <ClientOnboardingPage />
                <div className="flex justify-center">
                  <Button size="lg" onClick={() => setUserPage('home')} className="bg-gradient-to-r from-blue-600 to-indigo-600">{t('owner.saveChangesReturn')}</Button>
                </div>
              </div>
            )}
            {userPage === 'gallery' && (
              <div className="container mx-auto px-4 py-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('gallery.portfolioTitle')}</h1>
                  <p className="text-gray-600">{t('gallery.portfolioSubtitle')}</p>
                </div>
                <UserGalleryPage />
              </div>
            )}
          </main>

          {/* User Footer */}
          <footer id="contact-footer" className="border-t mt-auto py-8 bg-gray-900 text-white">
            <div className="container mx-auto px-4 text-center text-sm">
              <p className="font-medium">© {new Date().getFullYear()} WebFinder AI. {t('footer.rights')}</p>
              <p className="mt-2 text-gray-400">
                {t('footer.needHelp')}{' '}
                <a href="mailto:brank493@gmail.com" className="text-blue-400 hover:underline font-medium">brank493@gmail.com</a>
                {' '}{t('footer.orCall')}{' '}
                <a href="tel:+237693401619" className="text-blue-400 hover:underline font-medium">+237 693 401 619</a>
              </p>
            </div>
          </footer>
        </div>
      );
    }

    // Owner/Admin Dashboard with preview mode
    if (showUserHomePreview) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <div className="sticky top-0 z-[60] w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4">
            <div className="container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">{t('common.previewMode')} - {t('common.viewingAsUser')}</span>
                <Badge className="bg-white/20 text-white ml-2">{t('common.fullAccess')}</Badge>
              </div>
              <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30" onClick={() => setShowUserHomePreview(false)}>
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />{t('common.backToAdmin')}
              </Button>
            </div>
          </div>
          
          {/* Preview Navigation Header */}
          <header className="sticky top-10 z-[55] w-full border-b bg-white/95 backdrop-blur shadow-sm">
            <div className="container flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <img src="/webfinder-logo-new.png" alt="WebFinder Logo" className="h-8 w-8 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">WebFinder AI</span>
                  <span className="text-xs text-muted-foreground">{t('common.userPortalPreview')}</span>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-1">
                <Button variant={userPage === 'home' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('home')} className={userPage === 'home' ? 'bg-blue-600 hover:bg-blue-700' : ''}><HomeIcon className="h-4 w-4 mr-2" />{t('nav.home')}</Button>
                <Button variant={userPage === 'dashboard' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('dashboard')} className={userPage === 'dashboard' ? 'bg-blue-600 hover:bg-blue-700' : ''}><LayoutDashboard className="h-4 w-4 mr-2" />{t('nav.dashboard')}</Button>
                <Button variant={userPage === 'onboarding' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('onboarding')} className={userPage === 'onboarding' ? 'bg-blue-600 hover:bg-blue-700' : ''}><ClipboardList className="h-4 w-4 mr-2" />{t('nav.onboarding')}</Button>
                <Button variant={userPage === 'gallery' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('gallery')} className={userPage === 'gallery' ? 'bg-blue-600 hover:bg-blue-700' : ''}><ImageIcon className="h-4 w-4 mr-2" />{t('nav.gallery')}</Button>
                <Button variant="ghost" size="sm" onClick={() => document.getElementById('preview-contact-footer')?.scrollIntoView({ behavior: 'smooth' })}><Phone className="h-4 w-4 mr-2" />{t('nav.contact')}</Button>
              </nav>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <Avatar className="h-8 w-8 border-2 border-amber-400">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-semibold">PV</AvatarFallback>
                </Avatar>
              </div>
            </div>
            {/* Mobile Navigation */}
            <div className="md:hidden border-t px-2 py-2 flex justify-around gap-1">
              <Button variant={userPage === 'home' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('home')} className={userPage === 'home' ? 'bg-blue-600 hover:bg-blue-700' : ''}><HomeIcon className="h-4 w-4" /></Button>
              <Button variant={userPage === 'dashboard' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('dashboard')} className={userPage === 'dashboard' ? 'bg-blue-600 hover:bg-blue-700' : ''}><LayoutDashboard className="h-4 w-4" /></Button>
              <Button variant={userPage === 'onboarding' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('onboarding')} className={userPage === 'onboarding' ? 'bg-blue-600 hover:bg-blue-700' : ''}><ClipboardList className="h-4 w-4" /></Button>
              <Button variant={userPage === 'gallery' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('gallery')} className={userPage === 'gallery' ? 'bg-blue-600 hover:bg-blue-700' : ''}><ImageIcon className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => document.getElementById('preview-contact-footer')?.scrollIntoView({ behavior: 'smooth' })}><Phone className="h-4 w-4" /></Button>
            </div>
          </header>

          <main className="flex-1">
            {userPage === 'home' && <UserHomePage onNavigate={setUserPage} />}
            {userPage === 'dashboard' && <div className="container mx-auto px-4 py-6"><UserTrackingDashboard onEditOnboarding={() => setUserPage('onboarding')} /></div>}
            {userPage === 'onboarding' && <div className="container mx-auto px-4 py-6"><ClientOnboardingPage /></div>}
            {userPage === 'gallery' && <div className="container mx-auto px-4 py-6"><UserGalleryPage /></div>}
          </main>

          <footer id="preview-contact-footer" className="border-t mt-auto py-8 bg-gray-900 text-white">
            <div className="container mx-auto px-4 text-center text-sm">
              <p className="font-medium">© {new Date().getFullYear()} WebFinder AI. {t('footer.rights')}</p>
              <p className="mt-2 text-gray-400">{t('footer.needHelp')} <a href="mailto:brank493@gmail.com" className="text-blue-400 hover:underline">brank493@gmail.com</a> {t('footer.orCall')} <a href="tel:+237693401619" className="text-blue-400 hover:underline">+237 693 401 619</a></p>
            </div>
          </footer>
        </div>
      );
    }

    // Owner/Admin Dashboard
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <img src="/webfinder-logo-new.png" alt="WebFinder Logo" className="h-10 w-10 rounded-lg" />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">WebFinder AI</span>
                <span className="text-xs text-muted-foreground">{t('common.businessDiscovery')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 border-2 border-indigo-300">
                      <AvatarImage src={user.avatar} alt={user.name || 'User'} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                        {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'FB'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{t('common.administrator')}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-indigo-300">
                        <AvatarImage src={user.avatar} alt={user.name || 'User'} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                          {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'FB'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowUserHomePreview(true)}><Eye className="h-4 w-4 mr-2" />{t('owner.previewUserHome')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600"><LogOut className="h-4 w-4 mr-2" />{t('auth.signOut')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* Main Tab Navigation */}
          <div className="border-b bg-background/95 backdrop-blur sticky top-16 z-40">
            <div className="container mx-auto px-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 h-12">
                  <TabsTrigger value="discover" className="flex items-center gap-2"><Globe className="h-4 w-4" /><span className="hidden sm:inline">{t('nav.discover')}</span></TabsTrigger>
                  <TabsTrigger value="workspaces" className="flex items-center gap-2"><Briefcase className="h-4 w-4" /><span className="hidden sm:inline">{t('nav.workspaces')}</span></TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /><span className="hidden sm:inline">{t('nav.tools')}</span></TabsTrigger>
                  <TabsTrigger value="enterprise" className="flex items-center gap-2"><Building2 className="h-4 w-4" /><span className="hidden sm:inline">{t('nav.enterprise')}</span></TabsTrigger>
                  <TabsTrigger value="onboarding" className="flex items-center gap-2"><User className="h-4 w-4" /><span className="hidden sm:inline">{t('nav.onboarding')}</span></TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /><span className="hidden sm:inline">{t('nav.admin')}</span></TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Tab Content */}
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="discover" className="mt-0"><HeroSection /><BusinessList /><PricingSection /></TabsContent>
            <TabsContent value="workspaces" className="mt-6"><div className="container mx-auto px-4"><WorkspaceManager /></div></TabsContent>
            <TabsContent value="tools" className="mt-6">
              <div className="container mx-auto px-4">
                <Tabs value={activeToolsTab} onValueChange={setActiveToolsTab} className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="domains" className="flex items-center gap-2"><Globe2 className="h-4 w-4" />{t('owner.domains')}</TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-2"><Mail className="h-4 w-4" />{t('owner.emailCampaigns')}</TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />{t('owner.analytics')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="domains"><DomainManager /></TabsContent>
                  <TabsContent value="email"><EmailCampaigns /></TabsContent>
                  <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            <TabsContent value="enterprise" className="mt-6">
              <div className="container mx-auto px-4">
                <Tabs value={activeEnterpriseTab} onValueChange={setActiveEnterpriseTab} className="w-full">
                  <TabsList className="mb-6 flex flex-wrap">
                    <TabsTrigger value="team" className="flex items-center gap-2"><Users className="h-4 w-4" />{t('owner.team')}</TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center gap-2"><CreditCard className="h-4 w-4" />{t('owner.billing')}</TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" />{t('owner.notifications')}</TabsTrigger>
                    <TabsTrigger value="deployments" className="flex items-center gap-2"><Rocket className="h-4 w-4" />{t('owner.deployments')}</TabsTrigger>
                    <TabsTrigger value="editor" className="flex items-center gap-2"><Edit3 className="h-4 w-4" />{t('owner.editor')}</TabsTrigger>
                    <TabsTrigger value="portal" className="flex items-center gap-2"><Globe className="h-4 w-4" />{t('owner.clientPortal')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="team"><TeamManagement /></TabsContent>
                  <TabsContent value="billing"><BillingInvoicing /></TabsContent>
                  <TabsContent value="notifications"><NotificationCenter /></TabsContent>
                  <TabsContent value="deployments"><DeploymentCenter /></TabsContent>
                  <TabsContent value="editor"><WebsiteEditor projectId="demo_project" /></TabsContent>
                  <TabsContent value="portal"><CustomerPortal /></TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            <TabsContent value="onboarding" className="mt-6"><div className="container mx-auto px-4"><ClientOnboardingPage /></div></TabsContent>
            <TabsContent value="admin" className="mt-6"><div className="container mx-auto px-4"><AdminDashboard /></div></TabsContent>
          </Tabs>
        </main>
        <Footer />
        <ChatPanel />
      </div>
    );
  }

  // Login Page
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%)', padding: '16px' }}>
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}><LanguageSwitcher /></div>
      <div style={{ width: '100%', maxWidth: isRegistering ? '520px' : '420px', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/webfinder-logo-new.png" alt="WebFinder Logo" style={{ height: '64px', width: '64px', borderRadius: '12px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WebFinder AI</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>{isRegistering ? t('register.subtitle') : t('common.businessDiscovery')}</p>
        </div>

        {/* Login/Register Toggle Tabs */}
        <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' }}>
          <button 
            onClick={() => { setIsRegistering(false); setMessage(''); }} 
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: !isRegistering ? '#3b82f6' : 'white', 
              color: !isRegistering ? 'white' : '#374151', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            {t('auth.signIn')}
          </button>
          <button 
            onClick={() => { setIsRegistering(true); setMessage(''); }} 
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: isRegistering ? '#3b82f6' : 'white', 
              color: isRegistering ? 'white' : '#374151', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            {t('register.tab')}
          </button>
        </div>

        {/* Registration Form */}
        {isRegistering ? (
          <div>
            {/* Google Sign-Up Button */}
            <button 
              onClick={handleGoogleSignIn} 
              disabled={googleLoading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#374151', 
                background: 'white', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                cursor: googleLoading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{googleLoading ? 'Signing in...' : t('auth.signUpWithGoogle')}</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
              <span style={{ padding: '0 16px', color: '#9ca3af', fontSize: '14px' }}>{t('auth.or')}</span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
            </div>

            {/* Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('register.firstName')} *</label>
                <input 
                  type="text" 
                  placeholder={t('register.firstNamePlaceholder')} 
                  value={regFirstName} 
                  onChange={(e) => setRegFirstName(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('register.surname')}</label>
                <input 
                  type="text" 
                  placeholder={t('register.surnamePlaceholder')} 
                  value={regSurname} 
                  onChange={(e) => setRegSurname(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('auth.email')} *</label>
              <input 
                type="email" 
                placeholder={t('register.emailPlaceholder')} 
                value={regEmail} 
                onChange={(e) => setRegEmail(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('auth.phone')}</label>
              <input 
                type="tel" 
                placeholder={t('register.phonePlaceholder')} 
                value={regPhone} 
                onChange={(e) => setRegPhone(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} 
              />
            </div>

            {/* Password Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('auth.password')} *</label>
                <input 
                  type="password" 
                  placeholder={t('register.passwordPlaceholder')} 
                  value={regPassword} 
                  onChange={(e) => setRegPassword(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('register.confirmPassword')} *</label>
                <input 
                  type="password" 
                  placeholder={t('register.confirmPasswordPlaceholder')} 
                  value={regConfirmPassword} 
                  onChange={(e) => setRegConfirmPassword(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            {/* Gender */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('register.gender')}</label>
              <select 
                value={regGender} 
                onChange={(e) => setRegGender(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', background: 'white', boxSizing: 'border-box', cursor: 'pointer' }}
              >
                <option value="">{t('register.selectGender')}</option>
                <option value="male">{t('register.male')}</option>
                <option value="female">{t('register.female')}</option>
                <option value="other">{t('register.other')}</option>
              </select>
            </div>

            {/* Country and City */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('register.country')}</label>
                <select 
                  value={regCountry} 
                  onChange={(e) => setRegCountry(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', background: 'white', boxSizing: 'border-box', cursor: 'pointer' }}
                >
                  <option value="">{t('register.selectCountry')}</option>
                  <option value="cameroon">{t('country.cameroon')}</option>
                  <option value="nigeria">{t('country.nigeria')}</option>
                  <option value="ghana">{t('country.ghana')}</option>
                  <option value="kenya">{t('country.kenya')}</option>
                  <option value="southAfrica">{t('country.southAfrica')}</option>
                  <option value="france">{t('country.france')}</option>
                  <option value="uk">{t('country.uk')}</option>
                  <option value="usa">{t('country.usa')}</option>
                  <option value="canada">{t('country.canada')}</option>
                  <option value="germany">{t('country.germany')}</option>
                  <option value="other">{t('country.other')}</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>{t('register.city')}</label>
                <input 
                  type="text" 
                  placeholder={t('register.cityPlaceholder')} 
                  value={regCity} 
                  onChange={(e) => setRegCity(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', fontSize: '15px', border: '1px solid #d1d5db', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            {/* Error/Success Message */}
            {message && <div style={{ padding: '12px', background: message.includes('success') ? '#f0fdf4' : '#fef2f2', color: message.includes('success') ? '#16a34a' : '#dc2626', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

            {/* Register Button */}
            <button 
              onClick={handleRegister} 
              disabled={registerLoading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: 'white', 
                background: registerLoading ? '#9ca3af' : 'linear-gradient(90deg, #2563eb, #4f46e5)', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: registerLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {registerLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {registerLoading ? t('register.creating') : t('register.createAccount')}
            </button>

            {/* Terms */}
            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '16px' }}>
              {t('register.termsAgree')} <a href="#" style={{ color: '#2563eb' }}>{t('register.terms')}</a> {t('register.and')} <a href="#" style={{ color: '#2563eb' }}>{t('register.privacy')}</a>
            </p>
          </div>
        ) : (
          /* Login Form */
          <div>
            {/* Google Sign-In Button */}
            <button 
              onClick={handleGoogleSignIn} 
              disabled={googleLoading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#374151', 
                background: 'white', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                cursor: googleLoading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '16px',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span>{googleLoading ? 'Signing in...' : t('auth.continueWithGoogle')}</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
              <span style={{ padding: '0 16px', color: '#9ca3af', fontSize: '14px' }}>{t('auth.or')}</span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
            </div>

            <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' }}>
              <button onClick={() => { setLoginMethod('credential'); setMessage(''); }} style={{ flex: 1, padding: '10px', background: loginMethod === 'credential' ? '#3b82f6' : 'white', color: loginMethod === 'credential' ? 'white' : '#374151', border: 'none', cursor: 'pointer', fontWeight: '500' }}>{t('auth.credential')}</button>
              <button onClick={() => { setLoginMethod('email'); setMessage(''); }} style={{ flex: 1, padding: '10px', background: loginMethod === 'email' ? '#3b82f6' : 'white', color: loginMethod === 'email' ? 'white' : '#374151', border: 'none', cursor: 'pointer', fontWeight: '500' }}>{t('auth.email')}</button>
            </div>

            {loginMethod === 'credential' ? (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t('auth.credentialNumber')}</label>
                <input type="text" placeholder={t('login.credentialPlaceholder')} value={credential} onChange={(e) => setCredential(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t('auth.email')}</label>
                <input type="email" placeholder={t('login.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>{t('auth.password')}</label>
                <input type="password" placeholder={t('login.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
              </div>
            )}

            {message && <div style={{ padding: '12px', background: message.includes('Invalid') || message.includes('error') ? '#fef2f2' : '#f0fdf4', color: message.includes('Invalid') || message.includes('error') ? '#dc2626' : '#16a34a', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

            <button onClick={handleLogin} style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: '600', color: 'white', background: 'linear-gradient(90deg, #2563eb, #4f46e5)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{t('auth.signIn')}</button>

            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{t('login.ownerHint')}: <strong>brank493@gmail.com</strong> / <strong>lago2.1B</strong></p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>{t('auth.needHelp')} <a href="mailto:brank493@gmail.com" style={{ color: '#2563eb' }}>brank493@gmail.com</a> {t('footer.orCall')} <a href="tel:+237693401619" style={{ color: '#2563eb' }}>+237 693 401 619</a></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
