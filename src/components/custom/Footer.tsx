'use client';

import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useLanguageStore } from '@/store/useLanguageStore';
import { LanguageSwitcher } from '@/components/custom/LanguageSwitcher';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguageStore();

  return (
    <footer id="about" className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Image
                src="/webfinder-logo-new.png"
                alt="WebFinder Logo"
                width={32}
                height={32}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg"
              />
              <span className="text-lg sm:text-xl font-bold text-white">WebFinder</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 max-w-sm">
              {t('footer.description')}
            </p>
            {/* Language Switcher in Footer */}
            <div className="mt-4">
              <LanguageSwitcher variant="full" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{t('nav.quickLinks')}</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#dashboard" className="hover:text-white transition-colors">
                  {t('nav.dashboard')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  {t('package.pricing')}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  {t('nav.howItWorks')}
                </a>
              </li>
              <li>
                <button 
                  onClick={() => window.location.href = 'mailto:brank493@gmail.com?subject=FAQ%20Inquiry'}
                  className="hover:text-white transition-colors text-left"
                >
                  {t('nav.faq')}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">{t('nav.contact')}</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <a href="mailto:brank493@gmail.com" className="hover:text-white transition-colors truncate">
                  brank493@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <a href="tel:+237693401619" className="hover:text-white transition-colors">
                  +237 693 401 619
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Cameroon<br />
                  West Africa
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col gap-3 sm:gap-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            &copy; {currentYear} WebFinder. {t('footer.rights')}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            {t('footer.ownedBy')} <span className="text-white font-medium">Fongang Lamago Brank</span>
          </p>
          <div className="flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <button 
              onClick={() => window.location.href = 'mailto:brank493@gmail.com?subject=Privacy%20Policy%20Request'}
              className="hover:text-white transition-colors"
            >
              {t('nav.privacyPolicy')}
            </button>
            <button 
              onClick={() => window.location.href = 'mailto:brank493@gmail.com?subject=Terms%20of%20Service%20Request'}
              className="hover:text-white transition-colors"
            >
              {t('nav.termsOfService')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
