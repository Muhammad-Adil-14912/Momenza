import { Menu, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Nav items — hash links use plain <a>, page links use <Link>
  const navLinks = [
    { name: 'Home',         path: '/',              type: 'link' },
    { name: 'Discover',     path: '/#discover',     type: 'hash' },
    { name: 'How It Works', path: '/#how-it-works', type: 'hash' },
    { name: 'Inspiration',  path: '/moodboard',     type: 'link' },
    { name: 'My Events',    path: isAuthenticated ? '/dashboard/events' : '/login', type: 'link' },
  ];

  const isActive = (path) => {
    if (path.includes('#')) return false; // hash links never show as "active"
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `relative transition-colors duration-200 ${
      isActive(path)
        ? 'text-[#C47B62] font-semibold'
        : 'text-[#252522] hover:text-[#C47B62]'
    }`;

  const handleHashClick = (e, hash) => {
    // If already on home page, smooth-scroll; otherwise navigate then scroll
    if (location.pathname === '/') {
      e.preventDefault();
      const id = hash.replace('/#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE8E2] transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) =>
            link.type === 'hash' ? (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleHashClick(e, link.path)}
                className="text-[#252522] hover:text-[#C47B62] transition-colors duration-200 cursor-pointer"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={linkClass(link.path)}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C47B62] rounded-full" />
                )}
              </Link>
            )
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-sm font-medium text-[#252522] hover:text-[#C47B62] py-2 px-3 rounded-full hover:bg-[#F1EDE5] transition"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=F1EDE5&color=C47B62&size=64`
                  }
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#EAE8E2]"
                  referrerPolicy="no-referrer"
                />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/planner"
                className="inline-flex items-center space-x-2 bg-[#C47B62] hover:bg-[#A9614A] text-white text-sm font-medium px-5 py-2.5 rounded-full transition shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Planner</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#252522] hover:text-[#C47B62] px-4 py-2 transition"
              >
                Sign In
              </Link>
              <Link
                to="/planner"
                className="inline-flex items-center space-x-2 bg-[#252522] hover:bg-[#C47B62] text-white text-sm font-medium px-5 py-2.5 rounded-full transition shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#F1EDE5]" />
                <span>Start Planning</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="p-2 text-[#252522] hover:text-[#C47B62] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer — animated slide-down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#FAF9F6] border-b border-[#EAE8E2] px-6 py-5 space-y-1">
          {navLinks.map((link) =>
            link.type === 'hash' ? (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => handleHashClick(e, link.path)}
                className="block text-base font-medium text-[#252522] hover:text-[#C47B62] py-2.5 px-3 rounded-xl hover:bg-[#F1EDE5] transition"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium py-2.5 px-3 rounded-xl transition ${
                  isActive(link.path)
                    ? 'text-[#C47B62] bg-[#F1EDE5]'
                    : 'text-[#252522] hover:text-[#C47B62] hover:bg-[#F1EDE5]'
                }`}
              >
                {link.name}
              </Link>
            )
          )}

          <div className="pt-4 mt-2 border-t border-[#EAE8E2] space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-[#F1EDE5] text-[#252522] font-medium py-3 rounded-full"
                >
                  Dashboard
                </Link>
                <Link
                  to="/planner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-[#C47B62] text-white font-medium py-3 rounded-full"
                >
                  Open AI Planner
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center border border-[#EAE8E2] text-[#252522] font-medium py-2.5 rounded-full"
                >
                  Sign In
                </Link>
                <Link
                  to="/planner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-[#C47B62] text-white font-medium py-2.5 rounded-full"
                >
                  Start Planning
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
