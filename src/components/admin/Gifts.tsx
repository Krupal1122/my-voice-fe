import React, { useState, useEffect, useRef } from 'react';
import { Plus, Eye, Edit, Trash2, X, Star, ShoppingCart, Gift, AlertCircle, CheckCircle, Clock, Filter, Search, Upload, Image as ImageIcon } from 'lucide-react';
import { BASE_URL } from '../../services/api';

interface Gift {
  _id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  image: string;
  availability: 'available' | 'limited' | 'out-of-stock';
  originalPrice?: number;
  discount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export function Gifts() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newGift, setNewGift] = useState({
    title: '',
    description: '',
    points: 0,
    category: 'E-commerce',
    image: '',
    availability: 'available' as 'available' | 'limited' | 'out-of-stock',
    originalPrice: 0,
    discount: 0
  });

  const categories = ['E-commerce', 'Culture', 'Streaming', 'Restauration', 'Beauté', 'Livres', 'Voyage', 'Sport'];
  const availabilityOptions = [
    { value: 'available', label: 'Available', color: 'green' },
    { value: 'limited', label: 'Limited', color: 'yellow' },
    { value: 'out-of-stock', label: 'Out of Stock', color: 'red' }
  ];

  // Load gifts from backend
  useEffect(() => {
    loadGifts();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewGift(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
    setNewGift(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetImageStates = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadGifts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${BASE_URL}/api/gifts`);
      if (!response.ok) {
        throw new Error('Failed to fetch gifts');
      }
      
      const data = await response.json();
      if (data.success) {
        setGifts(data.gifts);
      } else {
        throw new Error(data.message || 'Failed to load gifts');
      }
    } catch (err: any) {
      console.error('Error loading gifts:', err);
      setError(err.message || 'Failed to load gifts');
      
      // Fallback to mock data if API fails
      const mockGifts: Gift[] = [
        {
          _id: '1',
          title: 'Amazon voucher 20€',
          description: 'Usable on all Amazon products',
          points: 2000,
          category: 'E-commerce',
          image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
          availability: 'available',
          originalPrice: 20,
          discount: 0,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          _id: '2',
          title: 'Carte cadeau Fnac 15€',
          description: 'Valable en magasin et sur fnac.com',
          points: 1500,
          category: 'Culture',
          image: 'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400',
          availability: 'limited',
          originalPrice: 15,
          discount: 10,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-20')
        },
        {
          _id: '3',
          title: 'Abonnement Spotify 1 mois',
          description: 'Profitez de la musique en illimité',
          points: 1000,
          category: 'Streaming',
          image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
          availability: 'available',
          originalPrice: 10,
          discount: 0,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05')
        }
      ];
      
      setGifts(mockGifts);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search gifts
  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gift.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || gift.category === filterCategory;
    const matchesAvailability = filterAvailability === 'all' || gift.availability === filterAvailability;
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleCreateGift = async () => {
    if (!newGift.title.trim()) {
      alert('Please enter a gift title');
      return;
    }
    if (!newGift.description.trim()) {
      alert('Please enter a gift description');
      return;
    }
    if (newGift.points <= 0) {
      alert('Please enter a valid points value');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/gifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGift),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create gift');
      }

      const data = await response.json();
      if (data.success) {
        // Add new gift to the list
        setGifts(prev => [data.gift, ...prev]);
        
        console.log('Creating gift:', data.gift);
        alert('Gift created successfully!');
        
        setShowCreateModal(false);
        setNewGift({
          title: '',
          description: '',
          points: 0,
          category: 'E-commerce',
          image: '',
          availability: 'available',
          originalPrice: 0,
          discount: 0
        });
        // Reset image upload states
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(data.message || 'Failed to create gift');
      }
    } catch (err: any) {
      console.error('Error creating gift:', err);
      alert(`Error creating gift: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGift = async () => {
    if (!selectedGift) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/gifts/${selectedGift._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGift),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update gift');
      }

      const data = await response.json();
      if (data.success) {
        // Update gift in the list
        setGifts(prev => prev.map(gift => 
          gift._id === selectedGift._id ? data.gift : gift
        ));
        
        console.log('Updating gift:', selectedGift._id);
        alert('Gift updated successfully!');
        
        setShowEditModal(false);
        setSelectedGift(null);
      } else {
        throw new Error(data.message || 'Failed to update gift');
      }
    } catch (err: any) {
      console.error('Error updating gift:', err);
      alert(`Error updating gift: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGift = async (gift: Gift) => {
    if (!window.confirm(`Are you sure you want to delete "${gift.title}"?`)) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/gifts/${gift._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete gift');
      }

      const data = await response.json();
      if (data.success) {
        // Remove gift from the list
        setGifts(prev => prev.filter(g => g._id !== gift._id));
        
        console.log('Deleting gift:', gift._id);
        alert('Gift deleted successfully!');
      } else {
        throw new Error(data.message || 'Failed to delete gift');
      }
    } catch (err: any) {
      console.error('Error deleting gift:', err);
      alert(`Error deleting gift: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGift = (gift: Gift) => {
    setSelectedGift(gift);
    setShowViewModal(true);
  };

  const handleEditClick = (gift: Gift) => {
    setSelectedGift(gift);
    setNewGift({
      title: gift.title,
      description: gift.description,
      points: gift.points,
      category: gift.category,
      image: gift.image,
      availability: gift.availability,
      originalPrice: gift.originalPrice || 0,
      discount: gift.discount || 0
    });
    // Reset image upload states
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowEditModal(true);
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'limited': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'out-of-stock': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Gift className="h-6 w-6 text-orange-500" />
            Gift Management ({filteredGifts.length})
          </h2>
          <p className="text-gray-600 mt-1">Manage rewards and vouchers for users</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Gift
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search gifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          {availabilityOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading gifts...</span>
        </div>
      )}

     

      {/* Gifts Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map((gift) => (
            <div key={gift._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Gift Image */}
              <div className="relative">
                <img
                  src={gift.image}
                  alt={gift.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(gift.availability)}`}>
                    {gift.availability === 'available' ? 'Available' : 
                     gift.availability === 'limited' ? 'Limited' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Gift Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{gift.title}</h3>
                  <div className="flex items-center gap-1">
                    {getAvailabilityIcon(gift.availability)}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{gift.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold text-orange-600">{gift.points.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">(≈ {gift.originalPrice}€)</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {gift.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  
                  <button
                    onClick={() => handleEditClick(gift)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGift(gift)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredGifts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No gifts found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory !== 'all' || filterAvailability !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first gift'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mx-auto"
          >
            <Plus className="h-4 w-4" />
            Add Gift
          </button>
        </div>
      )}

      {/* Create Gift Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold">Create New Gift</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetImageStates();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content - Scrollable with hidden scrollbar */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newGift.title}
                    onChange={(e) => setNewGift(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Amazon voucher 20€"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newGift.description}
                    onChange={(e) => setNewGift(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the gift..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points Required</label>
                    <input
                      type="number"
                      value={newGift.points}
                      onChange={(e) => setNewGift(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (€)</label>
                    <input
                      type="number"
                      value={newGift.originalPrice}
                      onChange={(e) => setNewGift(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newGift.category}
                      onChange={(e) => setNewGift(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                    <select
                      value={newGift.availability}
                      onChange={(e) => setNewGift(prev => ({ ...prev, availability: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {availabilityOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                           reader.onload = (event) => {
                             setNewGift(prev => ({
                               ...prev,
                               image: event.target?.result as string
                             }));
                           };
                           reader.readAsDataURL(file);
                         }
                       }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="image-upload-edit"
                    />
                    <label 
                      htmlFor="image-upload-edit"
                      className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors group"
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <div className="p-3 bg-gray-100 rounded-full group-hover:bg-orange-100 transition-colors">
                            <svg
                              className="h-6 w-6 text-gray-400 group-hover:text-orange-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                              />
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 group-hover:text-orange-600">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                   {/* {newStudy.image && (
                     <div className="mt-3 flex items-center space-x-3">
                       <img 
                         src={newStudy.image} 
                         alt="Study preview" 
                         className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                       />
                       <button
                         type="button"
                         onClick={() => setNewStudy({...newStudy, image: ''})}
                         className="text-red-600 hover:text-red-800 text-sm font-medium"
                       >
                         Remove Image
                       </button>
                     </div>
                   )} */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    value={newGift.discount}
                    onChange={(e) => setNewGift(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handleCreateGift}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create Gift
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetImageStates();
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gift Modal */}
      {showEditModal && selectedGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Gift</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newGift.title}
                  onChange={(e) => setNewGift(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGift.description}
                  onChange={(e) => setNewGift(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points Required</label>
                  <input
                    type="number"
                    value={newGift.points}
                    onChange={(e) => setNewGift(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (€)</label>
                  <input
                    type="number"
                    value={newGift.originalPrice}
                    onChange={(e) => setNewGift(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newGift.category}
                    onChange={(e) => setNewGift(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <select
                    value={newGift.availability}
                    onChange={(e) => setNewGift(prev => ({ ...prev, availability: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {availabilityOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                
                {/* Image Upload Section */}
                <div className="space-y-3">
                  {/* File Upload Button */}
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </button>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      {imageFile && (
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      )}
                    </div>
                  )}

                  {/* URL Input (Alternative) */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Or enter image URL:</label>
                    <input
                      type="url"
                      value={newGift.image}
                      onChange={(e) => setNewGift(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={newGift.discount}
                  onChange={(e) => setNewGift(prev => ({ ...prev, discount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditGift}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Update Gift
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Gift Modal */}
      {showViewModal && selectedGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Gift Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedGift.image}
                  alt={selectedGift.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(selectedGift.availability)}`}>
                    {selectedGift.availability === 'available' ? 'Available' : 
                     selectedGift.availability === 'limited' ? 'Limited' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedGift.title}</h4>
                <p className="text-gray-600 mb-4">{selectedGift.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold text-gray-700">Points Required</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{selectedGift.points.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingCart className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-gray-700">Original Price</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{selectedGift.originalPrice}€</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Category</span>
                  <p className="text-gray-900">{selectedGift.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Discount</span>
                  <p className="text-gray-900">{selectedGift.discount}%</p>
                </div>
              </div>

              {selectedGift.createdAt && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Created</span>
                  <p className="text-gray-900">{selectedGift.createdAt.toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedGift);
                }}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Edit Gift
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
