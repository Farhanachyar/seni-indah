'use client';

import { useState } from 'react';
import { 
  Star, 
  MessageCircle, 
  Shield, 
  Award,
  Tag,
  Package,
  Copy,
  Check,
  Share2,
  X,
  Link
} from 'lucide-react';

interface ProductInfoProps {
  product: {
    id: number;
    title: string;
    description?: string;
    price_regular: number;
    price_discount?: number;
    has_discount: boolean;
    brand?: string;
    sku?: string;
    stock_status: string;
    is_featured: boolean;
    warranty_info?: string;
    category: {
      name?: string;
      slug?: string;
    };
    benefits?: string;
  };
  whatsappNumber?: string; // This will now be passed from parent component
}

export default function ProductInfo({ product, whatsappNumber = '6281234567890' }: ProductInfoProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'order'>('description');
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Calculate price display
  const displayPrice = product.has_discount && product.price_discount 
    ? product.price_discount 
    : product.price_regular;
    
  const oldPrice = product.has_discount && product.price_discount 
    ? product.price_regular 
    : null;
    
  const discountPercent = product.has_discount && oldPrice 
    ? Math.round(((oldPrice - displayPrice) / oldPrice) * 100)
    : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle copy title
  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(product.title);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Handle share functionality
  const getCurrentUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  const getShareText = () => {
    const price = formatCurrency(displayPrice);
    return `Check out this product: ${product.title} - ${price}`;
  };

  // Handle WhatsApp contact
  const handleContactSeller = () => {
    const price = formatCurrency(displayPrice);
    const message = `Hi, saya tertarik dengan produk ini:\n\n*${product.title}*\n\nHarga: ${price}\n\nBisakah saya mendapatkan informasi lebih lanjut?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentUrl());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: 'bg-green-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
        </svg>
      ),
      action: () => {
        const price = formatCurrency(displayPrice);
        const message = `Check out this product: ${product.title} - ${price}`;
        const url = encodeURIComponent(getCurrentUrl());
        const text = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
      }
    },
    {
      name: 'LINE',
      color: 'bg-green-400',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.202 0-.375-.078-.484-.209l-2.018-2.445v1.47c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.27.173-.51.43-.595.063-.022.136-.032.202-.032.198 0 .367.077.477.207l2.038 2.47V8.108c0-.345.282-.63.631-.63.346 0 .628.285.628.63v4.771zm-2.466-4.46c0-.345-.282-.63-.631-.63-.345 0-.627.285-.627.63v4.771c0 .344.282.629.627.629.349 0 .631-.285.631-.629V8.419zm-2.675.631c0-.345-.282-.63-.631-.63h-.953v4.771c0 .344-.282.629-.627.629-.349 0-.631-.285-.631-.629V8.42H7.68c-.349 0-.631-.285-.631-.63 0-.345.282-.63.631-.63h1.756c.349 0 .631.285.631.63zm15.506.213c0 5.45-4.437 9.87-9.906 9.87-.772 0-1.52-.098-2.22-.28l-3.675 1.585c-.112.05-.234.075-.348.075-.14 0-.274-.034-.393-.1-.27-.149-.436-.427-.436-.723V18.97c-1.566-1.241-2.654-2.817-3.202-4.627C.425 13.225 0 12.015 0 10.717 0 4.812 4.437.395 9.906.395s9.906 4.417 9.906 9.852"/>
        </svg>
      ),
      action: () => {
        const url = encodeURIComponent(getCurrentUrl());
        const text = encodeURIComponent(getShareText());
        window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      color: 'bg-blue-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="m9.417 15.181-.397-.961c-.583-1.429-1.17-2.859-1.758-4.287-.048-.124-.119-.227-.225-.294a.396.396 0 0 0-.3-.06c-.114.024-.215.098-.275.203a.397.397 0 0 0-.06.3c.024.115.095.215.202.275.104.061.225.084.346.068.115-.015.223-.068.295-.158l.048.117c.583 1.429 1.17 2.858 1.758 4.287l.397.961c.048.117.119.227.225.294a.396.396 0 0 0 .3.06c.115-.024.215-.098.275-.203a.397.397 0 0 0 .061-.3c-.025-.114-.095-.214-.203-.275a.396.396 0 0 0-.346-.068.396.396 0 0 0-.294.158l-.048-.117ZM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm5.568 8.16-1.622 7.847c-.123.59-.444.735-.899.458l-2.494-1.838-1.204 1.16c-.133.133-.246.246-.505.246l.181-2.554 4.663-4.214c.203-.18-.044-.28-.315-.101L9.39 12.396l-2.449-.766c-.532-.166-.543-.532.111-.786l9.563-3.687c.444-.166.832.107.691.78Z"/>
        </svg>
      ),
      action: () => {
        const url = encodeURIComponent(getCurrentUrl());
        const text = encodeURIComponent(getShareText());
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      action: () => {
        const url = encodeURIComponent(getCurrentUrl());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      color: 'bg-blue-400',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      action: () => {
        const url = encodeURIComponent(getCurrentUrl());
        const text = encodeURIComponent(getShareText());
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }
    },
    {
      name: 'Email',
      color: 'bg-gray-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      action: () => {
        const subject = encodeURIComponent(`Check out: ${product.title}`);
        const body = encodeURIComponent(`${getShareText()}\n\n${getCurrentUrl()}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      }
    }
  ];

  // Stock status styling
  const getStockStatus = () => {
    switch (product.stock_status?.toLowerCase()) {
      case 'in_stock':
        return { text: 'In Stock', color: 'text-green-600 bg-green-50', icon: '✓' };
      case 'low_stock':
        return { text: 'Low Stock', color: 'text-orange-600 bg-orange-50', icon: '⚠' };
      case 'out_of_stock':
        return { text: 'Out of Stock', color: 'text-red-600 bg-red-50', icon: '✗' };
      default:
        return { text: 'Available', color: 'text-blue-600 bg-blue-50', icon: '✓' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Product Title with Copy Button */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight flex-1">
            {product.title}
          </h1>
          <button
            onClick={handleCopyTitle}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
            aria-label="Copy title"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Category Name */}
        {product.category?.name && (
          <div className="mt-2">
            <span className="text-gray-600 text-sm">
              <span className="font-medium text-gray-800">{product.category.name}</span>
            </span>
          </div>
        )}
        
        {/* Product Meta */}
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
          {product.brand && (
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-1" />
              {product.brand}
            </span>
          )}
          {product.sku && (
            <span>SKU: {product.sku}</span>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            {formatCurrency(displayPrice)}
          </span>
          
          {oldPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">
                {formatCurrency(oldPrice)}
              </span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
        
        {product.has_discount && oldPrice && (
          <p className="text-sm text-green-600 font-medium">
            Kamu Menghemat {formatCurrency(oldPrice - displayPrice)}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${stockStatus.color}`}>
        <span className="mr-2">{stockStatus.icon}</span>
        {stockStatus.text}
      </div>

      {/* Tab Buttons */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('description')}
          className={`pb-2 px-1 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'description'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Deskripsi
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`pb-2 px-1 text-sm font-medium transition-colors duration-200 border-b-2 ${
            activeTab === 'order'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Informasi Pemesanan
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'description' ? (
          <div>
            {/* Description */}
            {product.description && (
              <div className="prose prose-sm text-gray-600">
                <div 
                  dangerouslySetInnerHTML={{ __html: product.description }}
                  className="tinymce-content"
                />
              </div>
            )}

            {/* Benefits */}
            {product.benefits && (
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Key Benefits
                </h3>
                <div 
                  className="prose prose-sm text-blue-800 tinymce-content"
                  dangerouslySetInnerHTML={{ __html: product.benefits }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Order Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Cara Pemesanan</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p>Klik tombol "Contact Seller" untuk menghubungi penjual via WhatsApp</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p>Diskusikan detail produk, jumlah, dan harga dengan penjual</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p>Lakukan pembayaran sesuai kesepakatan dengan penjual</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p>Produk akan dikirim sesuai alamat yang telah disepakati</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">Metode Pembayaran</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Bank Transfer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>E-Wallet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Installment</span>
                </div>
              </div>
            </div>

            {/* Warranty Info */}
            {product.warranty_info && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Garansi Produk
                </h4>
                <p className="text-sm text-purple-800">{product.warranty_info}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button 
          onClick={handleContactSeller}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Hubungi Admin</span>
        </button>
        
        <button 
          onClick={() => setIsShareModalOpen(true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          aria-label="Share product"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Share Product</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Share Options */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {shareOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      option.action();
                      setIsShareModalOpen(false);
                    }}
                    className="flex flex-col items-center space-y-2 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center transition-transform hover:scale-105`}>
                      {option.icon}
                    </div>
                    <span className="text-xs text-gray-700 font-medium">{option.name}</span>
                  </button>
                ))}
              </div>

              {/* Copy Link Option */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    {linkCopied ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Link className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {linkCopied ? 'Link Copied!' : 'Copy Link'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}