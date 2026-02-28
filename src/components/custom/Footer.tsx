'use client';

import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              We help businesses establish their online presence by connecting them
              with professional website development services. Our AI-powered platform
              makes it easy to get online and grow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
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
            &copy; {currentYear} WebFinder. All rights reserved.
          </p>
          <p className="text-sm text-gray-600">
            Owned by <span className="text-white font-medium">Fongang Lamago Brank</span>
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
