import React from 'react';
import { Eye } from 'lucide-react';

const UserFeatures: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-3">
          <Eye className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Lihat Produk</h3>
        </div>
        <p className="text-gray-600 mb-4">Lihat daftar produk yang tersedia</p>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Lihat Produk
        </button>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-3">
          <Eye className="w-6 h-6 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Profil Saya</h3>
        </div>
        <p className="text-gray-600 mb-4">Lihat informasi akun Anda</p>
        <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Lihat Profil
        </button>
      </div>
    </div>
  );
};

export default UserFeatures;