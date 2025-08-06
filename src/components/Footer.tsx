'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Phone, MapPin, Mail, Globe } from 'lucide-react';
import { apiService } from '../lib/apiService';

interface FooterData {
  slogan: string;
  whatsapp: string;
  storeLocation: string;
  logoUrl: string;
}

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData>({
    slogan: '',
    whatsapp: '',
    storeLocation: '',
    logoUrl: ''
  });

  const [loading, setLoading] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);

        const [slogan, whatsapp, storeLocation, logoResponse] = await Promise.all([
          apiService.getData('get-slogan'),
          apiService.getData('get-whatsapp'),
          apiService.getData('get-store-location'),
          apiService.getData('get-logo')
        ]);

        let logoUrl = '';
        if (logoResponse) {
          const baseUrl = apiService.getBaseUrl();

          if (typeof logoResponse === 'string') {

            logoUrl = logoResponse.startsWith('http') ? logoResponse : `${baseUrl}/${logoResponse}`;
          } else if (typeof logoResponse === 'object' && logoResponse !== null) {

            const logoData = logoResponse as { asset_logo?: string; website_icon?: string };

            if (logoData.asset_logo) {
              logoUrl = logoData.asset_logo.startsWith('http') 
                ? logoData.asset_logo 
                : `${baseUrl}/${logoData.asset_logo}`;
            } else if (logoData.website_icon) {

              logoUrl = logoData.website_icon.startsWith('http') 
                ? logoData.website_icon 
                : `${baseUrl}/${logoData.website_icon}`;
            }
          }
        }

        setFooterData({
          slogan: slogan || '',
          whatsapp: whatsapp || '',
          storeLocation: storeLocation || '',
          logoUrl: logoUrl || ''
        });

        console.log('Footer data loaded:', {
          slogan: slogan || 'empty',
          whatsapp: whatsapp || 'empty', 
          storeLocation: storeLocation || 'empty',
          logoUrl: logoUrl || 'empty'
        });

      } catch (error) {
        console.error('Error fetching footer data:', error);
        setFooterData({
          slogan: '',
          whatsapp: '',
          storeLocation: '',
          logoUrl: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const handleLogoLoad = () => {
    console.log('Logo loaded successfully');
    setLogoLoaded(true);
  };

  const handleLogoError = () => {
    console.log('Logo failed to load');
    setLogoLoaded(false);
  };

  const handlePhoneClick = () => {
    window.open(`tel:${footerData.whatsapp}`, '_blank');
  };

  return (
    <footer className="bg-white">
      {}
      {}

      {}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {}
        <div className="text-center mb-6">
          {}
          {footerData.logoUrl && (
            <div 
              className={`lazy-load-image-background blur${logoLoaded ? ' lazy-load-image-loaded' : ''} mb-3`}
              key={footerData.logoUrl}
            >
              <img 
                src={footerData.logoUrl}
                alt="Seni Indah Gypsum Logo"
                className="h-12 w-auto mx-auto"
                onLoad={handleLogoLoad}
                onError={handleLogoError}
              />
            </div>
          )}

          {}
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Seni Indah Gypsum
          </h2>

          {}
          {loading ? (
            <div className="animate-pulse mx-auto max-w-md">
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ) : footerData.slogan ? (
            <p className="text-gray-600 max-w-lg mx-auto leading-relaxed text-sm">
              {footerData.slogan}
            </p>
          ) : (
            <p className="text-gray-400 italic text-sm">Slogan tidak tersedia</p>
          )}
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center border border-orange-100 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">Jam Operasional</h3>
            <p className="text-gray-600 text-xs">Senin - Sabtu</p>
            <p className="text-gray-800 font-medium text-sm">08.00 - 17.00</p>
          </div>

          {}
          {loading ? (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center border border-emerald-100">
              <div className="animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            </div>
          ) : footerData.whatsapp ? (
            <div 
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center border border-emerald-100 hover:shadow-md transition-all cursor-pointer group"
              onClick={handlePhoneClick}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">Hubungi Kami</h3>
              <p className="text-gray-600 text-xs">WhatsApp / Telepon</p>
              <p className="text-gray-800 font-medium group-hover:text-emerald-600 transition-colors text-sm">
                {footerData.whatsapp}
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center border border-gray-200">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-5 h-5 text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-500 mb-1 text-sm">Hubungi Kami</h3>
              <p className="text-gray-400 text-xs italic">Nomor tidak tersedia</p>
            </div>
          )}

          {}
          {loading ? (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center border border-blue-100">
              <div className="animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
              </div>
            </div>
          ) : footerData.storeLocation ? (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center border border-blue-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">Lokasi Toko</h3>
              <p className="text-gray-800 font-medium text-sm">{footerData.storeLocation}</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center border border-gray-200">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-5 h-5 text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-500 mb-1 text-sm">Lokasi Toko</h3>
              <p className="text-gray-400 text-xs italic">Lokasi tidak tersedia</p>
            </div>
          )}
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <a href="/tentang-kami" className="text-center py-4 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600">Tentang Kami</span>
          </a>

          <a href="/products" className="text-center py-4 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
            <div className="w-10 h-10 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">Produk</span>
          </a>

          <a href="/portofolio" className="text-center py-4 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
            <div className="w-10 h-10 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600">Galeri</span>
          </a>
        </div>

        {}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Pemesanan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a 
              href="/cara-order" 
              className="text-center py-3 px-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg hover:bg-gradient-to-br hover:from-emerald-100 hover:to-teal-100 transition-all border border-emerald-100 group"
            >
              <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600">Cara Order</span>
            </a>

            <a 
              href="/survey-lokasi" 
              className="text-center py-3 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg hover:bg-gradient-to-br hover:from-blue-100 hover:to-cyan-100 transition-all border border-blue-100 group"
            >
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">Survey Lokasi</span>
            </a>

            <a 
              href="/teknis-pemasangan" 
              className="text-center py-3 px-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:bg-gradient-to-br hover:from-purple-100 hover:to-pink-100 transition-all border border-purple-100 group"
            >
              <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600">Teknis Pemasangan</span>
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            © 2025 <span className="font-bold text-gray-800">Seni Indah Gypsum</span>. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Powered by <a 
              href="https://itsfarhan.com" 
              className="text-black font-bold hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              itsfarhan.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;