import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../redux/authSlice';
import Navbar from '../components/shared/Navbar';

const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-2 border-green-200">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">
                Admin Dashboard
              </CardTitle>
              <p className="text-green-100">Welcome back, {user?.name || 'Admin'}!</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats Cards */}
                <Card className="p-4 border border-green-100 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-green-700 mb-2">Total Books</h3>
                  <p className="text-3xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-500 mt-2">Manage your library collection</p>
                </Card>
                
                <Card className="p-4 border border-green-100 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-green-700 mb-2">Active Users</h3>
                  <p className="text-3xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-500 mt-2">View and manage users</p>
                </Card>

                {/* Quick Actions */}
                <Card className="p-4 border border-green-100 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-green-700 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      Add New Book
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      View All Users
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      Manage Categories
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 border border-green-100 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-green-700 mb-4">Account</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      My Profile
                    </Button>
                    <Button 
                      className="w-full justify-start text-red-500 hover:text-red-600" 
                      variant="outline"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
