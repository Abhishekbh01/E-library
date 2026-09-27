import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiBook, FiUsers, FiShoppingBag, FiHome } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../../redux/authSlice';
import api from '../../utils/api';
import Navbar from '../shared/Navbar';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Clear any stored tokens first to ensure user is logged out even if API call fails
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Clear user data from localStorage
      localStorage.removeItem('user');
      
      // Clear Redux auth state
      dispatch(clearAuth());
      
      try {
        // Make the API call to logout
        await api.get('/user/logout');
        toast.success('Successfully logged out');
      } catch (error) {
        console.error('Logout API error:', error);
        // Still proceed with logout even if API call fails
      }
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, we should still navigate to login
      navigate('/login');
      toast.error('You have been logged out');
    }
  };

  // Check if current route is active
  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-100 text-indigo-600' : 'text-gray-700';
  };

  return (
    <>
    <Navbar />
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                <Link
                  to="/admin"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin')} hover:bg-gray-100 hover:text-indigo-600`}
                >
                  <FiHome className="mr-3 h-6 w-6" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/books"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/books')} hover:bg-gray-100 hover:text-indigo-600`}
                >
                  <FiBook className="mr-3 h-6 w-6" />
                  Manage Books
                </Link>
                <Link
                  to="/admin/users"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive('/admin/users')} hover:bg-gray-100 hover:text-indigo-600`}
                >
                  <FiUsers className="mr-3 h-6 w-6" />
                  Manage Users
                </Link>

              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div>
                    <FiLogOut className="h-6 w-6 text-gray-500 group-hover:text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                      Logout
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-indigo-600"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
          <div className="px-4 pb-3 flex space-x-4 overflow-x-auto">
            <NavLink to="/admin" icon={<FiHome />} text="Dashboard" />
            <NavLink to="/admin/books" icon={<FiBook />} text="Books" />
            <NavLink to="/admin/users" icon={<FiUsers />} text="Users" />
            <NavLink to="/admin/orders" icon={<FiShoppingBag />} text="Orders" />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  );
};

// Helper component for mobile navigation links
const NavLink = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex flex-col items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
      }`}
    >
      {React.cloneElement(icon, {
        className: `h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`
      })}
      <span className="mt-1 text-xs">{text}</span>
    </Link>
  );
};

export default AdminLayout;
