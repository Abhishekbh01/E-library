import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  BookOpen,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist } from "../redux/wishlistSlice";
import RatingInput from "../components/RatingInput";
import ReviewItem from "../components/ReviewItem";
import RatingSummary from "../components/RatingSummary";
import { REVIEWS_API_END_POINT, BOOK_API_END_POINT } from "../utils/constant";
import axios from "axios";

function BookDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [wishlistState, setWishlistState] = React.useState(false);

  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  // Rating and Review states
  const [userRating, setUserRating] = useState(null);
  const [userReview, setUserReview] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);

  // Get book data from location state or fetch from backend
  const initialBook = location.state?.book;
  const bookIdFromURL = new URLSearchParams(location.search).get("bookId");

  // Fetch complete book data from backend
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setBookLoading(true);
        const bookId = initialBook?._id || bookIdFromURL;

        console.log("Fetching book with ID:", bookId);
        console.log("Initial book from state:", initialBook);

        if (!bookId) {
          console.error("No book ID found");
          toast.error("Book ID is missing");
          setBookLoading(false);
          return;
        }

        const res = await axios.get(
          `${BOOK_API_END_POINT}/get/${bookId}`,
          { withCredentials: true }
        );

        console.log("Book fetched successfully:", res.data.book);

        if (res.data.success) {
          setBook(res.data.book);
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Failed to load book details");
      } finally {
        setBookLoading(false);
      }
    };

    fetchBook();
  }, [initialBook?._id, bookIdFromURL]);

  useEffect(() => {
    const isWishlist = () => {
      return wishlist?.some(
        (item) => item._id === book?._id
      );
    };

    setWishlistState(isWishlist());
  }, [wishlist, book]);

  // Fetch reviews when book loads
  useEffect(() => {
    if (book?._id) {
      fetchReviews();
      if (user?._id) {
        fetchUserRating();
      }
    }
  }, [book?._id, user?._id]);

  // Fetch all reviews for the book
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await axios.get(
        `${REVIEWS_API_END_POINT}/getAll/${book._id}`
      );
      if (res.data.success) {
        setAllReviews(res.data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch current user's rating for this book
  const fetchUserRating = async () => {
    try {
      const res = await axios.get(
        `${REVIEWS_API_END_POINT}/my-rating/${book._id}`,
        { withCredentials: true }
      );
      if (res.data.success && res.data.review) {
        setUserRating(res.data.review.rating);
        setUserReview(res.data.review.comment || "");
        setIsEditingReview(true);
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  };

  // Submit or update review
  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please login to rate this book");
      return;
    }

    if (!userRating || userRating < 1 || userRating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    if (!book?._id) {
      toast.error("Book information is incomplete");
      return;
    }

    console.log("Submitting review for book:", book._id);
    console.log("Rating:", userRating);
    console.log("Review:", userReview);

    setIsSubmittingReview(true);
    try {
      const res = await axios.post(
        `${REVIEWS_API_END_POINT}/add/${book._id}`,
        { rating: userRating, comment: userReview },
        { withCredentials: true }
      );

      console.log("Review response:", res.data);

      if (res.data.success) {
        toast.success(
          isEditingReview
            ? "Review updated successfully"
            : "Review added successfully"
        );
        setUserRating(res.data.review.rating);
        setUserReview(res.data.review.comment || "");
        setIsEditingReview(true);
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Quick rating submission (rating only, no review)
  const handleQuickRating = async () => {
    if (!user) {
      toast.error("Please login to rate this book");
      return;
    }

    if (!userRating || userRating < 1 || userRating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    if (!book?._id) {
      toast.error("Book information is incomplete");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await axios.post(
        `${REVIEWS_API_END_POINT}/add/${book._id}`,
        { rating: userRating, comment: "" },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Rating saved successfully");
        setUserRating(res.data.review.rating);
        setIsEditingReview(true);
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(
        error.response?.data?.message || "Failed to save rating"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      const res = await axios.delete(
        `${REVIEWS_API_END_POINT}/delete/${reviewId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Review deleted successfully");
        setUserRating(null);
        setUserReview("");
        setIsEditingReview(false);
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Edit review
  const handleEditReview = (review) => {
    setUserRating(review.rating);
    setUserReview(review.comment || "");
    setIsEditingReview(true);
  };
  
  // ==========================================
  // BOOK NOT FOUND / LOADING
  // ==========================================

  if (bookLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">

        <BookOpen
          className="h-16 w-16 text-gray-400 mb-4"
        />

        <h1 className="text-2xl font-bold mb-4">
          Book not found
        </h1>

        <p className="text-gray-500 mb-6 text-center">
          The book information is not available.
          Please go back and select a book again.
        </p>

        <Button
          onClick={() => navigate("/browse")}
        >
          Back to Browse
        </Button>

      </div>
    );
  }

  // ==========================================
  // ADD TO WISHLIST
  // ==========================================

  const handleWishlist = async () => {

    if (!user) {
      toast.error("Please login to add books to wishlist");
      return;
    }

    if (!book._id || book._id === "unknown") {
      toast.error("Book information is incomplete");
      return;
    }

    // Check if book is already in wishlist
    const alreadyInWishlist = wishlist?.some(
      (item) => item._id === book._id
    );

    if (alreadyInWishlist) {
      toast.info(
        "Book is already in your wishlist ❤️"
      );
      return;
    }

    try {
      await dispatch(addToWishlist(book._id)).unwrap();
      toast.success(
        "Book added to wishlist ❤️"
      );
    } catch (error) {
      toast.error(
        error || "Failed to add book to wishlist"
      );
    }
  };

  // ==========================================
  // BUY BOOK
  // ==========================================

  const handleBuy = () => {

    navigate("/payment", {
      state: {
        book: book,
        paymentType: "Buy",
      },
    });
  };

  // ==========================================
  // SUBSCRIBE
  // ==========================================

  const handleSubscribe = () => {

    navigate("/payment", {
      state: {
        book: book,
        paymentType: "Subscribe",
      },
    });
  };

  // ==========================================
  // RATING
  // ==========================================

  const rating =
    typeof book.rating === "number"
      ? book.rating
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ======================================
            BACK BUTTON
        ====================================== */}

        <Button
          variant="outline"
          className="mb-8"
          onClick={() => navigate("/browse")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>

        {/* ======================================
            BOOK DETAILS
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10">

          <div className="grid md:grid-cols-2 gap-10">

            {/* ==================================
                BOOK IMAGE
            ================================== */}

            <div className="flex justify-center">

              <div className="relative">

                <img
                  src={
                    book.coverImage ||
                    book.coverUrl ||
                    "/placeholder-book-cover.jpg"
                  }
                  alt={book.title || "Book cover"}
                  className="
                    w-72
                    h-[420px]
                    object-cover
                    rounded-xl
                    shadow-lg
                  "
                  onError={(e) => {
                    e.target.src =
                      "/placeholder-book-cover.jpg";
                  }}
                />

                {/* Category Badge */}

                <div
                  className="
                    absolute
                    top-3
                    left-3
                    bg-green-600
                    text-white
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                  "
                >
                  {book.category ||
                    "Uncategorized"}
                </div>

              </div>

            </div>

            {/* ==================================
                BOOK INFORMATION
            ================================== */}

            <div className="flex flex-col">

              {/* CATEGORY */}

              <p className="text-green-600 font-semibold mb-2">
                {book.category ||
                  "Uncategorized"}
              </p>

              {/* TITLE */}

              <h1
                className="
                  text-3xl
                  md:text-4xl
                  font-bold
                  mb-3
                  text-gray-900
                "
              >
                {book.title ||
                  "Unknown Title"}
              </h1>

              {/* AUTHOR */}

              <p className="text-lg text-gray-600 mb-5">
                By{" "}
                <span className="font-medium">
                  {book.author ||
                    "Unknown Author"}
                </span>
              </p>

              {/* ==================================
                  RATING
              ================================== */}

              <div className="flex items-center gap-2 mb-6">

                <div className="flex items-center">
                  {user ? (
                    // Interactive stars for logged-in users
                    <RatingInput
                      rating={userRating || 0}
                      setRating={setUserRating}
                      size={18}
                    />
                  ) : (
                    // Static stars for non-logged-in users
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={18}
                            className={
                              star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        )
                      )}
                    </div>
                  )}
                </div>

                <span className="text-gray-600 text-sm">
                  {rating.toFixed(1)} / 5
                  {userRating && (
                    <span className="ml-2 text-green-600">
                      (Your rating: {userRating}/5)
                    </span>
                  )}
                </span>

                {user && (
                  <Button
                    size="sm"
                    onClick={handleQuickRating}
                    disabled={isSubmittingReview || !userRating}
                    className="ml-4"
                  >
                    {isSubmittingReview ? "Saving..." : "Save"}
                  </Button>
                )}

              </div>

              {/* ==================================
                  DESCRIPTION
              ================================== */}

              <div className="mb-6">

                <h2 className="text-xl font-semibold mb-2">
                  About this book
                </h2>

                <p className="text-gray-600 leading-7">
                  {book.description ||
                    "No description available for this book."}
                </p>

              </div>

              {/* ==================================
                  PRICE
              ================================== */}

              <div className="mb-6">

                <p className="text-sm text-gray-500 mb-1">
                  Price
                </p>

                <h2 className="text-3xl font-bold text-gray-900">
                  ₹
                  {typeof book.bookPrice ===
                  "number"
                    ? book.bookPrice.toFixed(2)
                    : "0.00"}
                </h2>

              </div>

              {/* ==================================
                  ACTION BUTTONS
              ================================== */}

              <div className="flex flex-wrap gap-3">

                {/* BUY */}

                <Button
                  className="
                    bg-green-600
                    hover:bg-green-700
                  "
                  onClick={handleBuy}
                >
                  <ShoppingCart
                    className="mr-2 h-4 w-4"
                  />
                  Buy Now
                </Button>

                {/* SUBSCRIBE */}

                <Button
                  variant="outline"
                  onClick={handleSubscribe}
                >
                  <BookOpen
                    className="mr-2 h-4 w-4"
                  />
                  Subscribe
                </Button>

                {/* WISHLIST */}

                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  disabled={wishlistState}
                  className={wishlistState ? "bg-red-500 text-white" : ""}
                >
                  <Heart
                    className={`mr-2 h-4 w-4`}
                  />
                  {wishlistState ? "Added to Wishlist" : "Add to Wishlist"}
                </Button>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            RATINGS & REVIEWS SECTION
        ====================================== */}

        <div className="mt-8 space-y-6">

          {/* Rating Summary */}
          <RatingSummary
            averageRating={book.rating || 0}
            ratingCount={book.totalRatings || 0}
            reviews={allReviews}
          />

          {/* User's Rating & Review Section */}
          {user ? (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isEditingReview ? "Your Rating & Review" : "Rate this Book"}
              </h3>

              <div className="space-y-4">
                {/* Rating Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <RatingInput
                    rating={userRating || 0}
                    setRating={setUserRating}
                    size={32}
                  />
                </div>

                {/* Review Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview || !userRating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmittingReview
                      ? "Submitting..."
                      : isEditingReview
                      ? "Update Review"
                      : "Submit Review"}
                  </Button>

                  {isEditingReview && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserRating(null);
                        setUserReview("");
                        setIsEditingReview(false);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">
                Please login to rate and review this book
              </p>
              <Button onClick={() => navigate("/login")}>Login</Button>
            </div>
          )}

          {/* All Reviews */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              All Reviews ({allReviews.length})
            </h3>

            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : allReviews.length > 0 ? (
              <div>
                {allReviews.map((review) => (
                  <ReviewItem
                    key={review._id}
                    review={review}
                    isOwnReview={
                      user && review.userId?._id === user._id
                    }
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this book!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default BookDetails;