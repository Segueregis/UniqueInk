import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-black border-t border-gray-800 pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-gray-400 max-w-xs">
              Exclusive tattoo designs that are uniquely yours. Once purchased, these designs are removed from our collection forever.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-ink-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ink-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ink-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-ink-gold transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-1">
            <h4 className="font-display text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-ink-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-ink-gold transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/manifesto" className="text-gray-400 hover:text-ink-gold transition-colors">
                  Manifesto
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1 lg:col-span-1">
            <h4 className="font-display text-xl font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-ink-gold transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-ink-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-ink-gold transition-colors">
                  Copyright
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1 lg:col-span-1">
            <h4 className="font-display text-xl font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-400">
              Have questions? Reach out to us at:
            </p>
            <a href="mailto:info@uniqueink.com" className="text-ink-gold hover:underline">
              info@uniqueink.com
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} UniqueInk. All rights reserved.
          </p>
          <p className="text-ink-gold mt-2 italic font-display">
            "A sua arte começa aqui."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;