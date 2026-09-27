import { createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        user: null,
        numberOfBorrowedBooks: 0
    },
    reducers: {
        //actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            if (!action.payload) {
                state.user = null;
                return;
            }
            const userData = {
                ...action.payload,
                phoneNumber: action.payload.phoneNumber || (action.payload.profile?.phoneNumber || '')
            };
            state.user = userData;
        },
        setNumberOfBorrowedBooks: (state, action) => {
            state.numberOfBorrowedBooks = action.payload;
        },
        incrementBorrowedBooks: (state) => {
            state.numberOfBorrowedBooks += 1;
        },
        clearAuth: (state) => {
            state.user = null;
            state.loading = false;
            state.numberOfBorrowedBooks = 0;
        }
    }
});

export const { setLoading, setUser, setNumberOfBorrowedBooks, incrementBorrowedBooks, clearAuth } = authSlice.actions;
export default authSlice.reducer;