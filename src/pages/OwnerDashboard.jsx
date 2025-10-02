import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Clock, Star, DollarSign, Image, Save, X } from 'lucide-react';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('morning');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [user, setUser] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/signin');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'owner') {
      alert('Access denied. Owner account required.');
      navigate('/');
      return;
    }
    
    setUser(parsedUser);
  }, [navigate]);

  // Mock data for breakfast items
  const [breakfastItems, setBreakfastItems] = useState({
    morning: [
      {
        id: 1,
        name: 'Classic Pancakes',
        description: 'Fluffy pancakes with maple syrup and butter',
        price: 8.99,
        image: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.5,
        available: true
      },
      {
        id: 2,
        name: 'Avocado Toast',
        description: 'Fresh avocado on sourdough with poached egg',
        price: 12.99,
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        available: true
      }
    ],
    afternoon: [
      {
        id: 3,
        name: 'Chicken Sandwich',
        description: 'Grilled chicken with fresh vegetables',
        price: 10.99,
        image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.3,
        available: true
      }
    ],
    evening: [
      {
        id: 4,
        name: 'Pasta Bowl',
        description: 'Creamy pasta with herbs and parmesan',
        price: 14.99,
        image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.6,
        available: true
      }
    ]
  });

  const timeSlots = [
    { key: 'morning', label: 'Morning', icon: '🌅', time: '6:00 AM - 11:00 AM' },
    { key: 'afternoon', label: 'Afternoon', icon: '☀️', time: '11:00 AM - 4:00 PM' },
    { key: 'evening', label: 'Evening', icon: '🌆', time: '4:00 PM - 9:00 PM' }
  ];

  const onSubmit = (data) => {
    const newItem = {
      id: Date.now(),
      ...data,
      price: parseFloat(data.price),
      rating: 0,
      available: true
    };

    if (editingItem) {
      // Update existing item
      setBreakfastItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(item => 
          item.id === editingItem.id ? { ...item, ...newItem, id: editingItem.id } : item
        )
      }));
      setEditingItem(null);
    } else {
      // Add new item
      setBreakfastItems(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], newItem]
      }));
    }

    setIsAddingItem(false);
    reset();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsAddingItem(true);
    reset(item);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setBreakfastItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== itemId)
      }));
    }
  };

  const toggleAvailability = (itemId) => {
    setBreakfastItems(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(item =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    }));
  };

  const cancelForm = () => {
    setIsAddingItem(false);
    setEditingItem(null);
    reset();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your breakfast menu and availability</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name || 'Store Owner'}</p>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  navigate('/');
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Slot Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Menu by Time Slot</h2>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {timeSlots.map((slot) => (
              <button
                key={slot.key}
                onClick={() => setActiveTab(slot.key)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
                  activeTab === slot.key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{slot.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{slot.label}</div>
                  <div className="text-xs opacity-75">{slot.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Add Item Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {timeSlots.find(slot => slot.key === activeTab)?.label} Menu
          </h3>
          <button
            onClick={() => setIsAddingItem(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAddingItem && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h4>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Item name is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter item name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Price is required', min: 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Describe your item..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  {...register('image', { required: 'Image URL is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingItem ? 'Update Item' : 'Add Item'}</span>
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakfastItems[activeTab].map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => toggleAvailability(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-full">
                  <span className="text-lg font-bold text-orange-600">${item.price}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  {item.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {breakfastItems[activeTab].length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first breakfast item for {timeSlots.find(slot => slot.key === activeTab)?.label.toLowerCase()}</p>
            <button
              onClick={() => setIsAddingItem(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;