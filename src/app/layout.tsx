import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../components/AuthProvider';

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

export const metadata: Metadata = {
  title: {
    default: `${projectName}`,
    template: '%s | Seni Indah Gypsum & Interior'
  },
  description: 'Spesialis Gypsum, Plafon & Rangka Bajaringan serta Interior. Melayani area Payakumbuh - Lima Puluh Kota. Free Konsultasi.',
  keywords: [
    'gypsum',
    'plafon',
    'bajaringan',
    'interior',
    'payakumbuh',
    'lima puluh kota',
    'renovasi',
    'konstruksi'
  ],
  authors: [{ name: 'Seni Indah Gypsum' }],
  creator: 'Seni Indah Gypsum',
  publisher: 'Seni Indah Gypsum',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://seni-indah-gypsum.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    title: 'Seni Indah Gypsum & Interior',
    description: 'Spesialis Gypsum, Plafon & Rangka Bajaringan serta Interior. Melayani area Payakumbuh - Lima Puluh Kota.',
    siteName: 'Seni Indah Gypsum',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Seni Indah Gypsum & Interior',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seni Indah Gypsum & Interior',
    description: 'Spesialis Gypsum, Plafon & Rangka Bajaringan serta Interior.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {}
        <meta name="theme-color" content="#059669" />
        <meta name="msapplication-TileColor" content="#059669" />

        {}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {}
        <link rel="dns-prefetch" href="//wa.me" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          {}
          <div id="site-header" className="site-header-wrapper">
            <Header />
          </div>

          <main 
            id="main-content"
            className="flex-grow" 
            style={{ paddingTop: '100px' }} 
          >
            {children}
          </main>

          {}
          <div id="site-footer" className="site-footer-wrapper">
            <Footer />
          </div>
        </AuthProvider>

        {}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Seni Indah Gypsum & Interior",
              "description": "Spesialis Gypsum, Plafon & Rangka Bajaringan serta Interior",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://seniindah.co.id",
              "telephone": "+6281234567890",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Payakumbuh",
                "addressRegion": "Lima Puluh Kota",
                "addressCountry": "Indonesia"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-0.2313",
                "longitude": "100.6333"
              },
              "openingHours": "Mo-Sa 08:00-17:00",
              "serviceArea": {
                "@type": "Place",
                "name": "Payakumbuh - Lima Puluh Kota"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Layanan Gypsum & Interior",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Pemasangan Plafon Gypsum"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Pemasangan Rangka Bajaringan"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Desain Interior"
                    }
                  }
                ]
              }
            })
          }}
        />
      </body>
    </html>
  );
}