import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Seni Indah Gypsum - Plafon Gypsum & Interior Design Bukittinggi",
  description = "Layanan profesional plafon gypsum, rangka bajaringan, dan desain interior berkualitas tinggi di Bukittinggi, Sumatera Barat. Konsultasi gratis, garansi resmi, dan harga transparan.",
  keywords = "plafon gypsum, interior design, rangka bajaringan, bukittinggi, sumatera barat, gypsum ceiling, drop ceiling, desain interior minimalis, desain interior klasik",
  ogImage = "/og-image.png",
  ogUrl = "https://seni-indah-gypsum.pages.dev",
  canonical
}) => {
  const fullTitle = title.includes("Seni Indah Gypsum") ? title : `${title} | Seni Indah Gypsum`;

  return (
    <Head>
      {}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Seni Indah Gypsum" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="content-language" content="id" />

      {}
      {canonical && <link rel="canonical" href={canonical} />}

      {}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

      {}
      <link rel="manifest" href="/site.webmanifest" />

      {}
      <meta name="msapplication-TileColor" content="#16a34a" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {}
      <meta name="theme-color" content="#16a34a" />
      <meta name="msapplication-navbutton-color" content="#16a34a" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="Seni Indah Gypsum" />
      <meta property="og:locale" content="id_ID" />

      {}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {}
      <meta name="geo.region" content="ID-SB" />
      <meta name="geo.placename" content="Bukittinggi" />
      <meta name="geo.position" content="-0.3049;100.3691" />
      <meta name="ICBM" content="-0.3049, 100.3691" />

      {}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Seni Indah Gypsum",
            "description": description,
            "url": ogUrl,
            "telephone": "+62-812-3456-7890",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bukittinggi",
              "addressRegion": "Sumatera Barat",
              "addressCountry": "ID"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -0.3049,
              "longitude": 100.3691
            },
            "openingHours": "Mo-Sa 08:00-17:00",
            "priceRange": "$$",
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": -0.3049,
                "longitude": 100.3691
              },
              "geoRadius": "50000"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Layanan Gypsum dan Interior",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Plafon Gypsum",
                    "description": "Pemasangan plafon gypsum berbagai model"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Rangka Bajaringan",
                    "description": "Pemasangan rangka bajaringan untuk plafon"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service", 
                    "name": "Desain Interior",
                    "description": "Layanan desain interior profesional"
                  }
                }
              ]
            }
          })
        }}
      />
    </Head>
  );
};

export default SEOHead;