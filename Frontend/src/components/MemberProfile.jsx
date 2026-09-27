import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Settings, CreditCard, LogOut, User, BookOpen, Star, X, Upload, Loader2, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

const MemberProfile = () => {

  const { user } = useSelector(store => store.auth);
  const { purchasedBooks = [] } = useSelector(store => store.books);
  const isAdmin = user?.role === 'admin';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (data[key]) formData.append(key, data[key]);
      });
      
      if (fileInputRef.current?.files[0]) {
        formData.append('profilePhoto', fileInputRef.current.files[0]);
      }

      const response = await axios.patch(
        `${USER_API_END_POINT}/updateProfile`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setPreviewImage('');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  // Get user data and set up hooks
 
  
  // State for UI
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);
  
  // Form handling
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      fullname: user?.fullname || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      bio: user?.profile?.bio || ''
    }
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setValue('fullname', user.fullname || '');
      setValue('email', user.email || '');
      setValue('phoneNumber', user.phoneNumber || '');
      setValue('bio', user.profile?.bio || '');
    }
  }, [user, setValue]);

  const borrowedBooks = purchasedBooks
    .filter(book => {
      const accessType = book.accessType || book.bookId?.accessType;
      return accessType === 'Subscribe' || accessType === 'borrowed';
    })
    .map(book => {
      const bookData = book.bookId ? book.bookId : book;
      return {
        _id: book._id || bookData._id,
        title: bookData?.title || 'Untitled Book',
        accessType: book.accessType || book.bookId?.accessType
      };
    });

  const boughtBooks = purchasedBooks
    .filter(book => {
      const accessType = book.accessType || book.bookId?.accessType;
      return accessType === 'Buy' || accessType === 'purchased';
    })
    .map(book => {
      const bookData = book.bookId ? book.bookId : book;
      return {
        _id: book._id || bookData._id,
        title: bookData?.title || 'Untitled Book',
        accessType: book.accessType || book.bookId?.accessType
      };
    });

  const numberOfBorrowedBooks = borrowedBooks.length;

  const handleBookClick = (e) => {
    e.preventDefault();
    document.body.click(); // closes the popover
    navigate('/library');
  };

  const handleLogout = async () => {
    setIsEditing(false);
    setPreviewImage('');
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate('/');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Logout failed.");
    }
  };

  return (
    <>
      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsImageModalOpen(false)}>
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close image"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} 
                alt="Profile" 
                className="max-h-[80vh] w-auto mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
      
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="cursor-pointer h-10 w-10">
            <AvatarImage 
              src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} 
              alt="profile" 
              className="object-cover h-full w-full"
            />
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0">
          <div className="p-4 border-b">
            <div className="flex items-start gap-3">
              <div className="relative group">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={user?.profile?.profilePhoto || "https://github.com/shadcn.png"} 
                    alt="profile"
                    className="cursor-pointer object-cover h-full w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsImageModalOpen(true);
                    }}
                  />
                </Avatar>
                <div 
                  className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageModalOpen(true);
                  }}
                >
                  <span className="text-white text-xs font-medium">View</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between w-full">
                  {isEditing ? (
                    <div className="w-full">
                      <input
                        type="text"
                        {...register('fullname', { required: 'Full name is required' })}
                        className="w-full p-1 border rounded"
                        disabled={isLoading}
                      />
                      {errors.fullname && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
                      )}
                    </div>
                  ) : (
                    <h4 className="font-medium text-lg">{user?.fullname}</h4>
                  )}
              </div>
              {isEditing ? (
                <div className="w-full mt-2">
                  <textarea
                      {...register('bio')}
                      placeholder="Tell us about yourself"
                      className="w-full p-2 border rounded"
                      disabled={isLoading}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {user?.profile?.bio || 'No bio added yet'}
                </p>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue={isAdmin ? 'account' : 'borrowed'} className="w-full">
          {!isAdmin && (
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="borrowed" className="text-xs py-1">Borrowed</TabsTrigger>
              <TabsTrigger value="reading" className="text-xs py-1">Reading</TabsTrigger>
              <TabsTrigger value="account" className="text-xs py-1">Account</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="borrowed" className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Borrowed Books Column */}
              <div className="flex flex-col h-full">
                <div className="border rounded-lg p-4 bg-white shadow-sm flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-sm flex items-center gap-2 text-gray-700">
                      <div className="p-1.5 bg-blue-50 rounded-full">
                        <Book className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Borrowed Books</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {numberOfBorrowedBooks}
                      </span>
                    </h5>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {borrowedBooks.length > 0 ? (
                      <ul className="space-y-1">
                        {borrowedBooks.map((book) => (
                          <li key={book._id}>
                            <button
                              onClick={handleBookClick}
                              className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              {book.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-4">
                        <p className="text-sm text-gray-500">No books currently borrowed</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                          onClick={() => navigate('/books')}
                        >
                          Browse Books
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Purchased Books Column */}
              <div className="flex flex-col h-full">
                <div className="border rounded-lg p-4 bg-white shadow-sm flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-sm flex items-center gap-2 text-gray-700">
                      <div className="p-1.5 bg-purple-50 rounded-full">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                      </div>
                      <span>Purchased Books</span>
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {boughtBooks.length}
                      </span>
                    </h5>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {boughtBooks.length > 0 ? (
                      <ul className="space-y-1">
                        {boughtBooks.map((book) => (
                          <li key={book._id}>
                            <button
                              onClick={handleBookClick}
                              className="w-full text-left px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                            >
                              {book.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500">No purchased books yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reading" className="p-4 max-h-64 overflow-y-auto">
            <h5 className="font-medium text-sm mb-3 flex items-center gap-1 text-gray-700">
              <Star className="h-4 w-4 text-yellow-500" /> Recently Added
            </h5>
            {purchasedBooks.length > 0 ? (
              purchasedBooks
                .slice(0, 5) // Show only the 5 most recent books
                .map((book) => {
                  const bookData = book.bookId ? book.bookId : book;
                  return (
                    <div key={book._id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                      <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {bookData?.title || 'Untitled Book'}
                      </span>
                    </div>
                  );
                })
            ) : (
              <div className="text-sm text-gray-500 py-2">No books added yet</div>
            )}
          </TabsContent>

          {!isAdmin && (
            <TabsContent value="account" className="p-4 max-h-64 overflow-y-auto">
              <div className="flex flex-col space-y-2">
                <Link to="/update-profile" className="flex items-center gap-2 text-sm py-1 hover:bg-gray-50 px-2 rounded">
                  <User className="h-4 w-4" />
                  Update Profile
                </Link>
                <Link to="/settings" className="flex items-center gap-2 text-sm py-1 hover:bg-gray-50 px-2 rounded">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4 w-full flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </TabsContent>
          )}
          
          {isAdmin && (
            <div className="p-4">
              <div className="flex flex-col space-y-2">  
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center gap-2 text-sm py-2 px-3 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </Tabs>
      </PopoverContent>
    </Popover>
    </>
  );
};

export default MemberProfile;
