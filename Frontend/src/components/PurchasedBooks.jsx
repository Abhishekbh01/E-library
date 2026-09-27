import { useEffect, useState } from 'react';
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import BookCard from "./BookCard";
import { useDispatch, useSelector } from "react-redux";
import { setPurchasedBooks } from "../redux/bookSlice";
import axios from "axios";
import { BOOK_API_END_POINT } from "../utils/constant";
import { toast } from "react-toastify";

const PurchasedBooks = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { purchasedBooks } = useSelector(store => store.books);

    useEffect(() => {
        const fetchPurchasedBooks = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${BOOK_API_END_POINT}/getAllBorrowedBooks`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setPurchasedBooks(res.data.borrowedBooks || []));
                }
            } catch (error) {
                console.error("Error fetching purchased books:", error);
                toast.error(error.response?.data?.message || "Failed to load purchased books");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchasedBooks();
    }, [dispatch]);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="p-6 min-h-screen">
                <h2 className="text-2xl font-bold mb-6">📚 My Library</h2>
                {purchasedBooks && purchasedBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {purchasedBooks.map((book) => (
                            <BookCard 
                                key={book._id} 
                                book={book} 
                                isPurchased={true} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">You haven't borrowed any books yet.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default PurchasedBooks;
