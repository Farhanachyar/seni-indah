'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Settings, Cog, ShieldCheck, Package } from 'lucide-react';

interface ProductDescriptionProps {
  product: {
    detailed_description?: string;
    specifications?: any;
    installation_guide?: string;
    warranty_info?: string;
    benefits?: string;
  };
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState('description');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const specifications = product.specifications ? 
    (typeof product.specifications === 'string' ? 
      JSON.parse(product.specifications) : 
      product.specifications) 
    : null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const tabs = [
    {
      id: 'description',
      label: 'Description',
      icon: FileText,
      content: product.detailed_description,
      show: !!product.detailed_description
    },
    {
      id: 'specifications',
      label: 'Specifications',
      icon: Settings,
      content: specifications,
      show: !!specifications
    },
    {
      id: 'installation',
      label: 'Installation',
      icon: Cog,
      content: product.installation_guide,
      show: !!product.installation_guide
    },
    {
      id: 'warranty',
      label: 'Warranty',
      icon: ShieldCheck,
      content: product.warranty_info,
      show: !!product.warranty_info
    }
  ].filter(tab => tab.show);

  if (tabs.length === 0) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No additional product information available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto px-6 lg:px-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {}
      <div className="p-6 lg:p-8">
        {}
        {activeTab === 'description' && product.detailed_description && (
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <div 
                className="tinymce-content"
                dangerouslySetInnerHTML={{ __html: product.detailed_description }}
                style={{

                  lineHeight: '1.7',
                  color: '#374151'
                }}
              />
            </div>

            {}
            {product.benefits && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Product Benefits
                </h3>
                <div 
                  className="prose prose-blue text-blue-800"
                  dangerouslySetInnerHTML={{ __html: product.benefits }}
                />
              </div>
            )}
          </div>
        )}

        {}
        {activeTab === 'specifications' && specifications && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Product Specifications
            </h2>

            {typeof specifications === 'object' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(specifications).map(([category, specs]: [string, any], index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <button
                      onClick={() => toggleSection(category)}
                      className="w-full flex items-center justify-between mb-3"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {category.replace('_', ' ')}
                      </h3>
                      {expandedSections[category] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <div className={`space-y-2 ${
                      expandedSections[category] ? 'block' : 'hidden'
                    }`}>
                      {typeof specs === 'object' ? (
                        Object.entries(specs).map(([key, value]: [string, any], specIndex) => (
                          <div key={specIndex} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace('_', ' ')}:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {value}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-700">{specs}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6">
                <div 
                  className="prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: specifications }}
                />
              </div>
            )}
          </div>
        )}

        {}
        {activeTab === 'installation' && product.installation_guide && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Cog className="w-5 h-5 mr-2" />
              Installation Guide
            </h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-yellow-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Please read all instructions carefully before installation. 
                    If you're not comfortable with installation, consider hiring a professional.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div 
                className="tinymce-content"
                dangerouslySetInnerHTML={{ __html: product.installation_guide }}
              />
            </div>
          </div>
        )}

        {}
        {activeTab === 'warranty' && product.warranty_info && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2" />
              Warranty Information
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    This product is backed by our comprehensive warranty program. 
                    Please keep your receipt for warranty claims.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div 
                className="tinymce-content"
                dangerouslySetInnerHTML={{ __html: product.warranty_info }}
              />
            </div>

            {}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Support?</h3>
              <p className="text-sm text-gray-600 mb-4">
                For warranty claims or support, please contact our customer service team.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>

      {}
      <style jsx global>{`
        .tinymce-content h1, .tinymce-content h2, .tinymce-content h3, 
        .tinymce-content h4, .tinymce-content h5, .tinymce-content h6 {
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .tinymce-content h1 { font-size: 1.875rem; }
        .tinymce-content h2 { font-size: 1.5rem; }
        .tinymce-content h3 { font-size: 1.25rem; }
        .tinymce-content h4 { font-size: 1.125rem; }

        .tinymce-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .tinymce-content ul, .tinymce-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .tinymce-content li {
          margin-bottom: 0.5rem;
        }

        .tinymce-content strong {
          font-weight: 600;
          color: #1f2937;
        }

        .tinymce-content em {
          font-style: italic;
        }

        .tinymce-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .tinymce-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .tinymce-content th, .tinymce-content td {
          border: 1px solid #e5e7eb;
          padding: 0.5rem 1rem;
          text-align: left;
        }

        .tinymce-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .tinymce-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .tinymce-content a {
          color: #2563eb;
          text-decoration: underline;
        }

        .tinymce-content a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}