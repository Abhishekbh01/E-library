import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/authSlice';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload, X } from 'lucide-react';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profilePhoto || '');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Set initial form values when user data is available
  useEffect(() => {
    if (user) {
      setName(user.fullname || '');
      setEmail(user.email || '');
      // Make sure phoneNumber is set from the correct location in user object
      setPhoneNumber(user.phoneNumber || user.profile?.phoneNumber || '');
      setBio(user.profile?.bio || '');
      setPreview(user.profile?.profilePhoto || '');
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setProfilePhoto(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      // Always include all fields, even if they haven't changed
      formData.append('fullname', name || '');
      formData.append('email', email || '');
      formData.append('phoneNumber', phoneNumber || '');
      formData.append('bio', bio || '');
      
      // Handle profile photo
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      if (preview === '' && user.profile?.profilePhoto) {
        // If preview is cleared and there was a previous photo, send null to remove it
        formData.append('removeProfilePhoto', 'true');
      }

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success && res.data.user) {
        // Ensure phoneNumber is properly set in the user object
        const updatedUser = {
          ...res.data.user,
          phoneNumber: res.data.user.phoneNumber || phoneNumber || '',
          profile: {
            ...(res.data.user.profile || {}),
            bio: bio || '',
            phoneNumber: phoneNumber || ''
          }
        };
        dispatch(setUser(updatedUser));
        toast.success('Profile updated successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Update Profile</CardTitle>
          <CardDescription>
            Update your profile information and photo
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <CardContent className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-full">
                    <AvatarImage src={preview} />
                    <AvatarFallback className="text-2xl bg-gray-100">
                      {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="profile-photo" 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Upload className="h-6 w-6 text-white" />
                  </label>
                  {preview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  <p>Click on the avatar to upload a new photo</p>
                  <p className="text-xs mt-1">Recommended size: 200x200 pixels</p>
                </div>
              </div>
              <input
                id="profile-photo"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                disabled
                placeholder="Enter your phone number"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows="4"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/profile')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UpdateProfile;
