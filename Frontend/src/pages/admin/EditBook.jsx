import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { ADMIN_API_END_POINT, BOOK_API_END_POINT } from '../../utils/constant';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchBookDetails = async () => {
    try {
      const response = await api.post(`${BOOK_API_END_POINT}/update/${id}`);
      const { book } = response.data;
      
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        publishedYear: book.publishedYear || new Date().getFullYear(),
        category: book.category || '',
        bookPrice: book.bookPrice || 0,
        stock: book.stock || 0,
        coverUrl: book.coverUrl || '',
        bookUrl: book.bookUrl || ''
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error(error.response?.data?.message || 'Failed to load book details');
      navigate('/admin/books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (formData.bookPrice < 0) newErrors.bookPrice = 'Price cannot be negative';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    
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

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type based on field
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validPdfTypes = ['application/pdf'];
    
    if (field === 'coverUrl' && !validImageTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }
    
    if (field === 'bookUrl' && !validPdfTypes.includes(file.type)) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await api.post(`${BOOK_API_END_POINT}/update/${id}`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData(prev => ({
        ...prev,
        [field]: response.data.url
      }));
      
      toast.success(`${field === 'coverUrl' ? 'Cover image' : 'PDF file'} uploaded successfully`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
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
      const response = await api.post(`${BOOK_API_END_POINT}/update/${id}`, formData);
      
      toast.success('Book updated successfully', {
        onClose: () => navigate('/admin/books')
      });
      
      // Optional: Redirect after a short delay
      setTimeout(() => navigate('/admin/books'), 1500);
      
    } catch (error) {
      console.error('Error updating book:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update book';
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to update this book');
      } else if (error.response?.status === 404) {
        toast.error('Book not found');
        navigate('/admin/books');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.bookPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
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
                      onChange={(e) => handleFileChange(e, 'coverImage')}
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
                      onChange={(e) => handleFileChange(e, 'pdfUrl')}
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;
