import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { faqAPI, FAQ as FAQType } from '../../services/api';

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQType | null>(null);
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: 'Gains'
  });
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; faq: FAQType | null }>({ open: false, faq: null });

  const openAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const categories = ['All', 'Gains', 'Payments', 'Participation', 'Security'];
  
  const filteredFAQs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  // Load FAQs from backend
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await faqAPI.getAllFAQs();
        setFaqs(res.data.faqs);
      } catch (e: any) {
        setError(e?.message || 'Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showAddModal || showViewModal || showEditModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal, showViewModal, showEditModal]);

  const handleAddFAQ = async () => {
    try {
      await faqAPI.createFAQ(newFAQ);
      openAlert('FAQ created successfully!', 'success');
      setShowAddModal(false);
      setNewFAQ({ question: '', answer: '', category: 'Gains' });
      const res = await faqAPI.getAllFAQs();
      setFaqs(res.data.faqs);
    } catch (e: any) {
      const msg = e?.message || 'Failed to create FAQ';
      setError(msg);
      openAlert(msg, 'error');
    }
  };

  const handleViewFAQ = (faq: FAQType) => {
    setSelectedFAQ(faq);
    setShowViewModal(true);
  };

  const handleEditFAQ = (faq: FAQType) => {
    setSelectedFAQ(faq);
    setNewFAQ({ question: faq.question, answer: faq.answer, category: faq.category });
    setShowEditModal(true);
  };

  const handleDeleteFAQ = (faq: FAQType) => {
    if (!faq?._id) return;
    setConfirmDelete({ open: true, faq });
  };

  const confirmDeleteFAQ = async () => {
    if (!confirmDelete.faq?._id) return;
    try {
      await faqAPI.deleteFAQ(confirmDelete.faq._id);
      openAlert('FAQ deleted successfully!', 'success');
      const res = await faqAPI.getAllFAQs();
      setFaqs(res.data.faqs);
    } catch (e: any) {
      const msg = e?.message || 'Failed to delete FAQ';
      setError(msg);
      openAlert(msg, 'error');
    } finally {
      setConfirmDelete({ open: false, faq: null });
    }
  };

  const handleUpdateFAQ = async () => {
    if (!selectedFAQ?._id) return;
    try {
      await faqAPI.updateFAQ(selectedFAQ._id, newFAQ);
      openAlert('FAQ updated successfully!', 'success');
      setShowEditModal(false);
      setSelectedFAQ(null);
      setNewFAQ({ question: '', answer: '', category: 'Gains' });
      const res = await faqAPI.getAllFAQs();
      setFaqs(res.data.faqs);
    } catch (e: any) {
      const msg = e?.message || 'Failed to update FAQ';
      setError(msg);
      openAlert(msg, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          FAQ Management
        </h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading FAQs...</p>
        </div>
      ) : (
        <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <div key={faq._id} className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${expandedFAQ === faq._id ? 'ring-2 ring-orange-200' : ''}`}>
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedFAQ(expandedFAQ === faq._id ? null : faq._id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    faq.category === 'Gains' ? 'bg-orange-100 text-orange-700' :
                    faq.category === 'Payments' ? 'bg-blue-100 text-blue-700' :
                    faq.category === 'Participation' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {faq.category}
                  </span>
                  {expandedFAQ === faq._id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            
            {expandedFAQ === faq._id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  <div className="flex items-center space-x-2 mt-4">
                    <button 
                      onClick={() => handleViewFAQ(faq)}
                      className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-1 rounded transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditFAQ(faq)}
                      className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-1 rounded transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteFAQ(faq)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New FAQ</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <input
                    type="text"
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter FAQ question..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <textarea
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Enter FAQ answer..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newFAQ.category}
                    onChange={(e) => setNewFAQ({...newFAQ, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="Gains">Gains</option>
                    <option value="Payments">Payments</option>
                    <option value="Participation">Participation</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFAQ}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View FAQ Modal */}
      {showViewModal && selectedFAQ && (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 w-screen h-screen !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">View FAQ</h3>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {selectedFAQ.question}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                    {selectedFAQ.category === 'Gains' ? 
                      "You can earn money by participating in market research, answering surveys, and sharing your opinions on various topics. Each participation is compensated based on its duration and complexity." :
                      selectedFAQ.category === 'Payments' ?
                      "Payments are processed weekly via bank transfer or PayPal. You'll receive your earnings within 3-5 business days after completing a survey." :
                      selectedFAQ.category === 'Participation' ?
                      "You can participate in surveys by clicking on available studies in your dashboard. Complete them honestly and within the given timeframe." :
                      "Your data is encrypted and stored securely. We never share your personal information with third parties without your consent."
                    }
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      selectedFAQ.category === 'Gains' ? 'bg-orange-100 text-orange-700' :
                      selectedFAQ.category === 'Payments' ? 'bg-blue-100 text-blue-700' :
                      selectedFAQ.category === 'Participation' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {selectedFAQ.category}
                  </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {showEditModal && selectedFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit FAQ</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <input
                    type="text"
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter FAQ question..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <textarea
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Enter FAQ answer..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newFAQ.category}
                    onChange={(e) => setNewFAQ({...newFAQ, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="Gains">Gains</option>
                    <option value="Payments">Payments</option>
                    <option value="Participation">Participation</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFAQ}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Update FAQ
                </button>
              </div>
            </div>
          </div>
      </div>
      )}

      {/* Confirm Delete Popup */}
      {confirmDelete.open && confirmDelete.faq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-red-200">
              <h4 className="text-lg font-bold text-red-600">Confirm Delete</h4>
            </div>
            <div className="px-6 py-4 text-gray-700">
              Are you sure you want to delete "{confirmDelete.faq.question}"?
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete({ open: false, faq: null })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFAQ}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Popup */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className={`px-6 py-4 border-b ${alertType === 'error' ? 'border-red-200' : 'border-green-200'}`}>
              <h4 className={`text-lg font-bold ${alertType === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {alertType === 'error' ? 'Attention' : 'Success'}
              </h4>
            </div>
            <div className="px-6 py-4 text-gray-700">{alertMessage}</div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
