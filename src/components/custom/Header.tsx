'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useLanguageStore } from '@/store/useLanguageStore';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguageStore();

  const navItems = [
    { label: t('nav.dashboard'), href: '#dashboard' },
    { label: t('nav.pricing'), href: '#pricing' },
    { label: t('nav.about'), href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/webfinder-logo-new.png"
            alt="WebFinder Logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg"
            priority
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">WebFinder</span>
            <span className="text-xs text-muted-foreground">{t('common.businessDiscovery')}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <Button 
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Sparkles className="h-4 w-4" />
            {t('nav.getStarted')}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button 
                className="mt-4 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Sparkles className="h-4 w-4" />
                {t('nav.getStarted')}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
