import React, { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Bookmark,
  ShoppingCart,
  Eye,
  BookmarkCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

import RatingStars from "./ratingStars";
import PropTypes from "prop-types";
import { addToWishlist } from "../redux/wishlistSlice";

function BookCard({ book, isPurchased = false }) {

  // Handle both direct book object and nested bookId structure
  const bookData = book?.bookId || book;
  
  // Safe book object
  const safeBook = {
    _id: bookData?._id || "unknown",
    
    title:
      bookData?.title ||
      "Unknown Title",

    author:
      bookData?.author ||
      "Unknown Author",

    category:
      bookData?.category ||
      "Uncategorized",

    coverUrl:
    bookData?.coverImage ||
      bookData?.coverUrl ||
      "/placeholder-book-cover.jpg",

    rating:
    typeof bookData?.rating === "number" && !isNaN(bookData.rating)
    ? bookData.rating
    : 0,
    
    bookPrice:
    typeof bookData?.bookPrice === "number"
    ? bookData.bookPrice
    : 0,
    
    bookUrl:
      bookData?.bookUrl ||
      "Nothing",
      
      description:
      bookData?.description ||
      "No description available for this book.",
  };
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector(
    (state) => state.auth || {}
  );
  
  const { wishlist } = useSelector(
    (state) => state.wishlist || {}
  );
  console.log(wishlist);
  const isAlreadyInWishlist = wishlist?.find((item) => item._id === bookData._id);
  console.log(isAlreadyInWishlist);
  // Animation
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },

    visible: {
      y: 0,
      opacity: 1,

      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // ==========================================
  // BUY / SUBSCRIBE
  // ==========================================

  const handlePurchase = (type) => {

    if (
      !safeBook._id ||
      safeBook._id === "unknown"
    ) {
      toast.error("Book information is incomplete");
      return;
    }

    navigate("/payment", {
      state: {
        book: safeBook,
        paymentType: type,
      },
    });

    setIsDropdownOpen(false);
  };

  // ==========================================
  // OPEN PDF
  // ==========================================

  const handleOpenPDF = (pdfUrl) => {

    if (pdfUrl) {

      let finalUrl = pdfUrl;

      // Convert Cloudinary raw URL if required
      if (finalUrl.includes("/raw/upload/")) {
        finalUrl = finalUrl.replace(
          "/raw/upload/",
          "/image/upload/"
        );
      }

      navigate("/pdf-viewer", {
        state: {
          file: finalUrl,
          fileName:
            safeBook.title ||
            "document.pdf",
        },
      });

    } else {

      toast.error("No PDF URL available");

    }
  };

  // ==========================================
  // VIEW BOOK DETAILS
  // ==========================================

  const handleViewDetails = () => {

    if (
      !safeBook._id ||
      safeBook._id === "unknown"
    ) {
      toast.error("Book information is incomplete");
      return;
    }

    navigate("/book-details", {
      state: {
        book: safeBook,
      },
    });
  };

  // ==========================================
  // ADD TO WISHLIST
  // ==========================================

  const handleWishlist = async () => {

    if (!user) {
      toast.error("Please login to add books to wishlist");
      return;
    }

    if (
      !safeBook._id ||
      safeBook._id === "unknown"
    ) {
      toast.error("Book information is incomplete");
      return;
    }

    // Check if book is already in wishlist
    const alreadyInWishlist = wishlist?.some(
      (item) => item._id === safeBook._id
    );

    if (alreadyInWishlist) {
      toast.info(
        "Book is already in your wishlist ❤️"
      );
      return;
    }

    try {
      await dispatch(addToWishlist(safeBook._id)).unwrap();
      toast.success(
        "Book added to wishlist ❤️"
      );
    } catch (error) {
      toast.error(
        error || "Failed to add book to wishlist"
      );
    }
  };

  return (

    <motion.div
      variants={itemVariants}
      className="group relative"
      whileHover={{
        y: -3,
        transition: {
          duration: 0.2,
        },
      }}
    >

      <Card
        className="
          w-full
          overflow-hidden
          border
          shadow-sm
          transition-all
          duration-300
          hover:shadow-md
        "
      >

        {/* ==========================================
            BOOK IMAGE
        ========================================== */}

        <div
          className="
            relative
            aspect-[2/3]
            overflow-hidden
            bg-gray-100
          "
        >

          <img
            src={safeBook.coverUrl}
            alt={`Cover of ${safeBook.title}`}
            className="
              w-full
              h-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
            onError={(e) => {
              e.target.src =
                "/placeholder-book-cover.jpg";
            }}
          />

          {/* CATEGORY */}

          <div
            className="
              absolute
              bottom-0
              left-0
              w-full
              p-1
              bg-gradient-to-t
              from-black/70
              to-transparent
            "
          >

            <Badge
              variant="secondary"
              className="text-xs"
            >
              {safeBook.category}
            </Badge>

          </div>

          {/* ==========================================
              TOP BUTTONS
          ========================================== */}

          <div
            className="
              absolute
              top-1
              right-1
              flex
              items-center
              gap-2
            "
          >

            {/* WISHLIST */}

            <Button
              size="icon"
              variant="ghost"
              className="
                h-6
                w-6
                rounded-full
                bg-black/30
                text-white
                hover:bg-red-500
                hover:scale-110
                transition-all
                duration-200
              "
              aria-label="Add to wishlist"
              onClick={handleWishlist}
              disabled={isAlreadyInWishlist}
            >
              {isAlreadyInWishlist ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
            </Button>

            {/* PURCHASED / BUY */}

            {isPurchased ? (

              <div
                className="
                  h-6
                  px-2
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-green-600
                  text-white
                  text-xs
                  font-medium
                  cursor-pointer
                  hover:bg-green-700
                  transition-colors
                "
                onClick={() =>
                  handleOpenPDF(
                    safeBook.bookUrl
                  )
                }
              >
                Read Now
              </div>

            ) : (

              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >

                <DropdownMenuTrigger asChild>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="
                      h-6
                      w-6
                      rounded-full
                      bg-black/30
                      text-white
                      hover:bg-green-500
                      hover:scale-110
                      transition-all
                      duration-200
                    "
                    aria-label="Purchase option"
                    disabled={!user}
                  >
                    <ShoppingCart size={12} />
                  </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48"
                >

                  {/* BUY NOW */}

                  <DropdownMenuItem
                    onSelect={() =>
                      handlePurchase("Buy")
                    }
                    className="cursor-pointer"
                  >

                    <div className="flex flex-col">

                      <span className="font-medium">
                        Buy Now
                      </span>

                      <span className="text-xs text-gray-500">

                        {safeBook.bookPrice > 0
                          ? `₹${safeBook.bookPrice.toFixed(2)}`
                          : "Price Not Available"}

                      </span>

                    </div>

                  </DropdownMenuItem>

                  {/* SUBSCRIBE */}

                  <DropdownMenuItem
                    onSelect={() =>
                      handlePurchase("Subscribe")
                    }
                    className="cursor-pointer"
                  >

                    <div className="flex flex-col">

                      <span className="font-medium">
                        Subscribe for 10 days
                      </span>

                      <span className="text-xs text-gray-500">

                        {safeBook.bookPrice > 0
                          ? `₹${(
                              safeBook.bookPrice / 100
                            ).toFixed(2)}`
                          : "Price Not Available"}

                      </span>

                    </div>

                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            )}

          </div>

        </div>

        {/* ==========================================
            BOOK INFORMATION
        ========================================== */}

        <CardContent className="p-2">

          {/* TITLE */}

          <h3
            className="
              font-medium
              text-xs
              line-clamp-1
            "
            title={safeBook.title}
          >
            {safeBook.title}
          </h3>

          {/* AUTHOR */}

          <p
            className="
              text-xs
              text-gray-500
              line-clamp-1
            "
          >
            {safeBook.author}
          </p>

          {/* RATING */}

          <div
            className="
              mt-1
              flex
              items-center
              gap-1
            "
          >

            <RatingStars
              rating={safeBook.rating}
            />

            <span
              className="
                text-xs
                text-gray-500
              "
            >
              {safeBook.rating.toFixed(1)}
            </span>

          </div>

          {/* ==========================================
              VIEW DETAILS
          ========================================== */}

          <Button
            className="
              w-full
              mt-2
              h-8
              text-xs
            "
            onClick={handleViewDetails}
          >

            <Eye
              size={14}
              className="mr-1"
            />

            View Details

          </Button>

        </CardContent>

      </Card>

    </motion.div>
  );
}

// ==========================================
// PROP TYPES
// ==========================================

BookCard.propTypes = {

  book: PropTypes.shape({

    _id: PropTypes.string,

    title: PropTypes.string,

    author: PropTypes.string,

    category: PropTypes.string,

    coverUrl: PropTypes.string,

    coverImage: PropTypes.string,

    rating: PropTypes.number,

    bookPrice: PropTypes.number,

    bookUrl: PropTypes.string,

    description: PropTypes.string,

  }),

  isPurchased:
    PropTypes.bool,
};

// ==========================================
// DEFAULT PROPS
// ==========================================

BookCard.defaultProps = {

  book: {},

  isPurchased: false,

};

export default BookCard;