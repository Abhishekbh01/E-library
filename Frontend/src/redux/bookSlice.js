import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/api';
import { BOOK_API_END_POINT } from '../utils/constant';

// Async thunk for deleting a book
export const deleteBook = createAsyncThunk(
  'book/deleteBook',
  async (bookId, { rejectWithValue, getState }) => {
    try {
      await api.get(`${BOOK_API_END_POINT}/delete/${bookId}`);
      return bookId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete book');
    }
  }
);

const bookSlice = createSlice({
    name: 'book',
    initialState: {
        loading: false,
        allBooks: [],
        searchQuery: "",
        purchasedBooks: [],
        error: null
    },
    reducers: {
        //actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setBooks: (state, action) => {
            state.allBooks = action.payload;
        },
        setPurchasedBooks: (state, action) => {
            state.purchasedBooks = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        removeBook: (state, action) => {
            state.allBooks = state.allBooks.filter(book => book._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.loading = false;
                // Remove from allBooks
                state.allBooks = state.allBooks.filter(book => book._id !== action.payload);
                // Also remove from purchasedBooks if it exists there
                state.purchasedBooks = state.purchasedBooks.filter(bookId => bookId !== action.payload);
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
 });

 export const { setLoading, setBooks, setPurchasedBooks, setSearchQuery } = bookSlice.actions;
 export default bookSlice.reducer;