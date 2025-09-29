import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, X, Send, Calendar, Users, BarChart3, Filter, Search, Clock, CheckCircle, AlertCircle, Info, Bell, Mail, MessageSquare } from 'lucide-react';

interface NotificationsProps {
  notifications: Array<{
    id: number;
    title: string;
    message: string;
    type: string;
    sentAt: string;
    recipients: number;
  }>;
}

export function Notifications({ notifications }: NotificationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'study' | 'info' | 'alert'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'recipients' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    scheduledDate: '',
    recipients: 'all'
  });

  // Filter and sort notifications
  const filteredAndSortedNotifications = notifications
    .filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || notification.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'recipients':
          aValue = a.recipients;
          bValue = b.recipients;
          break;
        case 'date':
          aValue = new Date(a.sentAt).getTime();
          bValue = new Date(b.sentAt).getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleCreateNotification = () => {
    if (!newNotification.title.trim()) {
      alert('Please enter a notification title');
      return;
    }
    if (!newNotification.message.trim()) {
      alert('Please enter a notification message');
      return;
    }

    console.log('Creating notification:', newNotification);
    alert('Notification created successfully!');
    setShowCreateModal(false);
    setNewNotification({ title: '', message: '', type: 'info', scheduledDate: '', recipients: 'all' });
  };

  const handleViewNotification = (notification: any) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
  };

  const handleEditNotification = (notification: any) => {
    setSelectedNotification(notification);
    setNewNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      scheduledDate: '',
      recipients: 'all'
    });
    setShowEditModal(true);
  };

  const handleDeleteNotification = (notification: any) => {
    if (window.confirm(`Are you sure you want to delete "${notification.title}"?`)) {
      console.log('Deleting notification:', notification);
      alert('Notification deleted successfully!');
    }
  };

  const handleSendNotification = (notification: any) => {
    console.log('Sending notification:', notification);
    alert(`Notification "${notification.title}" sent to ${notification.recipients} users!`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study': return <Bell className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-700';
      case 'info': return 'bg-green-100 text-green-700';
      case 'alert': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Notifications Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage {notifications.length} notifications • {notifications.reduce((sum, n) => sum + n.recipients, 0)} total recipients
          </p>
        </div>
        
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="study">Study Notifications</option>
                <option value="info">Info Notifications</option>
                <option value="alert">Alert Notifications</option>
              </select>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as any);
                  setSortOrder(order as any);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="recipients-desc">Most Recipients</option>
                <option value="recipients-asc">Least Recipients</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 p-4 md:p-6">
        {filteredAndSortedNotifications.map((notification) => (
          <div key={notification.id} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <h3 className="text-base md:text-lg font-medium text-gray-900">{notification.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(notification.type)}`}>
                    {notification.type}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-3 text-xs md:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>Sent to {notification.recipients} users</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(notification.sentAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleViewNotification(notification)}
                  className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-1 rounded transition-colors"
                  title="View Notification"
                >
                  <Eye className="h-4 w-4" />
                </button>
               
                <button 
                  onClick={() => handleDeleteNotification(notification)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                  title="Delete Notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Create New Notification</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Title</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter notification title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Enter notification message..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="info">Info</option>
                      <option value="study">Study</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                    <select
                      value={newNotification.recipients}
                      onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users Only</option>
                      <option value="premium">Premium Users Only</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newNotification.scheduledDate}
                    onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNotification}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Create Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Notification Modal */}
      {showViewModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Notification Details</h3>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${getTypeColor(selectedNotification.type)}`}>
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedNotification.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(selectedNotification.type)}`}>
                    {selectedNotification.type}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Message</h5>
                  <p className="text-gray-900">{selectedNotification.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div className="text-sm font-medium text-gray-500">Recipients</div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{selectedNotification.recipients}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div className="text-sm font-medium text-gray-500">Sent Date</div>
                    </div>
                    <div className="text-sm text-gray-900">{new Date(selectedNotification.sentAt).toLocaleDateString()}</div>
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

      {/* Edit Notification Modal */}
      {showEditModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit Notification</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Title</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Enter notification title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Enter notification message..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="info">Info</option>
                      <option value="study">Study</option>
                      <option value="alert">Alert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                    <select
                      value={newNotification.recipients}
                      onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users Only</option>
                      <option value="premium">Premium Users Only</option>
                    </select>
                  </div>
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
                  onClick={() => {
                    alert('Notification updated successfully!');
                    setShowEditModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium"
                >
                  Update Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
