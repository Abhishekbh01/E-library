import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Login from './components/auth/Login';
import Home from './components/Home';
import Signup from './components/auth/Signup';
import BrowseSection from './components/BrowseSection';
import PurchasedBooks from './components/PurchasedBooks';
import PaymentPage from './pages/PaymentPage';
import PDFViewerPage from './pages/PDFViewerPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageBooks from './pages/admin/ManageBooks';
import EditBook from './pages/admin/EditBook';
import ManageUsers from './pages/admin/ManageUsers';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { Bounce, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPurchasedBooks } from './redux/bookSlice';
import { BOOK_API_END_POINT } from './utils/constant';
import axios from 'axios';
import MemberProfile from './components/MemberProfile';
import UpdateProfile from './components/UpdateProfile';
import AddBook from './pages/admin/AddBook';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  // Fetch user's purchased/borrowed books when the app loads and when user changes
  useEffect(() => {
    const fetchUserBooks = async () => {
      if (user?._id) { // Only fetch if user is logged in
        try {
          const res = await axios.get(`${BOOK_API_END_POINT}/getAllBorrowedBooks`, { 
            withCredentials: true 
          });
          if (res.data.success) {
            dispatch(setPurchasedBooks(res.data.borrowedBooks || []));
          }
        } catch (error) {
          console.error('Error fetching user books:', error);
        }
      } else {
        // Clear books when user logs out
        dispatch(setPurchasedBooks([]));
      }
    };

    fetchUserBooks();
  }, [user?._id, dispatch]);
  const appRouter = createBrowserRouter([
    // Public routes
    { path: '/', element: <Home /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/browse', element: <BrowseSection /> },
    { path: '/myLibrary', element: <PurchasedBooks /> },
    { path: '/payment', element: <PaymentPage /> },
    { path: '/pdf-viewer', element: <PDFViewerPage /> },
    { path: '/profile', element: <MemberProfile /> },
    { path: '/update-profile', element: <UpdateProfile /> },
    
    // Admin routes
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'books', element: <ManageBooks /> },
        { path: 'books/new', element: <ManageBooks isNew /> },
        { path: 'books/edit', element: <ManageBooks isEdit /> },
        { path: 'books/edit/:id', element: <EditBook /> },
        { path: 'users', element: <ManageUsers /> },
        { path: 'books/add', element: <AddBook/> },
      ],
    },
    {
      path: '/admin/login',
      element: <AdminLogin />
    },
    
    // 404 route - must be the last one
    { path: '*', element: <h1>404 Not Found</h1> }
  ])
  return (
    <div className='overflow-hidden m-0 p-0 box-border'>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App