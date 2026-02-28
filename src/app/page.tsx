'use client';

import { useState } from 'react';
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
  
  // Get auth state
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('discover');
  const [activeToolsTab, setActiveToolsTab] = useState('domains');
  const [activeEnterpriseTab, setActiveEnterpriseTab] = useState('team');
  const [userPage, setUserPage] = useState<'home' | 'dashboard' | 'onboarding' | 'gallery'>('home');
  const [showUserHomePreview, setShowUserHomePreview] = useState(false);

  // Handle login
  const handleLogin = () => {
    setMessage('Checking credentials...');
    
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
        setMessage('Invalid credential. Try: lago2.1B');
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
        setMessage('Invalid email or password');
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
                  <span className="text-xs text-muted-foreground">Your Project Portal</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1">
                <Button variant={userPage === 'home' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('home')} className={userPage === 'home' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  <HomeIcon className="h-4 w-4 mr-2" />Home
                </Button>
                <Button variant={userPage === 'dashboard' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('dashboard')} className={userPage === 'dashboard' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />Dashboard
                </Button>
                <Button variant={userPage === 'onboarding' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('onboarding')} className={userPage === 'onboarding' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  <ClipboardList className="h-4 w-4 mr-2" />Onboarding
                </Button>
                <Button variant={userPage === 'gallery' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('gallery')} className={userPage === 'gallery' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
                  <ImageIcon className="h-4 w-4 mr-2" />Gallery
                </Button>
                <Button variant="ghost" size="sm" onClick={() => document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Phone className="h-4 w-4 mr-2" />Contact
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
                        <span className="text-xs text-muted-foreground">{user.provider === 'google' ? 'Google' : 'Credential'}</span>
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
                          <span className="text-xs text-blue-600 capitalize mt-0.5">{user.provider === 'google' ? 'Google Account' : 'Credential Login'}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setUserPage('home')}><HomeIcon className="h-4 w-4 mr-2" />Home</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserPage('dashboard')}><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserPage('onboarding')}><ClipboardList className="h-4 w-4 mr-2" />Onboarding</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserPage('gallery')}><ImageIcon className="h-4 w-4 mr-2" />Gallery</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' })}><Phone className="h-4 w-4 mr-2" />Contact</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600"><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
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
                    <CardTitle className="flex items-center gap-2"><ClipboardList className="h-5 w-5 text-blue-600" />Project Information</CardTitle>
                    <CardDescription>Update your project details and preferences</CardDescription>
                  </CardHeader>
                </Card>
                <ClientOnboardingPage />
                <div className="flex justify-center">
                  <Button size="lg" onClick={() => setUserPage('home')} className="bg-gradient-to-r from-blue-600 to-indigo-600">Save Changes & Return Home</Button>
                </div>
              </div>
            )}
            {userPage === 'gallery' && (
              <div className="container mx-auto px-4 py-6">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Portfolio Gallery</h1>
                  <p className="text-gray-600">Explore our stunning website designs across various industries</p>
                </div>
                <UserGalleryPage />
              </div>
            )}
          </main>

          {/* User Footer */}
          <footer id="contact-footer" className="border-t mt-auto py-8 bg-gray-900 text-white">
            <div className="container mx-auto px-4 text-center text-sm">
              <p className="font-medium">© {new Date().getFullYear()} WebFinder AI. All rights reserved.</p>
              <p className="mt-2 text-gray-400">
                Need help? Contact{' '}
                <a href="mailto:brank493@gmail.com" className="text-blue-400 hover:underline font-medium">brank493@gmail.com</a>
                {' '}or call{' '}
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
                <span className="font-medium">Preview Mode - Viewing as User</span>
                <Badge className="bg-white/20 text-white ml-2">Full Access</Badge>
              </div>
              <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30" onClick={() => setShowUserHomePreview(false)}>
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />Back to Admin
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
                  <span className="text-xs text-muted-foreground">User Portal Preview</span>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-1">
                <Button variant={userPage === 'home' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('home')} className={userPage === 'home' ? 'bg-blue-600 hover:bg-blue-700' : ''}><HomeIcon className="h-4 w-4 mr-2" />Home</Button>
                <Button variant={userPage === 'dashboard' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('dashboard')} className={userPage === 'dashboard' ? 'bg-blue-600 hover:bg-blue-700' : ''}><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</Button>
                <Button variant={userPage === 'onboarding' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('onboarding')} className={userPage === 'onboarding' ? 'bg-blue-600 hover:bg-blue-700' : ''}><ClipboardList className="h-4 w-4 mr-2" />Onboarding</Button>
                <Button variant={userPage === 'gallery' ? 'default' : 'ghost'} size="sm" onClick={() => setUserPage('gallery')} className={userPage === 'gallery' ? 'bg-blue-600 hover:bg-blue-700' : ''}><ImageIcon className="h-4 w-4 mr-2" />Gallery</Button>
                <Button variant="ghost" size="sm" onClick={() => document.getElementById('preview-contact-footer')?.scrollIntoView({ behavior: 'smooth' })}><Phone className="h-4 w-4 mr-2" />Contact</Button>
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
              <p className="font-medium">© {new Date().getFullYear()} WebFinder AI. All rights reserved.</p>
              <p className="mt-2 text-gray-400">Need help? Contact <a href="mailto:brank493@gmail.com" className="text-blue-400 hover:underline">brank493@gmail.com</a> or call <a href="tel:+237693401619" className="text-blue-400 hover:underline">+237 693 401 619</a></p>
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
                <span className="text-xs text-muted-foreground">Business Discovery Platform</span>
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
                      <span className="text-xs text-muted-foreground">Administrator</span>
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
                  <DropdownMenuItem onClick={() => setShowUserHomePreview(true)}><Eye className="h-4 w-4 mr-2" />Preview User Home</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600"><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
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
                  <TabsTrigger value="discover" className="flex items-center gap-2"><Globe className="h-4 w-4" /><span className="hidden sm:inline">Discover</span></TabsTrigger>
                  <TabsTrigger value="workspaces" className="flex items-center gap-2"><Briefcase className="h-4 w-4" /><span className="hidden sm:inline">Workspaces</span></TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /><span className="hidden sm:inline">Tools</span></TabsTrigger>
                  <TabsTrigger value="enterprise" className="flex items-center gap-2"><Building2 className="h-4 w-4" /><span className="hidden sm:inline">Enterprise</span></TabsTrigger>
                  <TabsTrigger value="onboarding" className="flex items-center gap-2"><User className="h-4 w-4" /><span className="hidden sm:inline">Onboarding</span></TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /><span className="hidden sm:inline">Admin</span></TabsTrigger>
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
                    <TabsTrigger value="domains" className="flex items-center gap-2"><Globe2 className="h-4 w-4" />Domains</TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-2"><Mail className="h-4 w-4" />Email Campaigns</TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Analytics</TabsTrigger>
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
                    <TabsTrigger value="team" className="flex items-center gap-2"><Users className="h-4 w-4" />Team</TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center gap-2"><CreditCard className="h-4 w-4" />Billing</TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
                    <TabsTrigger value="deployments" className="flex items-center gap-2"><Rocket className="h-4 w-4" />Deployments</TabsTrigger>
                    <TabsTrigger value="editor" className="flex items-center gap-2"><Edit3 className="h-4 w-4" />Editor</TabsTrigger>
                    <TabsTrigger value="portal" className="flex items-center gap-2"><Globe className="h-4 w-4" />Client Portal</TabsTrigger>
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
      <div style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/webfinder-logo-new.png" alt="WebFinder Logo" style={{ height: '64px', width: '64px', borderRadius: '12px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(90deg, #2563eb, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WebFinder AI</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Business Discovery Platform</p>
        </div>

        <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden' }}>
          <button onClick={() => { setLoginMethod('credential'); setMessage(''); }} style={{ flex: 1, padding: '10px', background: loginMethod === 'credential' ? '#3b82f6' : 'white', color: loginMethod === 'credential' ? 'white' : '#374151', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Credential</button>
          <button onClick={() => { setLoginMethod('email'); setMessage(''); }} style={{ flex: 1, padding: '10px', background: loginMethod === 'email' ? '#3b82f6' : 'white', color: loginMethod === 'email' ? 'white' : '#374151', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Email</button>
        </div>

        {loginMethod === 'credential' ? (
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Credential Number</label>
            <input type="text" placeholder="Enter lago2.1B for owner" value={credential} onChange={(e) => setCredential(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Email</label>
            <input type="email" placeholder="brank493@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Password</label>
            <input type="password" placeholder="Use credential number as password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #d1d5db', borderRadius: '8px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
          </div>
        )}

        {message && <div style={{ padding: '12px', background: message.includes('Invalid') ? '#fef2f2' : '#f0fdf4', color: message.includes('Invalid') ? '#dc2626' : '#16a34a', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

        <button onClick={handleLogin} style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: '600', color: 'white', background: 'linear-gradient(90deg, #2563eb, #4f46e5)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Sign In</button>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>Owner: <strong>brank493@gmail.com</strong> / <strong>lago2.1B</strong></p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Need help? <a href="mailto:brank493@gmail.com" style={{ color: '#2563eb' }}>brank493@gmail.com</a> or <a href="tel:+237693401619" style={{ color: '#2563eb' }}>+237 693 401 619</a></p>
        </div>
      </div>
    </div>
  );
}
