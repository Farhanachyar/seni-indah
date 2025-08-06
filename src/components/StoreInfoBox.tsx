'use client';

import { Instagram } from 'lucide-react';

interface StoreInfoBoxProps {
  className?: string;
}

export default function StoreInfoBox({ className = '' }: StoreInfoBoxProps) {
  const handleInstagramClick = () => {

    window.open('https://instagram.com/seniindah.co.id', '_blank');
  };

  return (
    <div 
      className={`bg-gradient-to-r from-green-50 to-white rounded-xl shadow-md border-l-4 p-8 ${className}`}
      style={{
        '--color-primary': '#15803d',
        '--color-secondary': '#F7931E',
        '--color-text': '#000000',
        borderLeftColor: 'var(--color-primary)'
      } as React.CSSProperties}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {}
        <div className="text-center lg:text-left flex-1">
          {}
          <h1 
            className="text-xl md:text-2xl font-bold mb-3"
            style={{ color: 'var(--color-text)' }}
          >
            Toko Gypsum Dan PVC Terlengkap
          </h1>

          {}
          <p 
            className="text-sm md:text-base font-normal leading-relaxed"
            style={{ color: 'var(--color-text)', opacity: 0.75 }}
          >
            Pemasangan Plafon Gypsum, Bajaringan, Rangka Atap, Kanopi, Desain Interior DLL
          </p>
        </div>

        {}
        <div className="flex justify-center lg:justify-end">
          <button
            onClick={handleInstagramClick}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg text-white font-bold text-base border-2 border-transparent transition-all duration-300 hover:border-white hover:shadow-xl transform hover:-translate-y-1"
            style={{ 
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 4px 15px rgba(21, 128, 61, 0.3)'
            }}
          >
            <Instagram className="w-6 h-6" />
            <span>Follow Instagram @seniindah.co.id</span>
          </button>
        </div>
      </div>
    </div>
  );
}