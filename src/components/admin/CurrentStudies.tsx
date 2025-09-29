import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, ChevronUp, ChevronDown, X, Users, Clock, Target, Euro, Image } from 'lucide-react';
import { BASE_URL } from '../../services/api';

interface Study {
  _id: string;
  title: string;
  description: string;
  status: string;
  participants: number;
  targetParticipants?: number;
  maxParticipants?: number;
  reward: number;
  duration: number; // Duration in minutes
  category: string;
  createdAt: string;
  deadline?: string;
  endDate?: string;
  startDate?: string;
  image?: string;
  requirements?: string;
  instructions?: string;
  tags?: string[];
  isActive?: boolean;
}

interface CurrentStudiesProps {
  studies: Study[];
  onStudyUpdate?: () => void;
}

export function CurrentStudies({ studies, onStudyUpdate }: CurrentStudiesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [newStudy, setNewStudy] = useState({
    title: '',
    description: '',
    targetParticipants: 0,
    reward: 0,
    duration: '',
    category: 'Market Research',
    deadline: '',
    image: '',
    requirements: '',
    instructions: '',
    tags: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; study: Study | null }>({ open: false, study: null });

  const openAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showAddModal || showViewModal || showEditModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal, showViewModal, showEditModal]);

  const handleAddStudy = async () => {
    // Basic validation
    if (!newStudy.title.trim()) {
      openAlert('Please enter a study title', 'error');
      return;
    }
    if (!newStudy.description.trim()) {
      openAlert('Please enter a study description', 'error');
      return;
    }
    if (newStudy.targetParticipants <= 0) {
      openAlert('Please enter a valid number of target participants', 'error');
      return;
    }
    if (newStudy.reward <= 0) {
      openAlert('Please enter a valid reward amount', 'error');
      return;
    }
    if (!newStudy.duration.trim()) {
      openAlert('Please enter the study duration', 'error');
      return;
    }
    
    // Validate duration is a number
    const durationNumber = parseInt(newStudy.duration);
    if (isNaN(durationNumber) || durationNumber <= 0) {
      openAlert('Please enter a valid duration in minutes (e.g., 15, 30, 45)', 'error');
      return;
    }
    
    if (!newStudy.deadline) {
      openAlert('Please select a deadline', 'error');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/studies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newStudy,
          duration: durationNumber, // Use the validated number
          status: 'available',
          tags: newStudy.tags ? newStudy.tags.split(',').map(tag => tag.trim()) : []
        }),
      });

      if (response.ok) {
        openAlert('Study added successfully!', 'success');
        setShowAddModal(false);
        setNewStudy({ title: '', description: '', targetParticipants: 0, reward: 0, duration: '', category: 'Market Research', deadline: '', image: '', requirements: '', instructions: '', tags: '' });
        if (onStudyUpdate) onStudyUpdate();
      } else {
        const error = await response.json();
        openAlert(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      console.error('Error adding study:', error);
      openAlert('Failed to add study. Please try again.', 'error');
    }
  };

  const handleViewStudy = (study: Study) => {
    setSelectedStudy(study);
    setShowViewModal(true);
  };

  const handleEditStudy = (study: Study) => {
    setSelectedStudy(study);
    setNewStudy({
      title: study.title,
      description: study.description,
      targetParticipants: study.targetParticipants || 0,
      reward: study.reward,
      duration: study.duration.toString() || '',
      category: study.category,
      deadline: study.deadline?.split('T')[0] || '', // Format date for input
      image: study.image || '',
      requirements: study.requirements || '',
      instructions: study.instructions || '',
      tags: study.tags?.join(',') || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteStudy = (study: Study) => {
    setConfirmDelete({ open: true, study });
  };

  const confirmDeleteStudy = async () => {
    if (!confirmDelete.study) return;
    const study = confirmDelete.study;
    try {
      const response = await fetch(`${BASE_URL}/api/studies/${study._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        openAlert('Study deleted successfully!', 'success');
        if (onStudyUpdate) onStudyUpdate();
      } else {
        const error = await response.json();
        openAlert(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting study:', error);
      openAlert('Failed to delete study. Please try again.', 'error');
    } finally {
      setConfirmDelete({ open: false, study: null });
    }
  };

  const handleUpdateStudy = async () => {
    if (!selectedStudy) return;
    
    // Basic validation
    if (!newStudy.title.trim()) {
      openAlert('Please enter a study title', 'error');
      return;
    }
    if (!newStudy.description.trim()) {
      openAlert('Please enter a study description', 'error');
      return;
    }
    if (newStudy.targetParticipants <= 0) {
      openAlert('Please enter a valid number of target participants', 'error');
      return;
    }
    if (newStudy.reward <= 0) {
      openAlert('Please enter a valid reward amount', 'error');
      return;
    }
    if (!newStudy.duration.trim()) {
      openAlert('Please enter the study duration', 'error');
      return;
    }
    
    // Validate duration is a number
    const durationNumber = parseInt(newStudy.duration);
    if (isNaN(durationNumber) || durationNumber <= 0) {
      openAlert('Please enter a valid duration in minutes (e.g., 15, 30, 45)', 'error');
      return;
    }
    
    if (!newStudy.deadline) {
      openAlert('Please select a deadline', 'error');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/studies/${selectedStudy._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newStudy,
          duration: durationNumber, // Use the validated number
          tags: newStudy.tags ? newStudy.tags.split(',').map(tag => tag.trim()) : []
        }),
      });

      if (response.ok) {
        openAlert('Study updated successfully!', 'success');
        setShowEditModal(false);
        setSelectedStudy(null);
        setNewStudy({ title: '', description: '', targetParticipants: 0, reward: 0, duration: '', category: 'Market Research', deadline: '', image: '', requirements: '', instructions: '', tags: '' });
        if (onStudyUpdate) onStudyUpdate();
      } else {
        const error = await response.json();
        openAlert(`Error: ${error.message}`, 'error');
      }
    } catch (error) {
      console.error('Error updating study:', error);
      openAlert('Failed to update study. Please try again.', 'error');
    }
  };

  const getProgressPercentage = (participants: number, target: number) => {
    return Math.min((participants / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Current Studies
        </h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Add Study</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm md:text-base">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Study Items */}
        <div className="space-y-4 p-4 md:p-6">
          {studies.map((study) => (
            <div key={study._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedStudy(expandedStudy === study._id ? null : study._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 ">
                    <div className="flex items-center space-x-2"><img src={study.image} alt={study.title} className="w-10 h-10 object-cover" />
                    <h3 className="text-lg font-medium text-gray-900">{study.title}</h3>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">{study.category}</span>
                      <span className="text-sm text-gray-500">Duration: {study.duration} minutes</span>
                      <span className="text-sm text-gray-500">Reward: €{study.reward}</span>
                      <span className="text-sm text-gray-500">Deadline: {study.deadline}</span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        study.status === 'active' || study.status === 'available' ? 'bg-green-100 text-green-700' :
                        study.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {study.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewStudy(study);
                        }}
                        className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-1 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStudy(study);
                        }}
                        className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-1 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudy(study);
                        }}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {expandedStudy === study._id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedStudy === study._id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="pt-4">
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {study.description}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Participation Progress</span>
                        <span className="text-sm text-gray-500">{study.participants} / {study.targetParticipants || study.maxParticipants || 'N/A'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(study.participants, study.targetParticipants || study.maxParticipants || 1)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <div className="text-sm font-medium text-gray-500">Participants</div>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{study.participants}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Target className="h-4 w-4 text-gray-500" />
                          <div className="text-sm font-medium text-gray-500">Target</div>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{study.targetParticipants || study.maxParticipants || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <div className="text-sm font-medium text-gray-500">Reward</div>
                        </div>
                        <div className="text-lg font-bold text-gray-900">€{study.reward}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div className="text-sm font-medium text-gray-500">Duration</div>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{study.duration} min</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Study Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New Study</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Title</label>
                  <input
                    type="text"
                    value={newStudy.title}
                    onChange={(e) => setNewStudy({...newStudy, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter study title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newStudy.description}
                    onChange={(e) => setNewStudy({...newStudy, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Enter study description..."
                  />
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
                            setNewStudy({...newStudy, image: event.target?.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors group"
                    >
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <div className="p-3 bg-gray-100 rounded-full group-hover:bg-orange-100 transition-colors">
                            <Image className="h-6 w-6 text-gray-400 group-hover:text-orange-500" />
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
                  {newStudy.image && (
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
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Participants</label>
                    <input
                      type="number"
                      value={newStudy.targetParticipants}
                      onChange={(e) => setNewStudy({...newStudy, targetParticipants: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reward (€)</label>
                    <input
                      type="number"
                      value={newStudy.reward}
                      onChange={(e) => setNewStudy({...newStudy, reward: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      value={newStudy.duration}
                      onChange={(e) => setNewStudy({...newStudy, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={newStudy.deadline}
                      onChange={(e) => setNewStudy({...newStudy, deadline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newStudy.category}
                    onChange={(e) => setNewStudy({...newStudy, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="Market Research">Market Research</option>
                    <option value="Product Research">Product Research</option>
                    <option value="Social Research">Social Research</option>
                    <option value="Behavioral Research">Behavioral Research</option>
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
                  onClick={handleAddStudy}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Add Study
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Study Modal */}
      {showViewModal && selectedStudy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 w-screen h-screen !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">View Study</h3>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Title</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                    {selectedStudy.title}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                    {selectedStudy.description}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {selectedStudy.participants} / {selectedStudy.targetParticipants}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reward</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      €{selectedStudy.reward}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {selectedStudy.duration}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                      {selectedStudy.deadline}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      selectedStudy.category === 'Market Research' ? 'bg-blue-100 text-blue-700' :
                      selectedStudy.category === 'Product Research' ? 'bg-green-100 text-green-700' :
                      selectedStudy.category === 'Social Research' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {selectedStudy.category}
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

      {/* Edit Study Modal */}
      {showEditModal && selectedStudy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 !mt-0">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit Study</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Title</label>
                  <input
                    type="text"
                    value={newStudy.title}
                    onChange={(e) => setNewStudy({...newStudy, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter study title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newStudy.description}
                    onChange={(e) => setNewStudy({...newStudy, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Enter study description..."
                  />
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
                            setNewStudy({...newStudy, image: event.target?.result as string});
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
                            <Image className="h-6 w-6 text-gray-400 group-hover:text-orange-500" />
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
                  {newStudy.image && (
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
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Participants</label>
                    <input
                      type="number"
                      value={newStudy.targetParticipants}
                      onChange={(e) => setNewStudy({...newStudy, targetParticipants: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reward (€)</label>
                    <input
                      type="number"
                      value={newStudy.reward}
                      onChange={(e) => setNewStudy({...newStudy, reward: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      value={newStudy.duration}
                      onChange={(e) => setNewStudy({...newStudy, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input
                      type="date"
                      value={newStudy.deadline}
                      onChange={(e) => setNewStudy({...newStudy, deadline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newStudy.category}
                    onChange={(e) => setNewStudy({...newStudy, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="Market Research">Market Research</option>
                    <option value="Product Research">Product Research</option>
                    <option value="Social Research">Social Research</option>
                    <option value="Behavioral Research">Behavioral Research</option>
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
                  onClick={handleUpdateStudy}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Update Study
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete Popup */}
      {confirmDelete.open && confirmDelete.study && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="px-6 py-4 border-b border-red-200">
              <h4 className="text-lg font-bold text-red-600">Confirm Delete</h4>
            </div>
            <div className="px-6 py-4 text-gray-700">
              Are you sure you want to delete "{confirmDelete.study.title}"?
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete({ open: false, study: null })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStudy}
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
