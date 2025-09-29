import React, { useState, useEffect, useRef } from 'react';
import { Plus, Eye, Edit, Trash2, X, MessageSquare, Heart, Users, BarChart3, Filter, Search, Upload, Image as ImageIcon, Calendar, Tag } from 'lucide-react';
import { BASE_URL } from '../../services/api';

interface Question {
  _id: string;
  title: string;
  description: string;
  image: string;
  options: Array<{
    text: string;
    votes: number;
  }>;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'closed';
  author: string;
  totalVotes: number;
  totalLikes: number;
  totalComments: number;
  publishedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function MyQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    description: '',
    image: '',
    options: [{ text: '', votes: 0 }, { text: '', votes: 0 }],
    category: 'Other',
    tags: [] as string[],
    author: 'Admin',
    status: 'draft' as 'draft' | 'published' | 'closed'
  });

  const categories = ['Music', 'Culture', 'Politics', 'Society', 'Technology', 'Sports', 'Entertainment', 'Other'];
  const statusOptions = [
    { value: 'draft', label: 'Draft', color: 'gray' },
    { value: 'published', label: 'Published', color: 'green' },
    { value: 'closed', label: 'Closed', color: 'red' }
  ];

  // Load questions from backend
  useEffect(() => {
    loadQuestions();
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
        setNewQuestion(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
    setNewQuestion(prev => ({ ...prev, image: '' }));
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

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${BASE_URL}/api/questions`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
      } else {
        throw new Error(data.message || 'Failed to load questions');
      }
    } catch (err: any) {
      console.error('Error loading questions:', err);
      setError(err.message || 'Failed to load questions');
      
      // Fallback to mock data if API fails
      const mockQuestions: Question[] = [
        {
          _id: '1',
          title: 'Comment percevez-vous l\'évolution de la musique de notre île ?',
          description: 'Je m\'interroge sur les changements dans les goûts musicaux locaux ces dernières années. Qu\'en pensez-vous ?',
          image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
          options: [
            { text: 'Elle s\'améliore beaucoup', votes: 45 },
            { text: 'Elle reste stable', votes: 32 },
            { text: 'Elle se dégrade', votes: 18 },
            { text: 'Je ne sais pas', votes: 61 }
          ],
          category: 'Music',
          tags: ['Tendency', 'The music'],
          status: 'published',
          author: 'Marie L.',
          totalVotes: 156,
          totalLikes: 89,
          totalComments: 23,
          publishedAt: new Date('2024-01-15'),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }
      ];
      
      setQuestions(mockQuestions);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search questions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || question.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || question.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateQuestion = async () => {
    if (!newQuestion.title.trim()) {
      alert('Please enter a question title');
      return;
    }
    if (!newQuestion.description.trim()) {
      alert('Please enter a question description');
      return;
    }
    if (newQuestion.options.some(option => !option.text.trim())) {
      alert('Please fill in all option texts');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create question');
      }

      const data = await response.json();
      if (data.success) {
        setQuestions(prev => [data.question, ...prev]);
        alert('Question created successfully!');
        setShowCreateModal(false);
        setNewQuestion({
          title: '',
          description: '',
          image: '',
          options: [{ text: '', votes: 0 }, { text: '', votes: 0 }],
          category: 'Other',
          tags: [],
          author: 'Admin',
          status: 'draft'
        });
        resetImageStates();
      } else {
        throw new Error(data.message || 'Failed to create question');
      }
    } catch (err: any) {
      console.error('Error creating question:', err);
      alert(`Error creating question: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = async () => {
    if (!selectedQuestion) return;

    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/questions/${selectedQuestion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update question');
      }

      const data = await response.json();
      if (data.success) {
        setQuestions(prev => prev.map(question => 
          question._id === selectedQuestion._id ? data.question : question
        ));
        alert('Question updated successfully!');
        setShowEditModal(false);
        setSelectedQuestion(null);
      } else {
        throw new Error(data.message || 'Failed to update question');
      }
    } catch (err: any) {
      console.error('Error updating question:', err);
      alert(`Error updating question: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (question: Question) => {
    if (!window.confirm(`Are you sure you want to delete "${question.title}"?`)) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/questions/${question._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete question');
      }

      const data = await response.json();
      if (data.success) {
        setQuestions(prev => prev.filter(q => q._id !== question._id));
        alert('Question deleted successfully!');
      } else {
        throw new Error(data.message || 'Failed to delete question');
      }
    } catch (err: any) {
      console.error('Error deleting question:', err);
      alert(`Error deleting question: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowViewModal(true);
  };

  const handleEditClick = (question: Question) => {
    setSelectedQuestion(question);
    setNewQuestion({
      title: question.title,
      description: question.description,
      image: question.image,
      options: question.options,
      category: question.category,
      tags: question.tags,
      author: question.author,
      status: question.status
    });
    resetImageStates();
    setShowEditModal(true);
  };

  const addOption = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...prev.options, { text: '', votes: 0 }]
    }));
  };

  const removeOption = (index: number) => {
    if (newQuestion.options.length > 2) {
      setNewQuestion(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, text: string) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, text } : option
      )
    }));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !newQuestion.tags.includes(tag.trim())) {
      setNewQuestion(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewQuestion(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'draft': return <Edit className="h-4 w-4 text-gray-500" />;
      case 'closed': return <X className="h-4 w-4 text-red-500" />;
      default: return <Edit className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-orange-500" />
            My Questions ({filteredQuestions.length})
          </h2>
          <p className="text-gray-600 mt-1">Create and manage your questions and polls</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading questions...</span>
        </div>
      )}

      {/* Questions Grid */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <div key={question._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Question Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{question.author}</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">
                        {question.publishedAt ? new Date(question.publishedAt).toLocaleDateString() : 'Draft'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{question.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{question.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {question.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {question.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(question.status)}`}>
                      {question.status}
                    </span>
                    {getStatusIcon(question.status)}
                  </div>
                </div>

                {/* Question Image */}
                {question.image && (
                  <div className="mb-3">
                    <img
                      src={question.image}
                      alt={question.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Poll Options Preview */}
                <div className="space-y-2 mb-4">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{option.text}</span>
                      <span className="text-xs text-gray-500">{option.votes} votes</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{question.totalVotes} answers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{question.totalLikes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.totalComments}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-4">
                <button
                  onClick={() => handleViewQuestion(question)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditClick(question)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors text-sm"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredQuestions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No questions found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first question'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mx-auto"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>
      )}

      {/* Create Question Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold">Create New Question</h3>
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

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"></label>
                  </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Comment percevez-vous l'évolution de la musique de notre île ?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add more context to your question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Image</label>
                  
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
                        value={newQuestion.image}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poll Options</label>
                  <div className="space-y-2">
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder={`Option ${index + 1}`}
                        />
                        {newQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center gap-2 px-3 py-2 text-orange-600 border border-orange-300 rounded hover:bg-orange-50 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Option
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newQuestion.status}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={newQuestion.author}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newQuestion.tags.map((tag, index) => (
                      <span key={index} className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a tag and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handleCreateQuestion}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create Question
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

      {/* Edit Question Modal */}
      {showEditModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold">Edit Question</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedQuestion(null);
                  resetImageStates();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Comment percevez-vous l'évolution de la musique de notre île ?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add more context to your question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Image</label>
                  
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
                        value={newQuestion.image}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poll Options</label>
                  <div className="space-y-2">
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder={`Option ${index + 1}`}
                        />
                        {newQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center gap-2 px-3 py-2 text-orange-600 border border-orange-300 rounded hover:bg-orange-50 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Option
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newQuestion.status}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    value={newQuestion.author}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newQuestion.tags.map((tag, index) => (
                      <span key={index} className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-orange-600 hover:text-orange-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a tag and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handleEditQuestion}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Update Question
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedQuestion(null);
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

      {/* View Question Modal */}
      {showViewModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Question Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Question Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900">{selectedQuestion.author}</span>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-sm">
                  {selectedQuestion.publishedAt ? new Date(selectedQuestion.publishedAt).toLocaleDateString() : 'Draft'}
                </span>
              </div>

              <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedQuestion.title}</h4>
              <p className="text-gray-600 mb-4">{selectedQuestion.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedQuestion.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {selectedQuestion.category}
                </span>
              </div>

              {/* Question Image */}
              {selectedQuestion.image && (
                <div className="mb-4">
                  <img
                    src={selectedQuestion.image}
                    alt={selectedQuestion.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Poll Results */}
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-900">Poll Results</h5>
                {selectedQuestion.options.map((option, index) => {
                  const percentage = selectedQuestion.totalVotes > 0 
                    ? (option.votes / selectedQuestion.totalVotes) * 100 
                    : 0;
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{option.text}</span>
                        <span className="text-gray-500">{option.votes} votes ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{selectedQuestion.totalVotes} answers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{selectedQuestion.totalLikes} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{selectedQuestion.totalComments} comments</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditClick(selectedQuestion);
                }}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Edit Question
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
