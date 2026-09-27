import React, { useEffect, useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  User, Lock, Mail, UserPlus, ArrowRight,
  CheckCircle, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../redux/store';
import { setLoading } from '../../redux/authSlice';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const { loading } = useSelector(store => store.auth);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setInput(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.phoneNumber || !input.email || !input.password || !input.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const userData = {
      fullname: input.fullname,
      phoneNumber: input.phoneNumber,
      email: input.email,
      password: input.password,
      role: input.role,
    };

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        setStep(3);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-96 shadow-lg border-green-200 border-2">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <UserPlus className="h-6 w-6" />
                  Sign Up
                </CardTitle>
                <CardDescription className="text-green-100">
                  Create your account to get started
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="pt-6">
              {step === 3 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center text-green-600 text-lg font-semibold"
                >
                  🎉 Registration successful! Redirecting to login...
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {step === 1 ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="fullname" className="text-green-700">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                          <Input
                            id="fullname"
                            name="fullname"
                            placeholder="Abhi Basotra"
                            className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                            value={input.fullname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-green-700">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="1234567890"
                            className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                            value={input.phoneNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-green-700">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                            value={input.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-green-700">Role</Label>
                        <Select name="role" value={input.role} onValueChange={handleRoleChange} required>
                          <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <motion.div className="mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-green-700">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                            value={input.password}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-green-700">Confirm Password</Label>
                        <div className="relative">
                          <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                            value={input.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="checkbox"
                          id="terms"
                          className="rounded border-green-300 text-green-600 focus:ring-green-500"
                          required
                        />
                        <label htmlFor="terms" className="text-sm text-green-700">
                          I agree to the <a href="#" className="text-green-600 hover:text-green-800">Terms of Service</a> and <a href="#" className="text-green-600 hover:text-green-800">Privacy Policy</a>
                        </label>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 bg-white border-green-500 text-green-500 hover:bg-green-50"
                        >
                          Back
                        </Button>
                        <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                            disabled={loading}
                          >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                            <UserPlus className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </form>
              )}
            </CardContent>

            <CardFooter className="flex flex-col items-center">
              <Separator className="my-4" />
              <p className="text-sm text-green-700">
                Already have an account?{' '}
                <a href="/login" className="text-green-600 hover:text-green-800 font-semibold">
                  Login here
                </a>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
