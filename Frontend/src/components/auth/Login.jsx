// Login.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../../redux/authSlice';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    email: '',
    password: '',
    role: ''
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true // Important for cookies
      }); 
      
      if (res.data.success) {
        // Check if we have the user data in the response
        if (res.data.user) {
          // Ensure all user data is properly passed to Redux
          const userData = {
            ...res.data.user,
            // Ensure phoneNumber is included in the user object
            phoneNumber: res.data.user.phoneNumber || (res.data.user.profile?.phoneNumber || '')
          };
          dispatch(setUser(userData));
          toast.success(res.data.message || 'Login successful!');
          
          // Redirect based on user role
          if (input.role === 'admin' || res.data.user.role === 'admin') {
            console.log('Redirecting to admin dashboard');
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        } else {
          throw new Error('User data not received');
        }
      } else {
        throw new Error(res.data.message || 'Login failed');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };



  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="w-96 shadow-lg border-green-200 border-2">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Login
                </CardTitle>
                <CardDescription className="text-green-100">Enter your credentials to access your account</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                        value={input.email}
                        onChange={changeEventHandler}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-green-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                        value={input.password}
                        onChange={changeEventHandler}
                        required
                      />
                    </div>
                  </div>

                  {/* Role Selection (Radio Buttons) */}
                  <div className="space-y-2">
                    <Label className="text-green-700">Select Role</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={input.role === "admin"}
                          onChange={changeEventHandler}
                          className="form-radio text-green-600 focus:ring-green-500"
                          required
                        />
                        <span className="text-green-700">Admin</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="role"
                          value="member"
                          checked={input.role === "member"}
                          onChange={changeEventHandler}
                          className="form-radio text-green-600 focus:ring-green-500"
                          required
                        />
                        <span className="text-green-700">Member</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div className="mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white" disabled={loading} >
                      {loading ? "Logging in..." : "Login"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center">
              <Separator className="my-4" />
              <p className="text-sm text-green-700">
                Don't have an account?{' '}
                <a href="/signup" className="text-green-600 hover:text-green-800 font-semibold">Sign up now</a>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

    </>
  );
};

export default Login;
