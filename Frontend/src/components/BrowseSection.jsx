import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import BookCard from "./BookCard";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import useGetAllBooks from "../hooks/useGetAllBooks";
import { useDispatch, useSelector } from "react-redux";

const BrowseSection = () => {
    useGetAllBooks();
    const { allBooks } = useSelector(store => store.books);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const userBorrowedBooks = user?.borrowedBooks || [];
    const navigate = useNavigate();
    
    const params = new URLSearchParams(location.search);
    const searchFromURL = params.get("q") || "";  // Extract search query
    const categoryFromURL = params.get("category") || "all"; // Extract category

    const [searchQuery, setSearchQuery] = useState(searchFromURL);
    const [category, setCategory] = useState(categoryFromURL);

    // Update state when URL params change
    useEffect(() => {
        setSearchQuery(searchFromURL);
        setCategory(categoryFromURL);
    }, [searchFromURL, categoryFromURL]);

    // Handle search input
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            navigate(`/browse?q=${searchQuery}&category=${category}`);
        }
    };

    // Filter books based on query & category
    const filteredBooks = Array.isArray(allBooks) ? allBooks.filter(book => {
        // Convert both IDs to strings for comparison to handle different ID formats
        const bookId = book._id ? book._id.toString() : '';
        const isPurchased = userBorrowedBooks.some(borrowedId => 
            borrowedId && borrowedId.toString() === bookId
        );
        return book.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (category === "all" || (book.category && book.category.toLowerCase() === category.toLowerCase()));
    }) : [];
    
    return (
        <>
            <Navbar />
            <div className="p-6">
                <div className="flex gap-4 mb-6">
                    <Input
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Select value={category} onValueChange={(val) => {
                        setCategory(val);
                        navigate(`/browse?q=${searchQuery}&category=${val}`);
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="fiction">Fiction</SelectItem>
                            <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                            <SelectItem value="science">Science & Tech</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <BookCard 
                                key={book._id} 
                                book={book} 
                                isPurchased={userBorrowedBooks.includes(book._id)}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-sm text-gray-500">No books found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BrowseSection;
