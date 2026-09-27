import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bookmark, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import RatingStars from "./ratingStars";

// Add prop-types validation at the top of the file
import PropTypes from 'prop-types';

function BookCard({ book, isPurchased = false }) {
  // Handle both direct book object and nested bookId structure from borrowed books
  const bookData = book?.bookId || book;

  const safeBook = {
    _id: bookData?._id || 'unknown',
    title: bookData?.title || 'Unknown Title',
    author: bookData?.author || 'Unknown Author',
    category: bookData?.category || 'Uncategorized',
    coverUrl: bookData?.coverImage || bookData?.coverUrl || '/placeholder-book-cover.jpg',
    rating: typeof bookData?.rating === 'number' ? bookData.rating : 0,
    bookPrice: typeof bookData?.bookPrice === 'number' ? bookData.bookPrice : 0,
    bookUrl: bookData?.bookUrl || 'Nothing'
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const handlePurchase = (type) => {
    if (!safeBook._id || safeBook._id === 'unknown') {
      toast.error('Book information is incomplete');
      return;
    }

    // Navigate to payment page with book and payment type
    navigate('/payment', {
      state: {
        book: safeBook,
        paymentType: type
      }
    });

    setIsDropdownOpen(false);
  };
  const handleOpenPDF = (pdfUrl) => {
    
    if (pdfUrl) {
      let finalUrl = pdfUrl;
      if (finalUrl.includes('/raw/upload/')) {
        finalUrl = finalUrl.replace('/raw/upload/', '/image/upload/');
      }
      
      // Navigate to the PDF viewer page with the PDF data
      navigate('/pdf-viewer', {
        state: {
          file: finalUrl,
          fileName: safeBook.title || 'document.pdf'
        }
      });
    } else {
      toast.error('No PDF URL available');
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group relative"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <Card className="w-full overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
          <img
            src={safeBook.coverUrl}
            alt={`Cover of ${safeBook.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = '/placeholder-book-cover.jpg';
            }}
          />
          <div className="absolute bottom-0 left-0 w-full p-1 bg-gradient-to-t from-black/70 to-transparent">
            <Badge variant="secondary" className="text-xs">
              {safeBook.category}
            </Badge>
          </div>

          <div className="absolute top-1 right-1 flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 rounded-full bg-black/30 text-white hover:bg-green-500 hover:scale-110 transition-all duration-200"
              aria-label="Bookmark this book"
            >
              <Bookmark size={12} />
            </Button>

            {isPurchased ? (
              <div
                className="h-6 px-2 flex items-center justify-center rounded-full bg-green-600 text-white text-xs font-medium cursor-pointer hover:bg-green-700 transition-colors"
                onClick={() => handleOpenPDF(safeBook.bookUrl)}
              >
                read now
              </div>
            ) : (
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 rounded-full bg-black/30 text-white hover:bg-green-500 hover:scale-110 transition-all duration-200"
                    aria-label="Purchase option"
                    disabled={!user}
                  >
                    <ShoppingCart size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onSelect={() => handlePurchase('Buy')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">Buy Now</span>
                      <span className="text-xs text-gray-500">
                        {safeBook.bookPrice > 0 ? `$${safeBook.bookPrice.toFixed(2)}` : 'Price Not Available'}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handlePurchase('Subscribe')}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">Subscribe for 10 days</span>
                      <span className="text-xs text-gray-500">
                        {safeBook.bookPrice > 0 ? `$${(safeBook.bookPrice / 100).toFixed(2)}` : 'Price Not Available'}
                      </span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <CardContent className="p-2">
          <h3 className="font-medium text-xs line-clamp-1" title={safeBook.title}>
            {safeBook.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-1">{safeBook.author}</p>
          <div className="mt-1 flex items-center gap-1">
            <RatingStars rating={safeBook.rating} />
            <span className="text-xs text-gray-500">
              {safeBook.rating.toFixed(1)}
            </span>
          </div>
        </CardContent>
      </Card>
      

    </motion.div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
    coverUrl: PropTypes.string,
    rating: PropTypes.number,
    bookPrice: PropTypes.number,
  }),
  isPurchased: PropTypes.bool,
};

BookCard.defaultProps = {
  book: {},
  isPurchased: false,
};

export default BookCard;