import axios from "axios";
import { useDispatch } from "react-redux"
import { toast } from "react-toastify";
import { BOOK_API_END_POINT } from "../utils/constant";
import { setPurchasedBooks } from "../redux/bookSlice";
import { useEffect } from "react";

const getAllPurchasedBooks = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get(`${BOOK_API_END_POINT}/getAllBorrowedBooks`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setPurchasedBooks(res.data.borrowedBooks));
                }
            } catch (error) {
                toast(error.response.data.message);
            }
        }
        fetchAllBooks();
    })
}
export default getAllPurchasedBooks;