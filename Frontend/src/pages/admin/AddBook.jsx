import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { ADMIN_API_END_POINT, BOOK_API_END_POINT } from '../../utils/constant';

const AddBook = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    bookPrice: 0,
    stock: 0,
    publishedYear: new Date().getFullYear(),
    coverUrl: '',
    bookUrl: ''
  });
  
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (formData.bookPrice < 0) newErrors.bookPrice = 'Price cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['bookPrice', 'stock', 'publishedYear'].includes(name) 
        ? Number(value) 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL for the image
    if (field === 'coverUrl') {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        [field]: previewUrl,
        coverFile: file  // Store the file object for form submission
      }));
    } else if (field === 'bookUrl') {
      const validPdfTypes = ['application/pdf'];
      if (!validPdfTypes.includes(file.type)) {
        toast.error('Please upload a valid PDF file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        bookFile: file,  // Store the file object for form submission
        [field]: file.name  // Show the filename as preview
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'coverFile' && key !== 'bookFile') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Append files if they exist
      if (formData.coverFile) {
        formDataToSend.append('cover', formData.coverFile);
      }
      if (formData.bookFile) {
        formDataToSend.append('book', formData.bookFile);
      }

      const response = await api.post(`${BOOK_API_END_POINT}/add`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Book added successfully', {
        onClose: () => navigate('/admin/books')
      });
      
      // Optional: Redirect after a short delay
      setTimeout(() => navigate('/admin/books'), 1500);
      
    } catch (error) {
      console.error('Error adding book:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add book';
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to add books');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Book</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Book Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
                <input
                  type="text"
                  name="bookPrice"
                  value={formData.bookPrice || ''}
                  onChange={handleChange}
                  className="w-full pl-7 pr-12 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Published Year</label>
              <input
                type="number"
                name="publishedYear"
                min="1000"
                max={new Date().getFullYear()}
                value={formData.publishedYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <div className="flex items-center space-x-4">
                {formData.coverUrl ? (
                  <img 
                    src={formData.coverUrl} 
                    alt="Book cover" 
                    className="h-24 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="h-24 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center">
                    <FiUpload className="mr-2" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'coverUrl')}
                      className="sr-only"
                    />
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">PDF File</label>
              <div className="flex items-center">
                {formData.bookUrl ? (
                  <span 
                  className="text-sm text-indigo-600"
                  >{formData.title}.pdf</span>
                ) : (
                  <span className="text-sm text-gray-500">No PDF file</span>
                )}
                <label className="ml-4 cursor-pointer">
                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center">
                    <FiUpload className="mr-2" /> Upload PDF
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, 'bookUrl')}
                      className="sr-only"
                    />
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/books')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
