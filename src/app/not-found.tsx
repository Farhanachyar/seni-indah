'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search, Phone, MessageCircle } from 'lucide-react';
import { apiPost } from '../utils/apiClient';
import { API_ENDPOINTS } from '../lib/apiEndpoints';

interface WhatsAppData {
  number: string;
  message?: string;
}

interface StoreLocationData {
  address: string;
  city: string;
  province?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LegacyApiResponse {
  status: string;
  detail: string;
}

export default function NotFound() {
  const [whatsappData, setWhatsappData] = useState<string>('');
  const [storeLocation, setStoreLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        setLoading(true);

        const whatsappResponse = await apiPost(API_ENDPOINTS['get-whatsapp'], {}) as LegacyApiResponse;
        if (whatsappResponse.status === 'SUCCESS') {
          setWhatsappData(whatsappResponse.detail);
        }

        const locationResponse = await apiPost(API_ENDPOINTS['get-store-location'], {}) as LegacyApiResponse;
        if (locationResponse.status === 'SUCCESS') {
          setStoreLocation(locationResponse.detail);
        }

      } catch (error) {
        console.error('Error fetching system data:', error);

        setWhatsappData('6281234567890');
        setStoreLocation('Payakumbuh - Lima Puluh Kota');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemData();
  }, []);

  const handleWhatsAppClick = () => {
    if (whatsappData) {
      const phoneNumber = whatsappData.startsWith('+') 
        ? whatsappData.replace('+', '') 
        : whatsappData;
      
      const message = 'Halo, saya tertarik dengan layanan Seni Indah Gypsum & Interior';
      const encodedMessage = encodeURIComponent(message);
      
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }
  };

  const formatLocation = () => {
    if (!storeLocation) return 'Loading...';
    return storeLocation;
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl mb-4">😕</div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 blur-2xl opacity-20 rounded-full transform scale-110"></div>
          </div>
        </div>

        {}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut telah dipindahkan atau tidak pernah ada.
          </p>
        </div>

        {}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">
              <span className="text-green-600">Seni</span>
              <span className="text-gray-800">Indah</span>
            </h3>
            <p className="text-sm text-gray-600">Gypsum & Interior</p>
          </div>
          <p className="text-gray-600 text-sm text-center">
            Spesialis Gypsum, Plafon & Rangka Bajaringan serta Interior<br />
            <span className="text-green-600 font-medium">
              📍 {loading ? 'Loading lokasi...' : formatLocation()}
            </span>
          </p>
        </div>

        {}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Home size={20} />
              Kembali ke Beranda
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft size={20} />
              Halaman Sebelumnya
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">Atau hubungi kami langsung:</p>
            <button
              onClick={handleWhatsAppClick}
              disabled={loading || !whatsappData}
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <MessageCircle size={18} />
              {loading ? 'Loading...' : 'Chat via WhatsApp'}
            </button>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Search size={20} className="text-green-600" />
            Halaman Populer
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link
              href="/products"
              className="p-3 bg-gray-50 hover:bg-green-50 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200 text-center"
            >
              Daftar Produk
            </Link>
            <Link
              href="/portofolio"
              className="p-3 bg-gray-50 hover:bg-green-50 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200 text-center"
            >
              Portofolio
            </Link>
            <Link
              href="/tentang-kami"
              className="p-3 bg-gray-50 hover:bg-green-50 rounded-lg text-sm font-medium text-gray-700 hover:text-green-600 transition-colors duration-200 text-center"
            >
              Tentang Kami
            </Link>
          </div>
        </div>

        {}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  );
}