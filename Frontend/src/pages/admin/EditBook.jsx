import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { BOOK_API_END_POINT } from '../../utils/constant';

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

  const [coverFile, setCoverFile] = useState(null);
  const [bookFile, setBookFile] = useState(null);

  // =========================
  // GET BOOK DETAILS
  // =========================
  const fetchBookDetails = async () => {
    try {
      setIsLoading(true);

      // IMPORTANT:
      // Your router uses /get/:id for getting a book
      const response = await api.get(`${BOOK_API_END_POINT}/get/${id}`);

      const { book } = response.data;

      if (!book) {
        throw new Error('Book not found');
      }

      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        publishedYear:
          book.publishedYear || new Date().getFullYear(),
        category: book.category || '',
        bookPrice: book.bookPrice ?? 0,
        stock: book.stock ?? 0,
        coverUrl: book.coverImage || book.coverUrl || '',
        bookUrl: book.bookUrl || ''
      });

    } catch (error) {
      console.error('Error fetching book:', error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Failed to load book details'
      );

      navigate('/admin/books');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  // =========================
  // VALIDATE FORM
  // =========================
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    }

    if (formData.bookPrice < 0) {
      newErrors.bookPrice = 'Price cannot be negative';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: [
        'bookPrice',
        'stock',
        'publishedYear'
      ].includes(name)
        ? Number(value)
        : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // =========================
  // FILE UPLOAD
  // =========================
  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Image validation
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    // PDF validation
    const validPdfTypes = [
      'application/pdf'
    ];

    if (field === 'coverUrl' && !validImageTypes.includes(file.type)) {
      toast.error(
        'Please upload a valid image file (JPEG, PNG, or WebP)'
      );
      return;
    }

    if (field === 'bookUrl' && !validPdfTypes.includes(file.type)) {
      toast.error('Please upload a valid PDF file');
      return;
    }

    // Store file in state (will be uploaded on form submit)
    if (field === 'coverUrl') {
      setCoverFile(file);
    } else if (field === 'bookUrl') {
      setBookFile(file);
    }

    toast.success(
      field === 'coverUrl'
        ? 'Cover image selected (will be uploaded on save)'
        : 'PDF file selected (will be uploaded on save)'
    );
  };

  // =========================
  // UPDATE BOOK
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData to send both text data and files
      const submitFormData = new FormData();

      // Add text fields
      submitFormData.append('title', formData.title);
      submitFormData.append('author', formData.author);
      submitFormData.append('isbn', formData.isbn);
      submitFormData.append('description', formData.description);
      submitFormData.append('category', formData.category);
      submitFormData.append('bookPrice', formData.bookPrice);
      submitFormData.append('stock', formData.stock);
      submitFormData.append('publishedYear', formData.publishedYear);

      // Add files if selected (using correct field names for Multer)
      if (coverFile) {
        submitFormData.append('cover', coverFile);
      }
      if (bookFile) {
        submitFormData.append('book', bookFile);
      }

      const response = await api.post(
        `${BOOK_API_END_POINT}/update/${id}`,
        submitFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Update response:', response.data);

      toast.success('Book updated successfully');

      setTimeout(() => {
        navigate('/admin/books');
      }, 1000);

    } catch (error) {
      console.error(
        'Error updating book:',
        error.response?.data || error
      );

      const status = error.response?.status;

      if (status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');

      } else if (status === 403) {
        toast.error(
          'You do not have permission to update this book'
        );

      } else if (status === 404) {
        toast.error('Book not found');
        navigate('/admin/books');

      } else {
        toast.error(
          error.response?.data?.message ||
          'Failed to update book'
        );
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800">
          Edit Book
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BOOK INFORMATION */}
        <div className="bg-white shadow rounded-lg p-6">

          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Book Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* TITLE */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />

              {errors.title && (
                <p className="text-red-500 text-sm">
                  {errors.title}
                </p>
              )}
            </div>

            {/* AUTHOR */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Author *
              </label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />

              {errors.author && (
                <p className="text-red-500 text-sm">
                  {errors.author}
                </p>
              )}
            </div>

            {/* ISBN */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ISBN *
              </label>

              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />

              {errors.isbn && (
                <p className="text-red-500 text-sm">
                  {errors.isbn}
                </p>
              )}
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* PRICE */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>

              <input
                type="number"
                name="bookPrice"
                min="0"
                step="0.01"
                value={formData.bookPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />

              {errors.bookPrice && (
                <p className="text-red-500 text-sm">
                  {errors.bookPrice}
                </p>
              )}
            </div>

            {/* STOCK */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />

              {errors.stock && (
                <p className="text-red-500 text-sm">
                  {errors.stock}
                </p>
              )}
            </div>

            {/* PUBLISHED YEAR */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Published Year
              </label>

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

          {/* DESCRIPTION */}
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* FILES */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* COVER IMAGE */}
            <div className="space-y-2">

              <label className="block text-sm font-medium text-gray-700">
                Cover Image
              </label>

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

                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                    <FiUpload className="mr-2" />
                    Upload

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        handleFileChange(e, 'coverUrl')
                      }
                      className="sr-only"
                    />
                  </span>

                </label>

              </div>
            </div>

            {/* PDF */}
            <div className="space-y-2">

              <label className="block text-sm font-medium text-gray-700">
                PDF File
              </label>

              <div className="flex items-center">

                {formData.bookUrl ? (
                  <span className="text-sm text-indigo-600">
                    {formData.title}.pdf
                  </span>
                ) : (
                  <span className="text-sm text-gray-500">
                    No PDF file
                  </span>
                )}

                <label className="ml-4 cursor-pointer">

                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                    <FiUpload className="mr-2" />
                    Upload PDF

                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        handleFileChange(e, 'bookUrl')
                      }
                      className="sr-only"
                    />
                  </span>

                </label>

              </div>
            </div>

          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end space-x-3">

          <button
            type="button"
            onClick={() => navigate('/admin/books')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${
              isSubmitting
                ? 'opacity-70 cursor-not-allowed'
                : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>

        </div>

      </form>
    </div>
  );
};

export default EditBook;