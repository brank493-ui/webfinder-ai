'use client';

import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useLanguageStore } from '@/store/useLanguageStore';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguageStore();

  return (
    <footer id="about" className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/webfinder-logo-new.png"
                alt="WebFinder Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg"
              />
              <span className="text-xl font-bold text-white">WebFinder</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('nav.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
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
                <a href="#" className="hover:text-white transition-colors">
                  {t('nav.howItWorks')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t('nav.faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t('nav.contact')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <a href="mailto:brank493@gmail.com" className="hover:text-white transition-colors">
                  brank493@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <a href="tel:+237693401619" className="hover:text-white transition-colors">
                  +237 693 401 619
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                <span>
                  Cameroon<br />
                  West Africa
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} WebFinder. {t('footer.rights')}
          </p>
          <p className="text-sm text-gray-600">
            {t('footer.ownedBy')} <span className="text-white font-medium">Fongang Lamago Brank</span>
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              {t('nav.privacyPolicy')}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t('nav.termsOfService')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
