import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Books Card */}
        <Link 
          to="/admin/books" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Books</h2>
          <p className="text-gray-600">Add, edit, or remove PDF books from the library</p>
        </Link>

        {/* Manage Users Card */}
        <Link 
          to="/admin/users" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600">View and manage user accounts and their access</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
