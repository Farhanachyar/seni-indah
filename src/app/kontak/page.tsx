'use client';

import React, { useEffect } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, User, Send, CheckCircle, Star, Calendar } from 'lucide-react';

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

const Kontak = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  useEffect(() => {
    document.title = `Kontak Kami | ${projectName}`;
  }, []);

  const contactInfo = [
    {
      icon: Phone,
      title: "Telepon",
      info: "+62 812-3456-7890",
      description: "Hubungi kami langsung",
      action: () => window.open('tel:+6281234567890'),
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      info: "+62 812-3456-7890",
      description: "Chat langsung via WhatsApp",
      action: () => window.open('https://wa.me/6281234567890'),
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      info: "info@seniindahgypsum.com",
      description: "Kirim email untuk inquiry",
      action: () => window.open('mailto:info@seniindahgypsum.com'),
      color: "bg-red-100 text-red-600"
    },
    {
      icon: MapPin,
      title: "Alamat",
      info: "Payakumbuh, Lima Puluh Kota",
      description: "Sumatera Barat, Indonesia",
      action: () => window.open('https://maps.google.com/?q=Payakumbuh+Lima+Puluh+Kota'),
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const operatingHours = [
    { day: "Senin - Jumat", hours: "08:00 - 17:00 WIB" },
    { day: "Sabtu", hours: "08:00 - 15:00 WIB" },
    { day: "Minggu", hours: "Tutup / Emergency Call" }
  ];

  const serviceOptions = [
    "Pemasangan Plafon Gypsum",
    "Rangka Bajaringan",
    "Desain Interior",
    "Konsultasi Gratis",
    "Survey Lokasi",
    "Maintenance"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const message = `Halo Seni Indah Gypsum,

Saya tertarik dengan layanan Anda:

Nama: ${formData.name}
Telepon: ${formData.phone}
Email: ${formData.email}
Layanan: ${formData.service}

Pesan:
${formData.message}

Mohon informasi lebih lanjut. Terima kasih.`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesan Terkirim!</h2>
          <p className="text-gray-600 mb-6">
            Terima kasih atas minat Anda. Kami akan menghubungi Anda segera melalui WhatsApp.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Kirim Pesan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-20 mt-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hubungi <span className="text-green-200">Kami</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Siap membantu mewujudkan hunian impian Anda dengan layanan terbaik
            </p>
            <div className="flex items-center justify-center gap-4 text-green-200">
              <Clock size={20} />
              <span className="text-lg">Konsultasi Gratis • Respons Cepat • Pelayanan 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Informasi <span className="text-green-600">Kontak</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Berbagai cara untuk menghubungi kami. Pilih yang paling nyaman untuk Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={contact.action}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${contact.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{contact.title}</h3>
                  <p className="text-green-600 font-medium mb-1">{contact.info}</p>
                  <p className="text-gray-600 text-sm">{contact.description}</p>
                </div>
              );
            })}
          </div>

          {}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <MessageCircle size={20} />
              Chat WhatsApp Sekarang
            </button>
            <button 
              onClick={() => window.open('tel:+6281234567890')}
              className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Phone size={20} />
              Telepon Langsung
            </button>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Kirim Pesan
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Nomor Telepon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="08xx-xxxx-xxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="nama@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Layanan yang Diminati *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Pilih layanan</option>
                      {serviceOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Pesan / Deskripsi Proyek
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ceritakan kebutuhan atau proyek Anda..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Kirim Pesan via WhatsApp
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {}
            <div className="space-y-6">
              {}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-green-600" />
                  Jam Operasional
                </h4>
                <div className="space-y-3">
                  {operatingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700 font-medium">{schedule.day}</span>
                      <span className="text-green-600 font-semibold">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>Emergency Call:</strong> Untuk kebutuhan mendesak, hubungi kami kapan saja melalui WhatsApp.
                  </p>
                </div>
              </div>

              {}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-green-600" />
                  Area Layanan
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Payakumbuh</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Lima Puluh Kota</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Bukittinggi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Batusangkar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Sekitar Sumbar</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Area lain? Hubungi kami untuk konfirmasi jangkauan layanan.
                  </p>
                </div>
              </div>

              {}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-300" />
                  Mengapa Pilih Kami?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span className="text-green-100">Konsultasi gratis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span className="text-green-100">Survey lokasi gratis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span className="text-green-100">Garansi resmi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span className="text-green-100">Harga transparan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-200" />
                    <span className="text-green-100">Tim berpengalaman</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Pertanyaan <span className="text-green-600">Umum</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Jawaban untuk pertanyaan yang sering diajukan oleh klien kami
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Berapa lama pengerjaan plafon gypsum?</h4>
                <p className="text-gray-600 text-sm">
                  Tergantung luas area, umumnya 3-7 hari untuk rumah type 36-70. Kami akan memberikan estimasi waktu yang akurat setelah survey.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Apakah ada garansi untuk pekerjaan?</h4>
                <p className="text-gray-600 text-sm">
                  Ya, kami memberikan garansi 1 tahun untuk struktur dan 6 bulan untuk finishing cat. Garansi berlaku untuk kerusakan akibat cacat material atau workmanship.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Bagaimana sistem pembayaran?</h4>
                <p className="text-gray-600 text-sm">
                  Pembayaran bisa cash atau bertahap: DP 50% saat kontrak, 30% saat progress 70%, dan 20% setelah selesai. Tersedia juga cicilan 0% untuk proyek tertentu.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Apakah survey dan konsultasi benar-benar gratis?</h4>
                <p className="text-gray-600 text-sm">
                  100% gratis tanpa biaya tersembunyi. Kami akan datang ke lokasi, mengukur, memberikan konsultasi, dan membuat RAB detail tanpa dipungut biaya apapun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Hubungi kami sekarang untuk konsultasi gratis dan penawaran terbaik
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-full font-semibold transition-colors duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Chat WhatsApp Sekarang
            </button>
            <button 
              onClick={() => window.open('tel:+6281234567890')}
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Telepon Langsung
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-green-200">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="text-sm">Jadwal Fleksibel</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span className="text-sm">Konsultasi Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} />
              <span className="text-sm">Kepuasan Terjamin</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kontak;