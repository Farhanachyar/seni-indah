'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Phone } from 'lucide-react';
import { apiService } from '../lib/apiService';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        setLoading(true);

        const [whatsapp, faqResponse] = await Promise.all([
          apiService.getData('get-whatsapp'),
          apiService.getData('get-faq')
        ]);

        setWhatsappNumber(whatsapp || '+6281234567890');

        if (faqResponse) {
          try {
            const parsedResponse = typeof faqResponse === 'string' 
              ? JSON.parse(faqResponse) 
              : faqResponse;

            if (parsedResponse && parsedResponse.faq && Array.isArray(parsedResponse.faq)) {
              const formattedFAQ = parsedResponse.faq.map((item: any) => ({
                question: item.question,
                answer: item.answer
              }));
              setFaqData(formattedFAQ);
            }
          } catch (parseError) {

          }
        }

      } catch (error) {

        setWhatsappNumber('+6281234567890');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  const toggleItem = (index: number) => {
    setOpenItem(prev => prev === index ? null : index);
  };

  const formatAnswer = (answer: string) => {
    return answer.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < answer.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {}
        <div className="w-full md:w-full lg:w-[960px] xl:w-[1200px] mx-auto">
          {}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Pertanyaan yang <span className="text-primary">Sering Diajukan</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar produk dan layanan kami
            </p>
          </div>

          {}
          {loading ? (

            <div className="space-y-0">
              {[...Array(6)].map((_, index) => (
                <div key={index} className={`${index > 0 ? 'border-t border-gray-200' : ''}`}>
                  <div className="w-full px-6 py-4 flex items-center justify-between">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-96 mb-2"></div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : faqData.length > 0 ? (
            <div className="space-y-0">
              {faqData.map((item, index) => (
                <div key={index}>
                  {}
                  <button
                    onClick={() => toggleItem(index)}
                    className={`w-full px-6 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300 focus:outline-none ${
                      index > 0 ? 'border-t border-gray-200' : ''
                    } ${
                      openItem === index 
                        ? 'bg-gray-50 pt-10 pb-5' 
                        : 'py-5'
                    }`}
                    aria-expanded={openItem === index}
                  >
                    <span className="font-bold text-gray-800 text-lg pr-4 leading-relaxed">
                      {item.question}
                    </span>
                    <div className="flex-shrink-0">
                      <div className={`transform transition-transform duration-300 ${
                        openItem === index ? 'rotate-180' : 'rotate-0'
                      }`}>
                        <ChevronDown className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </button>

                  {}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openItem === index
                        ? 'max-h-[500px] opacity-100 mb-4'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2 bg-white border-l border-r border-b border-gray-200">
                      <div 
                        className={`text-gray-600 leading-relaxed transform transition-all duration-300 delay-100 ${
                          openItem === index
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-2 opacity-0'
                        }`}
                      >
                        {formatAnswer(item.answer)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (

            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <span className="text-4xl">❓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada FAQ</h3>
              <p className="text-gray-600">FAQ sedang dalam proses penambahan</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;