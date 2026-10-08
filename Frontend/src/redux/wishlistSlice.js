import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/api';
import { USER_API_END_POINT } from '../utils/constant';

// Async thunk for fetching wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${USER_API_END_POINT}/wishlist`);
      if (res.data.success) {
        return res.data.wishlist;
      }
      return rejectWithValue('Failed to fetch wishlist');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// Async thunk for adding to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await api.post(`${USER_API_END_POINT}/wishlist`, { bookId });
      if (res.data.success) {
        return res.data.wishlist;
      }
      return rejectWithValue(res.data.message || 'Failed to add to wishlist');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// Async thunk for removing from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`${USER_API_END_POINT}/wishlist/${bookId}`);
      if (res.data.success) {
        return { bookId, wishlist: res.data.wishlist };
      }
      return rejectWithValue(res.data.message || 'Failed to remove from wishlist');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: [],
    loading: false,
    error: null
  },
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.wishlist;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
