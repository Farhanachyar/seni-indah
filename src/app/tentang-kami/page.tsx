'use client';

import React, { useEffect } from 'react';

const TentangKami = () => {

  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

  useEffect(() => {
      document.title = `Tentang Kami | ${projectName}`;
    }, []);

  return (
    <div>
      {}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-40 h-40 bg-primary rounded-full animate-pulse"></div>
          <div className="absolute top-60 right-32 w-24 h-24 bg-secondary rounded-full"></div>
          <div className="absolute bottom-40 left-1/3 w-32 h-32 bg-secondary-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-primary rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-secondary-300 rounded-full"></div>
          <div className="absolute top-80 right-60 w-12 h-12 bg-primary rounded-full animate-pulse"></div>

          {}
          <div className="absolute top-40 left-60 w-16 h-16 bg-secondary transform rotate-45"></div>
          <div className="absolute bottom-60 right-40 w-20 h-20 bg-primary-500 transform rotate-12"></div>
          <div className="absolute top-96 left-20 w-8 h-24 bg-secondary-400 transform -rotate-45"></div>
        </div>

        {}
        <div className="absolute inset-0 opacity-8">
          <div className="grid grid-cols-20 gap-6 h-full w-full">
            {Array.from({length: 100}).map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-secondary-300'}`}></div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {}
            <div>
              <div className="inline-block bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                Sejak 2009
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Toko Seni
                <span className="block text-primary">Indah Gypsum</span>
              </h1>
              <p className="text-xl text-gray-900 mb-8 leading-relaxed">
                Spesialis plafon gypsum dan interior premium yang telah dipercaya 
                selama <strong>14+ tahun</strong> memberikan solusi terbaik untuk rumah impian Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/kontak" className="bg-primary hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 text-center">
                  Konsultasi Sekarang
                </a>
                <a href="/gallery" className="border-2 border-gray-900 hover:border-primary text-gray-900 hover:text-primary px-8 py-4 rounded-full font-semibold transition-all text-center">
                  Lihat Portfolio
                </a>
              </div>
            </div>

            {}
            <div className="relative">
              <div className="bg-gradient-to-r from-primary to-primary-600 rounded-3xl p-8 sm:p-12 text-center">
                <div className="text-6xl sm:text-7xl lg:text-8xl font-black mb-4 text-black">14+</div>
                <div className="text-secondary text-xl sm:text-2xl font-bold mb-4">Tahun Pengalaman</div>
                <div className="text-black text-base sm:text-lg">
                  Melayani dengan dedikasi sejak 2009
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-white relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-12">
          <div className="absolute top-10 right-10 w-3 h-32 bg-secondary transform rotate-12"></div>
          <div className="absolute top-40 left-10 w-3 h-24 bg-primary transform -rotate-12"></div>
          <div className="absolute bottom-32 right-1/4 w-2 h-36 bg-secondary-400"></div>
          <div className="absolute top-20 left-1/3 w-4 h-20 bg-secondary-300 transform rotate-45"></div>
          <div className="absolute bottom-40 left-20 w-2 h-28 bg-primary transform rotate-30"></div>
          <div className="absolute top-60 right-1/3 w-3 h-16 bg-secondary transform -rotate-30"></div>
        </div>

        {}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-32 left-1/2 w-6 h-6 bg-primary rounded-full"></div>
          <div className="absolute top-80 right-20 w-4 h-8 bg-secondary-400 transform rotate-45"></div>
          <div className="absolute bottom-20 left-1/4 w-8 h-4 bg-secondary"></div>
          <div className="absolute top-1/2 right-1/2 w-3 h-3 bg-primary transform rotate-45"></div>
          <div className="absolute bottom-60 right-10 w-5 h-5 bg-secondary-300 rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-3 gap-16">
            {}
            <div className="lg:col-span-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Cerita
                <span className="block text-secondary">Kami</span>
              </h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
              <p className="text-gray-900">
                Perjalanan passion kami dalam dunia konstruksi interior
              </p>
            </div>

            {}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-secondary-300 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Dimulai dari Passion 🎯
                </h3>
                <p className="text-gray-900 leading-relaxed">
                  Tahun 2009 menjadi titik awal perjalanan kami di dunia plafon gypsum. 
                  Berawal dari passion untuk menciptakan ruang yang indah dan fungsional, 
                  kami berkomitmen memberikan kualitas terbaik dalam setiap proyek.
                </p>
              </div>

              <div className="bg-primary-50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Berkembang dengan Inovasi 🚀
                </h3>
                <p className="text-gray-900 leading-relaxed">
                  Tidak hanya plafon gypsum, kami kini menyediakan solusi lengkap: 
                  plafon PVC, papan semen, rangka atap, hingga layanan renovasi total. 
                  Tim ahli kami siap mewujudkan visi interior impian Anda.
                </p>
              </div>

              <div className="bg-secondary-400 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Komitmen Kualitas Premium 💎
                </h3>
                <p className="text-gray-900 leading-relaxed">
                  Setiap material yang kami sediakan telah melalui kurasi ketat. 
                  Dengan harga yang fleksibel namun kualitas tidak pernah berkompromi, 
                  kami yakin dapat memberikan nilai terbaik untuk investasi rumah Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-secondary-300 relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-15">
          <div className="grid grid-cols-16 gap-4 h-full">
            {Array.from({length: 128}).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i % 4 === 0 ? 'bg-primary' : i % 4 === 1 ? 'bg-secondary' : i % 4 === 2 ? 'bg-secondary-400' : 'bg-black'}`}></div>
            ))}
          </div>
        </div>

        {}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-0.5 h-full bg-primary transform rotate-12"></div>
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-secondary transform -rotate-6"></div>
          <div className="absolute top-0 left-3/4 w-0.5 h-full bg-primary transform rotate-8"></div>
        </div>

        {}
        <div className="absolute inset-0 opacity-12">
          <div className="absolute top-20 left-20 w-8 h-8 bg-primary transform rotate-45"></div>
          <div className="absolute top-60 right-32 w-6 h-12 bg-secondary"></div>
          <div className="absolute bottom-40 left-1/3 w-10 h-6 bg-secondary-400 transform -rotate-12"></div>
          <div className="absolute bottom-20 right-20 w-4 h-16 bg-primary transform rotate-30"></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-4 bg-secondary transform rotate-60"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Layanan <span className="text-primary">Unggulan</span>
            </h2>
            <p className="text-xl text-gray-900 max-w-2xl mx-auto">
              Solusi lengkap dari konsep hingga realisasi rumah impian Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-black text-2xl">🏗️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Plafon Gypsum Premium</h3>
              <p className="text-gray-900 mb-6">
                Koleksi lengkap plafon gypsum dengan berbagai motif dan finishing berkualitas tinggi
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-black text-2xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Desain Interior</h3>
              <p className="text-gray-900 mb-6">
                Konsultasi dan desain interior custom sesuai gaya hidup dan preferensi Anda
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-black text-2xl">🔧</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pemasangan Profesional</h3>
              <p className="text-gray-900 mb-6">
                Tim teknisi berpengalaman dengan standar kerja tinggi dan jaminan hasil
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-6">
                <span className="text-black text-2xl">🏠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Renovasi Total</h3>
              <p className="text-gray-900 mb-6">
                Layanan renovasi menyeluruh dari perencanaan hingga finishing dengan hasil maksimal
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-black text-2xl">📐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Material Premium</h3>
              <p className="text-gray-900 mb-6">
                Rangka baja, papan semen, dan material konstruksi berkualitas terjamin
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-black text-2xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Konsultasi Gratis</h3>
              <p className="text-gray-900 mb-6">
                Diskusi kebutuhan dan estimasi biaya tanpa biaya dengan tim ahli kami
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-white relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-8">
          <div className="grid grid-cols-12 h-full">
            {Array.from({length: 12}).map((_, i) => (
              <div key={i} className="border-r border-gray-300"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-8">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="border-b border-gray-200"></div>
            ))}
          </div>
        </div>

        {}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 left-10 w-24 h-0.5 bg-primary"></div>
          <div className="absolute top-1/2 right-10 w-32 h-0.5 bg-secondary"></div>
          <div className="absolute bottom-1/3 left-1/3 w-20 h-0.5 bg-secondary-400"></div>
          <div className="absolute top-20 right-1/4 w-0.5 h-16 bg-primary"></div>
          <div className="absolute bottom-20 left-1/2 w-0.5 h-24 bg-secondary"></div>
        </div>

        {}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-6 h-6 border-l-2 border-t-2 border-primary"></div>
          <div className="absolute top-10 right-10 w-6 h-6 border-r-2 border-t-2 border-secondary"></div>
          <div className="absolute bottom-10 left-10 w-6 h-6 border-l-2 border-b-2 border-secondary-400"></div>
          <div className="absolute bottom-10 right-10 w-6 h-6 border-r-2 border-b-2 border-primary"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-gradient-to-r from-primary to-primary-600 rounded-3xl p-12">
            <h2 className="text-4xl font-black mb-8 text-center text-black">
              Kami Siap Melayani
            </h2>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-secondary">
                <div className="text-secondary text-2xl sm:text-3xl font-bold mb-2">Senin - Sabtu</div>
                <div className="text-black text-sm sm:text-base">08.00 - 17.00 WIB</div>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-gray-300">
                <div className="text-gray-600 text-2xl sm:text-3xl font-bold mb-2">Minggu</div>
                <div className="text-gray-600 text-sm sm:text-base">Libur</div>
              </div>
            </div>

            <p className="text-black mt-8 text-center">
              Kunjungi toko kami atau hubungi untuk konsultasi langsung dengan tim ahli
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-20 left-20 w-20 h-20 bg-primary-100 rounded-full"></div>
          <div className="absolute top-60 right-32 w-16 h-16 bg-secondary-100 rounded-full"></div>
          <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-primary-100 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-secondary-100 rounded-full"></div>
        </div>

        {}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 h-full">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="border-r border-gray-300"></div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Lokasi <span className="text-primary">Kami</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-primary-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl">🏪</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Seni Indah Gypsum</h3>
                  <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    Toko Utama, Lampasi
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-sm">📍</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Jl Tan Malaka km 4, No. 186</p>
                    <p className="text-gray-600">Parik Muko Aia, Kota Payakumbuh</p>
                    <p className="text-gray-600">Sumatera Barat</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://maps.app.goo.gl/UNZP3BqD7i8ZZATS7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-primary hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-center block"
              >
                📍 Buka di Google Maps
              </a>
            </div>

            {}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-secondary-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-secondary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-2xl">🏬</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Seni Indah Gypsum</h3>
                  <div className="inline-block bg-secondary-200 text-secondary-800 px-3 py-1 rounded-full text-sm font-medium">
                    Cabang Balai Jaring
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-secondary-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-secondary-700 text-sm">📍</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Jl Moh Yamin No. 269-162</p>
                    <p className="text-gray-600">Balai Jaring, Kota Payakumbuh</p>
                    <p className="text-gray-600">Sumatera Barat</p>
                  </div>
                </div>
              </div>

              <a 
                href="https://maps.app.goo.gl/dfbKgfXb7zjGTuNm7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-secondary hover:bg-secondary-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-center block"
              >
                📍 Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-600 rounded-lg transform rotate-12"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transform -rotate-12"></div>
          <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full"></div>
        </div>

        {}
        <div className="absolute inset-0 opacity-8">
          <div className="grid grid-cols-12 gap-8 h-full items-center">
            {Array.from({length: 24}).map((_, i) => (
              <div key={i} className="text-2xl opacity-20">
                {i % 3 === 0 ? '📸' : i % 3 === 1 ? '❤️' : '✨'}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-pink-100">
            {}
            <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Follow Instagram
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                @seniindah.co.id
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Dapatkan inspirasi desain interior terbaru, tips renovasi, showcase proyek terbaik kami, 
              dan update promo menarik langsung di Instagram!
            </p>        
            <a 
              href="https://instagram.com/seniindah.co.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              📱 Follow @seniindah.co.id
            </a>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-gradient-to-r from-secondary-400 via-secondary to-secondary-300 relative overflow-hidden">
        {}
        <div className="absolute inset-0 opacity-12">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-100 rounded-full animate-pulse"></div>
          <div className="absolute top-60 right-32 w-20 h-20 bg-gray-200 rounded-full"></div>
          <div className="absolute bottom-40 left-1/3 w-28 h-28 bg-primary-100 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-primary-100 rounded-full"></div>
          <div className="absolute top-80 right-60 w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {}
        <div className="absolute inset-0 opacity-6">
          <div className="grid grid-cols-12 h-full">
            {Array.from({length: 12}).map((_, i) => (
              <div key={i} className="border-r border-black/20"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-8">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="border-b border-black/20"></div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-8 text-black">
            Siap Memulai
            <span className="block text-primary">Proyek Anda?</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-black mb-12 max-w-3xl mx-auto leading-relaxed">
            Dari konsep hingga realisasi, kami siap menjadi partner terpercaya 
            untuk mewujudkan rumah impian dengan kualitas terbaik.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <a 
              href="/kontak" 
              className="bg-primary hover:bg-primary-700 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Mulai Konsultasi Gratis
            </a>
            <a 
              href="/products" 
              className="bg-white border-2 border-black hover:bg-gray-100 text-black px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold transition-all duration-300"
            >
              Jelajahi Produk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TentangKami;