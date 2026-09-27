import { useDispatch } from "react-redux";
import { setNumberOfBorrowedBooks } from "../redux/authSlice";
import { useEffect } from "react";

const getNumberOfBorrowedbooks = async() => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/borrowedBooks`, {withCredentials: true});
                if(res.data.success){
                    dispatch(setNumberOfBorrowedBooks(res.data.borrowedBooks.length));
                }
            } catch (error) {
                toast(error.response.data.message);
            }
        }
        fetchAllBooks();
    })
  }
  export default getNumberOfBorrowedbooks;