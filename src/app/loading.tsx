'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        {}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <span className="text-white font-bold text-3xl">SI</span>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold">
              <span className="text-green-600">Seni</span>
              <span className="text-gray-800">Indah</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">Gypsum & Interior</p>
          </div>
        </div>

        {}
        <div className="mb-6">
          <div className="relative">
            {}
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>

            {}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
            <p className="text-gray-700 font-medium">Memuat halaman...</p>
          </div>

          {}
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {}
        <p className="text-gray-500 text-sm mt-6 max-w-md mx-auto">
          Spesialis Gypsum, Plafon & Rangka Bajaringan serta Interior
        </p>

        {}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}