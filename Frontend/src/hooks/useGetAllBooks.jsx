import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBooks } from '../redux/bookSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { clearAuth, setUser } from '../redux/authSlice';

const useGetAllBooks = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const loginToastShown = useRef(false);

    const fetchBooks = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/book/getAll', {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (data.success) {
                dispatch(setBooks(data.books || []));
            } else {
                throw new Error(data.message || 'Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            
            // Don't show error toast for unauthenticated users
            if (error.response?.status === 401) {
                dispatch(clearAuth());
                if (!loginToastShown.current) {
                    console.error('Please login again');
                    loginToastShown.current = true;
                }
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to fetch books. Please try again later.');
            }
        }
    }, []);

    useEffect(() => {
        // Fetch books on component mount and when user logs in
        fetchBooks();
    }, [fetchBooks, user]); // Add user to dependency array to refetch when user logs in

    return { refetch: fetchBooks };
};

export default useGetAllBooks;