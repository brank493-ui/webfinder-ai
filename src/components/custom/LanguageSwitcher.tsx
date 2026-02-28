'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguageStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('language.selectLanguage')}</span>
          <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🇬🇧</span>
            <span>{t('language.english')}</span>
          </span>
          {language === 'en' && <Check className="h-4 w-4 text-green-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('fr')}
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🇫🇷</span>
            <span>{t('language.french')}</span>
          </span>
          {language === 'fr' && <Check className="h-4 w-4 text-green-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
