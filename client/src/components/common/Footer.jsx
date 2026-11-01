import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-[#FAF9F6] border-t border-[#EAE8E2] text-[#252522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="large" showTagline={true} />
            <p className="text-sm text-[#85847F] max-w-sm leading-relaxed mt-4 font-light">
              An intelligent luxury event planning platform bringing your vision, budget, and every little detail into seamless harmony.
            </p>
            <p className="font-serif italic text-sm text-[#C47B62] pt-2">
              "A little less planning. A lot more celebrating."
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#85847F]">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/planner" className="hover:text-[#C47B62] transition-colors">AI Planner</Link>
              </li>
              <li>
                <Link to="/#discover" className="hover:text-[#C47B62] transition-colors">Discover</Link>
              </li>
              <li>
                <Link to="/moodboard" className="hover:text-[#C47B62] transition-colors">Moodboards</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#C47B62] transition-colors">Workspace</Link>
              </li>
            </ul>
          </div>

          {/* Celebrations */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#85847F]">Celebrations</h4>
            <ul className="space-y-2.5 text-sm text-[#252522]">
              <li><Link to="/planner?type=Weddings" className="hover:text-[#C47B62] transition-colors">Weddings</Link></li>
              <li><Link to="/planner?type=Birthdays" className="hover:text-[#C47B62] transition-colors">Birthdays</Link></li>
              <li><Link to="/planner?type=Anniversaries" className="hover:text-[#C47B62] transition-colors">Anniversaries</Link></li>
              <li><Link to="/planner?type=Corporate%20Events" className="hover:text-[#C47B62] transition-colors">Corporate Galas</Link></li>
              <li><Link to="/planner?type=Community%20Celebrations" className="hover:text-[#C47B62] transition-colors">Community Festivals</Link></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#85847F]">Concierge & Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:concierge@momenza.art" className="hover:text-[#C47B62] transition-colors">concierge@momenza.art</a></li>
              <li><span className="text-[#85847F]">Designed for luxury celebrations</span></li>
              <li className="pt-2"><Link to="/#terms" className="hover:text-[#C47B62] transition-colors">Terms of Service</Link></li>
              <li><Link to="/#privacy" className="hover:text-[#C47B62] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#EAE8E2] flex flex-col sm:flex-row items-center justify-between text-xs text-[#85847F]">
          <p>© {new Date().getFullYear()} MOMENZA. All rights reserved.</p>
          <p className="mt-4 sm:mt-0 font-serif italic">
            Curated with quiet luxury & intelligent AI.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
