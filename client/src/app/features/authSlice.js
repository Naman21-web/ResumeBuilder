import { createSlice } from "@reduxjs/toolkit";

const getInitialToken = () => {
    try {
        const savedToken = localStorage.getItem('token');
        return savedToken || null;
    } catch (e) {
        return null;
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: getInitialToken(),
        user: null,
        loading: true
    },
    reducers: {
        login: (state,action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.token = '',
            state.user = null
            localStorage.removeItem('token')
        },
        setLoading: (state,action) => {
            state.loading = action.payload
        }
    }
});

export const {login,logout,setLoading} = authSlice.actions;

export default authSlice.reducer;