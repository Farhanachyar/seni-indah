'use client';

import React, { useEffect } from 'react';
import { CheckCircle, Star, Award, Users, Clock, Phone, MessageCircle } from 'lucide-react';
import FAQ from '../components/faq';
import CategoryGrid from '../components/CategoryGrid';

const Home = () => {

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/6281234567890', '_blank');
  };

  const stats = [
    { icon: Users, number: "500+", label: "Klien Puas" },
    { icon: CheckCircle, number: "1000+", label: "Proyek Selesai" },
    { icon: Award, number: "10+", label: "Tahun Pengalaman" },
    { icon: Star, number: "4.9", label: "Rating Kepuasan" }
  ];

  const features = [
    {
      icon: "🏗️",
      title: "Kualitas Terbaik",
      description: "Material berkualitas tinggi dengan standar terbaik untuk hasil yang tahan lama dan memuaskan"
    },
    {
      icon: "💰",
      title: "Harga Terjangkau", 
      description: "Harga kompetitif dan transparan tanpa biaya tersembunyi. Tersedia cicilan 0% untuk proyek tertentu"
    },
    {
      icon: "⚡",
      title: "Pelayanan Prima",
      description: "Layanan profesional dan responsif dengan tim berpengalaman lebih dari 10 tahun"
    }
  ];

  return (

    <div className="min-h-screen bg-white">
      {}
      <section className="relative bg-green-700 text-white py-24">
        <div 
          className="px-4"
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <span className="text-green-700 font-bold text-2xl">SI</span>
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Seni Indah
                </h1>
                <p className="text-green-200 text-lg">Gypsum & Interior</p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Spesialis Plafon Gypsum & Bajaringan Terpercaya
            </h2>
            <p className="text-lg md:text-xl mb-8 text-green-100 leading-relaxed">
              Wujudkan hunian impian Anda dengan layanan profesional dan berkualitas tinggi. 
              Melayani Payakumbuh, Lima Puluh Kota, dan sekitarnya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleWhatsAppClick}
                className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-300 flex items-center gap-3 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Konsultasi Gratis
              </button>
              <button 
                onClick={handleWhatsAppClick}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-700 transition-colors duration-300 flex items-center gap-3"
              >
                <Phone className="w-5 h-5" />
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gray-50">
        <div 
          className="px-4"
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Dengan pengalaman lebih dari 10 tahun, kami berkomitmen memberikan hasil terbaik untuk setiap proyek
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-green-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="relative py-20 bg-cover bg-center bg-fixed overflow-hidden">
        {}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80")'
          }}
        ></div>

        {}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {}
        <div 
          className="relative z-10 px-4"
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}
        >
          <div className="text-center text-white">
            {}
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Proses Kerja
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-16"></div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "📋",
                  title: "Estimasi Harga",
                  description: "Konsultasi dan perhitungan biaya yang akurat sesuai kebutuhan"
                },
                {
                  icon: "📍",
                  title: "Survey Lokasi", 
                  description: "Tim ahli melakukan survei untuk mengukur dan menganalisis lokasi"
                },
                {
                  icon: "🔧",
                  title: "Proses Pemasangan",
                  description: "Pemasangan profesional dengan standar kualitas terbaik"
                },
                {
                  icon: "✨",
                  title: "Finishing",
                  description: "Penyelesaian akhir dan quality control untuk hasil sempurna"
                }
              ].map((process, index) => (
                <div key={index} className="group">
                  {}
                  <div className="text-6xl md:text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {process.icon}
                  </div>

                  {}
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                      {process.title}
                    </h3>
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {}
      <CategoryGrid />

      {}
      <section className="py-16 bg-white">
        <div 
          className="px-4"
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}
        >
          <FAQ />
        </div>
      </section>
    </div>
  );
};

export const runtime = "edge";

export default Home;