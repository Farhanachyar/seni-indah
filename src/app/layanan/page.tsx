'use client';

import React, { useEffect } from 'react';
import { Home, Wrench, Palette, Ruler, Clock, Shield, CheckCircle, Star, ArrowRight, MessageCircle, Calculator } from 'lucide-react';

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

const Layanan = () => {
  const [activeService, setActiveService] = React.useState(0);

  useEffect(() => {
      document.title = `Pengaturan | ${projectName}`;
    }, []);

  const mainServices = [
    {
      id: 1,
      icon: Home,
      title: "Pemasangan Plafon Gypsum",
      description: "Layanan pemasangan plafon gypsum berkualitas tinggi dengan berbagai model dan desain sesuai kebutuhan ruangan Anda.",
      features: [
        "Plafon Gypsum Standar",
        "Plafon Gypsum Drop Ceiling",
        "Plafon Gypsum Model Kotak",
        "Plafon Gypsum Lengkung",
        "Finishing Cat & Listplank"
      ],
      benefits: [
        "Tahan lama dan anti rayap",
        "Permukaan halus dan rata",
        "Mudah dibentuk sesuai desain",
        "Kedap suara",
        "Tahan api"
      ],
      price: "Mulai dari Rp 45.000/m²",
      image: "🏠"
    },
    {
      id: 2,
      icon: Wrench,
      title: "Rangka Bajaringan",
      description: "Pemasangan rangka bajaringan yang kuat dan tahan lama sebagai struktur pendukung plafon yang berkualitas.",
      features: [
        "Rangka Bajaringan Hollow",
        "Rangka Bajaringan Metal Furring",
        "Sistem Gantungan Profesional",
        "Aksesoris Lengkap",
        "Garansi Pemasangan"
      ],
      benefits: [
        "Struktur sangat kuat",
        "Tahan karat dan korosi",
        "Tidak bengkok atau melengkung",
        "Presisi dan rapi",
        "Awet hingga puluhan tahun"
      ],
      price: "Mulai dari Rp 35.000/m²",
      image: "🔧"
    },
    {
      id: 3,
      icon: Palette,
      title: "Desain Interior",
      description: "Konsultasi dan implementasi desain interior yang modern, fungsional, dan sesuai dengan gaya hidup Anda.",
      features: [
        "Konsultasi Desain Gratis",
        "Gambar 3D Rendering",
        "Pemilihan Material",
        "Koordinasi Pengerjaan",
        "Supervisi Proyek"
      ],
      benefits: [
        "Desain sesuai budget",
        "Fungsional dan estetik",
        "Material berkualitas",
        "Hasil sesuai ekspektasi",
        "Garansi kepuasan"
      ],
      price: "Konsultasi Gratis",
      image: "🎨"
    }
  ];

  const additionalServices = [
    {
      icon: Ruler,
      title: "Survey & Pengukuran",
      description: "Layanan survey lokasi dan pengukuran yang akurat untuk estimasi material dan biaya yang tepat."
    },
    {
      icon: Calculator,
      title: "Estimasi Biaya",
      description: "Perhitungan biaya yang transparan dan detail sesuai dengan kebutuhan proyek Anda."
    },
    {
      icon: Clock,
      title: "Maintenance",
      description: "Layanan perawatan berkala untuk menjaga kualitas dan tampilan plafon tetap optimal."
    },
    {
      icon: Shield,
      title: "Garansi Resmi",
      description: "Garansi resmi untuk setiap pekerjaan yang kami lakukan dengan standar kualitas terbaik."
    }
  ];

  const workProcess = [
    {
      step: "01",
      title: "Konsultasi",
      description: "Diskusi kebutuhan dan budget dengan tim ahli kami"
    },
    {
      step: "02",
      title: "Survey Lokasi",
      description: "Pengukuran dan analisis kondisi lokasi secara detail"
    },
    {
      step: "03",
      title: "Desain & RAB",
      description: "Pembuatan desain dan rencana anggaran biaya"
    },
    {
      step: "04",
      title: "Eksekusi",
      description: "Pelaksanaan pekerjaan dengan standar kualitas tinggi"
    },
    {
      step: "05",
      title: "Finishing",
      description: "Penyelesaian akhir dan quality control"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-20 mt-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Layanan <span className="text-green-200">Profesional</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Solusi lengkap untuk kebutuhan gypsum, plafon, dan interior berkualitas tinggi
            </p>
            <div className="flex items-center justify-center gap-4 text-green-200">
              <CheckCircle size={20} />
              <span className="text-lg">Kualitas Terjamin • Harga Terjangkau • Garansi Resmi</span>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Layanan <span className="text-green-600">Unggulan</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Kami menyediakan layanan profesional dengan standar kualitas terbaik dan harga yang kompetitif
            </p>
          </div>

          {}
          <div className="flex flex-col lg:flex-row gap-8">
            {}
            <div className="lg:w-1/3">
              <div className="space-y-4">
                {mainServices.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveService(index)}
                      className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                        activeService === index
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`w-6 h-6 ${activeService === index ? 'text-white' : 'text-green-600'}`} />
                        <div>
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                          <p className={`text-sm mt-1 ${activeService === index ? 'text-green-100' : 'text-gray-600'}`}>
                            {service.description.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">{mainServices[activeService].image}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {mainServices[activeService].title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {mainServices[activeService].description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Jenis Layanan
                    </h4>
                    <ul className="space-y-2">
                      {mainServices[activeService].features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500" />
                      Keunggulan
                    </h4>
                    <ul className="space-y-2">
                      {mainServices[activeService].benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-semibold text-lg">
                        {mainServices[activeService].price}
                      </p>
                      <p className="text-green-600 text-sm">*Harga dapat berubah sesuai spesifikasi</p>
                    </div>
                    <button
                      onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Konsultasi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Layanan <span className="text-green-600">Pendukung</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Layanan tambahan untuk memastikan kepuasan dan kenyamanan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Proses <span className="text-green-600">Pengerjaan</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tahapan kerja yang terstruktur untuk hasil yang optimal dan memuaskan
            </p>
          </div>

          <div className="relative">
            <div className="flex flex-col md:flex-row items-center justify-between">
              {workProcess.map((process, index) => (
                <div key={index} className="flex flex-col items-center text-center max-w-xs relative">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 relative z-10">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{process.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{process.description}</p>

                  {index < workProcess.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-12 w-6 h-6 text-green-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Wujudkan Hunian Impian Anda Bersama Kami
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Dapatkan konsultasi gratis dan penawaran terbaik untuk proyek Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Konsultasi Gratis
            </button>
            <a 
              href="/kontak"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Layanan;