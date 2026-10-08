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
import BookDetails from "./pages/BookDetails";
import EditBook from './pages/admin/EditBook';
import ManageUsers from './pages/admin/ManageUsers';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { Bounce, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPurchasedBooks } from './redux/bookSlice';
import { fetchWishlist, clearWishlist } from './redux/wishlistSlice';
import { BOOK_API_END_POINT } from './utils/constant';
import axios from 'axios';
import MemberProfile from './components/MemberProfile';
import UpdateProfile from './components/UpdateProfile';
import AddBook from './pages/admin/AddBook';
import Wishlist from './pages/Wishlist';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  // Fetch user's purchased/borrowed books and wishlist
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?._id) {
        try {
          // Fetch purchased/borrowed books
          const res = await axios.get(
            `${BOOK_API_END_POINT}/getAllBorrowedBooks`,
            {
              withCredentials: true
            }
          );

          if (res.data.success) {
            dispatch(
              setPurchasedBooks(
                res.data.borrowedBooks || []
              )
            );
          }
        } catch (error) {
          console.error(
            'Error fetching user books:',
            error
          );
        }

        // Fetch wishlist
        try {
          dispatch(fetchWishlist());
        } catch (error) {
          console.error(
            'Error fetching wishlist:',
            error
          );
        }
      } else {
        // Clear data when user logs out
        dispatch(setPurchasedBooks([]));
        dispatch(clearWishlist());
      }
    };

    fetchUserData();
  }, [user?._id, dispatch]);

  const appRouter = createBrowserRouter([
    
    // =========================
    // PUBLIC ROUTES
    // =========================

    {
      path: '/',
      element: <Home />
    },

    {
      path: '/login',
      element: <Login />
    },

    {
      path: '/signup',
      element: <Signup />
    },

    {
      path: '/browse',
      element: <BrowseSection />
    },

    // ⭐ NEW BOOK DETAILS ROUTE
    {
      path: '/book-details',
      element: <BookDetails />
    },

    {
      path: '/myLibrary',
      element: <PurchasedBooks />
    },

    {
      path: '/wishlist',
      element: <Wishlist />
    },

    {
      path: '/payment',
      element: <PaymentPage />
    },

    {
      path: '/pdf-viewer',
      element: <PDFViewerPage />
    },

    {
      path: '/profile',
      element: <MemberProfile />
    },

    {
      path: '/update-profile',
      element: <UpdateProfile />
    },

    // =========================
    // ADMIN ROUTES
    // =========================

    {
      path: '/admin',

      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),

      children: [

        {
          index: true,
          element: <Dashboard />
        },

        {
          path: 'dashboard',
          element: <Dashboard />
        },

        {
          path: 'books',
          element: <ManageBooks />
        },

        {
          path: 'books/new',
          element: <ManageBooks isNew />
        },

        {
          path: 'books/edit',
          element: <ManageBooks isEdit />
        },

        {
          path: 'books/edit/:id',
          element: <EditBook />
        },

        {
          path: 'users',
          element: <ManageUsers />
        },

        {
          path: 'books/add',
          element: <AddBook />
        }

      ],
    },

    // Admin Login
    {
      path: '/admin/login',
      element: <AdminLogin />
    },

    // =========================
    // 404 ROUTE
    // =========================

    {
      path: '*',
      element: <h1>404 Not Found</h1>
    }

  ]);

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
  );
}

export default App;