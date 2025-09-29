import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail } from 'lucide-react';
import { faqAPI, FAQ as FAQType } from '../services/api';

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await faqAPI.getAllFAQs();
        setFaqs(res.data.faqs || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(faqs.map(item => item.category)))];

  const filteredFAQ = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(item => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FAQ</h1>
        <p className="text-gray-600">Trouvez rapidement les réponses à vos questions</p>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category as string}
            onClick={() => setSelectedCategory(category)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Toutes' : category as string}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Chargement des FAQs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">{error}</div>
      ) : (
        <div className="space-y-3">
          {filteredFAQ.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleItem(item._id as string)}
                className="w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 pr-4">{item.question}</h3>
                  {openItem === (item._id as string) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {openItem === (item._id as string) && (
                <div className="px-4 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Besoin d'aide supplémentaire ?</h3>
        <p className="text-orange-100 text-sm mb-4">
          Notre équipe support est là pour vous aider
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat en direct
          </button>
          <button className="flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors">
            <Mail className="h-4 w-4 mr-2" />
            support@myvoice974.com
          </button>
        </div>
      </div>

      {!loading && !error && filteredFAQ.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question trouvée</h3>
          <p className="text-gray-600">
            Essayez de sélectionner une autre catégorie
          </p>
        </div>
      )}
    </div>
  );
}