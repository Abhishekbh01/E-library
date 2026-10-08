import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import BookCard from "../components/BookCard";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function Wishlist() {
  const dispatch = useDispatch();
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  // Fetch wishlist on component mount
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user?._id]);

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await dispatch(removeFromWishlist(bookId)).unwrap();
      toast.success("Book removed from wishlist");
    } catch (error) {
      toast.error(error || "Failed to remove book from wishlist");
    }
  };

  // Empty wishlist state
  if (!loading && (!wishlist || wishlist.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <Heart className="h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Your wishlist is empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Save books you love by clicking the heart icon on any book. They'll appear here.
            </p>
            <Button
              onClick={() => window.location.href = "/browse"}
              className="bg-green-600 hover:bg-green-700"
            >
              Browse Books
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-3">
              Error loading wishlist
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => dispatch(fetchWishlist())}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? "book" : "books"} saved
            </p>
          </div>
        </div>

        {/* Wishlist Books Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {wishlist.map((book) => (
            <div key={book._id} className="relative group">
              <BookCard book={book} />

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveFromWishlist(book._id)}
                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                title="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default Wishlist;
