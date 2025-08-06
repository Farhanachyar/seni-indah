'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Head from 'next/head';
import { Menu, X, Home, Grid, Image, User, Wrench, Phone, MessageCircle, LogIn, LogOut, Settings } from 'lucide-react';
import { apiService } from '../lib/apiService';
import { useAuthContext } from './AuthProvider';

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [faviconUrl, setFaviconUrl] = useState<string>('');
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [slidingTexts, setSlidingTexts] = useState<Array<{text: string; icon: string}>>([]);

  const { isAuthenticated, user, logout } = useAuthContext();

  const formatRole = (role: string) => {
    return role?.replace(/_/g, ' ').toUpperCase();
  };

  const setFavicon = (iconUrl: string) => {
    try {

      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => link.remove());

      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = iconUrl;

      const linkPng = document.createElement('link');
      linkPng.rel = 'icon';
      linkPng.type = 'image/png';
      linkPng.href = iconUrl;

      const linkApple = document.createElement('link');
      linkApple.rel = 'apple-touch-icon';
      linkApple.href = iconUrl;

      document.head.appendChild(link);
      document.head.appendChild(linkPng);
      document.head.appendChild(linkApple);

      console.log('✅ Favicon updated:', iconUrl);
    } catch (error) {
      console.warn('⚠️ Failed to set favicon:', error);
    }
  };

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const [logoResponse, slidingTextResponse] = await Promise.all([
          apiService.getData('get-logo'),
          apiService.getData('get-sliding-text')
        ]);

        if (logoResponse) {
          const baseUrl = apiService.getBaseUrl();

          if (typeof logoResponse === 'string') {

            const fullLogoUrl = logoResponse.startsWith('http') ? logoResponse : `${baseUrl}/${logoResponse}`;
            setLogoUrl(fullLogoUrl);
          } else if (typeof logoResponse === 'object' && logoResponse !== null) {

            const logoData = logoResponse as { asset_logo?: string; website_icon?: string };

            if (logoData.asset_logo) {
              const fullLogoUrl = logoData.asset_logo.startsWith('http') 
                ? logoData.asset_logo 
                : `${baseUrl}/${logoData.asset_logo}`;
              setLogoUrl(fullLogoUrl);
            }

            if (logoData.website_icon) {
              const fullIconUrl = logoData.website_icon.startsWith('http') 
                ? logoData.website_icon 
                : `${baseUrl}/${logoData.website_icon}`;
              setFaviconUrl(fullIconUrl);

              setFavicon(fullIconUrl);
            }
          }
        }

        if (slidingTextResponse) {
          try {
            const parsedResponse = typeof slidingTextResponse === 'string' 
              ? JSON.parse(slidingTextResponse) 
              : slidingTextResponse;

            if (parsedResponse && parsedResponse.slidingTexts && Array.isArray(parsedResponse.slidingTexts)) {
              const formattedTexts = parsedResponse.slidingTexts.map((item: any, index: number) => ({
                text: item.text,
                icon: index === 0 ? "📍" : ""
              }));
              setSlidingTexts(formattedTexts);
            }
          } catch (parseError) {

          }
        }

      } catch (error) {

        console.warn('⚠️ Failed to fetch header data:', error);
      }
    };

    fetchHeaderData();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        const nextIndex = (currentTextIndex + 1) % slidingTexts.length;
        setCurrentTextIndex(nextIndex);
        setIsAnimating(false);
      }, 1000);

    }, 5000);

    return () => clearInterval(interval);
  }, [currentTextIndex, slidingTexts.length]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    window.location.href = '/';
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281234567890', '_blank');
  };

  const handleLogoLoad = () => {
    setLogoLoaded(true);
  };

  const handleLogoError = () => {
    setLogoLoaded(false);
  };

  const isActivePath = (path: string) => {

    if (!pathname) return false;

    if (path === '/') {
      return pathname === '/';
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Daftar Produk', icon: Grid },
    { href: '/portofolio', label: 'Portofolio', icon: Image },
    { href: '/tentang-kami', label: 'Tentang Kami', icon: User }
  ];

  const renderLogo = () => {
    if (logoUrl) {
      return (
        <div className={`lazy-load-image-background blur ${logoLoaded ? 'lazy-load-image-loaded' : ''}`}>
          <img 
            src={logoUrl}
            alt="Seni Indah Gypsum Logo"
            className="h-10 w-auto"
            onLoad={handleLogoLoad}
            onError={handleLogoError}
          />
        </div>
      );
    } else {

      return <div className="h-10 w-20"></div>;
    }
  };

  const renderMobileLogo = () => {
    if (logoUrl) {
      return (
        <div className={`lazy-load-image-background blur ${logoLoaded ? 'lazy-load-image-loaded' : ''}`}>
          <img 
            src={logoUrl}
            alt="Seni Indah Gypsum Logo"
            className="h-8 w-auto"
            onLoad={handleLogoLoad}
            onError={handleLogoError}
          />
        </div>
      );
    } else {

      return <div className="h-8 w-16"></div>;
    }
  };

  const renderAuthSection = () => {
    if (isAuthenticated && user) {
      return (
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-800 text-gray-700 hover:text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300"
          >
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium">{user.name}</span>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-blue-600 font-medium">{formatRole(user.role || '')}</p>
              </div>

              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Link
          href="/login"
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-800 text-gray-700 hover:text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300"
        >
          <LogIn size={18} />
          <span className="font-medium">Login</span>
        </Link>
      );
    }
  };

  const renderMobileAuthSection = () => {
    if (isAuthenticated && user) {
      return (
        <>
          {}
          <li className="border-t border-gray-200 pt-2">
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-blue-600 font-medium">{formatRole(user.role || '')}</p>
                </div>
              </div>
            </div>
          </li>

          {}
          <li>
            <Link
              href="/dashboard"
              className="flex items-center px-6 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              onClick={toggleMenu}
            >
              <Settings className="w-5 h-5 mr-4 text-green-500" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>

          {}
          <li>
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="w-full flex items-center px-6 py-4 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-4" />
              <span className="font-medium">Logout</span>
            </button>
          </li>
        </>
      );
    } else {
      return (
        <li>
          <Link
            href="/login"
            className="w-full flex items-center px-6 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
            onClick={toggleMenu}
          >
            <LogIn className="w-5 h-5 mr-4 text-green-500" />
            <span className="font-medium">Login</span>
          </Link>
        </li>
      );
    }
  };

  return (
    <>
      {}
      {faviconUrl && (
        <Head>
          <link rel="icon" type="image/x-icon" href={faviconUrl} />
          <link rel="icon" type="image/png" href={faviconUrl} />
          <link rel="apple-touch-icon" href={faviconUrl} />
        </Head>
      )}

      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-[100]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {}
            <div className="hidden md:flex items-center w-1/3">
              <Link href="/" className="flex items-center logo-margin">
                {renderLogo()}
              </Link>
            </div>

            {}
            <div className="md:hidden flex items-center justify-between w-full">
              {}
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>

              {}
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 bg-green-500 hover:bg-white hover:border-green-500 text-white hover:text-green-600 px-3 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border-2 border-green-500"
              >
                <MessageCircle size={16} />
                <span className="font-medium text-sm">Chat Via WhatsApp</span>
              </button>
            </div>

            {}
            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => {
                const isActive = isActivePath(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative transition-colors duration-200 font-medium group ${
                      isActive
                        ? 'text-green-600'
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                  >
                    {item.label}
                    <span 
                      className={`absolute bottom-0 left-0 h-0.5 bg-green-600 transition-all duration-300 ease-out ${
                        isActive
                          ? 'w-full opacity-100'
                          : 'w-0 group-hover:w-full opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {}
            <div className="hidden md:flex items-center gap-3 w-1/3 justify-end">
              {}
              {renderAuthSection()}

              {}
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 bg-green-500 hover:bg-white hover:border-green-500 text-white hover:text-green-600 px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg border-2 border-green-500"
              >
                <MessageCircle size={18} />
                <span className="font-medium">Chat Via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div 
        id="sliding-text-container"
        className="text-white fixed left-0 right-0 z-[98] overflow-hidden bg-secondary-100 top-[72px] md:top-[75px]" 
        style={{ height: '30px' }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-center relative h-full">
            <div className="relative flex items-center justify-center w-full h-full">
              {slidingTexts.length > 0 && slidingTexts.map((item, index) => {
                const isCurrent = index === currentTextIndex;
                const isNext = index === (currentTextIndex + 1) % slidingTexts.length;

                let transform = 'translateY(40px)';
                let opacity = 0;

                if (isCurrent && !isAnimating) {
                  transform = 'translateY(0px)';
                  opacity = 1;
                } else if (isCurrent && isAnimating) {
                  transform = 'translateY(-40px)';
                  opacity = 0;
                } else if (isNext && isAnimating) {
                  transform = 'translateY(0px)';
                  opacity = 1;
                } else {
                  transform = 'translateY(40px)';
                  opacity = 0;
                }

                return (
                  <div
                    key={`sliding-${index}`}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform,
                      opacity,
                      transition: 'all 1000ms ease-out',
                      zIndex: isCurrent ? 2 : 1
                    }}
                  >
                    <span className="text-sm font-medium text-black whitespace-nowrap flex items-center gap-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                      {item.icon && <span className="text-base">{item.icon}</span>}
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {}
      <div 
        className={`fixed inset-0 z-[101] md:hidden ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div 
          className="fixed inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
            backdropFilter: isMenuOpen ? 'blur(4px)' : 'blur(0px)',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onClick={toggleMenu}
        />

        <aside 
          className="fixed top-0 left-0 h-full w-[70%] bg-white shadow-xl"
          style={{
            transform: isMenuOpen ? 'translateX(0%)' : 'translateX(-100%)',
            transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {}
            <div className="flex items-center">
              {renderMobileLogo()}
            </div>

            {}
            <div className="flex-1"></div>

            {}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-6 py-4 transition-colors duration-200 ${
                        isActive
                          ? 'text-green-600 bg-green-50 border-r-4 border-green-500'
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }`}
                      onClick={toggleMenu}
                    >
                      <Icon 
                        className={`w-5 h-5 mr-4 ${
                          isActive ? 'text-green-600' : 'text-green-500'
                        }`} 
                      />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}

              {}
              {renderMobileAuthSection()}
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            {}
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mb-3 border border-red-300"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-800 text-gray-700 hover:text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mb-3 border border-gray-300"
                onClick={toggleMenu}
              >
                <LogIn size={18} />
                <span className="font-medium">Login</span>
              </Link>
            )}

            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-white hover:border-green-500 text-white hover:text-green-600 px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-green-500"
            >
              <MessageCircle size={18} />
              <span className="font-medium">Chat Via WhatsApp</span>
            </button>
            <div className="text-sm text-gray-600 mt-3">
              <p className="font-semibold text-green-600 mb-1">Seni Indah Gypsum</p>
              <p className="text-xs">Spesialis Gypsum, Plafon & Rangka Bajaringan serta Interior</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Header;