import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { userState } from "../../types";
import axios from "axios";

const initialState:userState = {
    user:{
        user_id:0,
        email:'',
        username:'',
    },
    isAdmin:false,
    isSuperAdmin:false,
    loading:false,
    error:""
}

export const userLogin = createAsyncThunk('user/userLogin', async (credentials: { email: string, password: string }, { rejectWithValue }) => {
    try {
        const res = await axios.post("/api/user/login", credentials);
        return res.data;
    } catch (err: any) {
        if (err.response && err.response.data) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue({ error: 'Something went wrong' });
    }
});

export const userSignup = createAsyncThunk('user/userSignup', async (credentials: { email: string, password: string, username: string }, { rejectWithValue }) => {
    try {
        const res = await axios.post("/api/user/register", credentials);
        return res.data;
    } catch (err: any) {
        if (err.response && err.response.data) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue({ error: 'Something went wrong' });
    }
});

export const getLoggedinUser = createAsyncThunk('user/getLoggedinUser', async (_undefined, { rejectWithValue }) => {
    try {
        const res = await axios.get("/api/user/getLoggedinUser");
        return res.data;
    } catch (err: any) {
        if (err.response && err.response.data) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue({ error: 'Something went wrong' });
    }
})

export const logoutUser = createAsyncThunk('user/logoutUser',async (_undefined,{rejectWithValue})=>{
    try {
        const res = await axios.get("/api/user/logoutUser");
        console.log("from redux",res);
        return res.data;
    } catch (err: any) {
        if (err.response && err.response.data) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue({ error: 'Something went wrong' });
    }

})

const userSlice = createSlice({
    initialState,
    name: `user`,
    reducers: {
    },
    extraReducers:(builder) => {
        builder.addCase(userLogin.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(userLogin.fulfilled,(state,{payload})=>{
            state.loading=false;
            console.log(payload.user)
            state.user=payload.user;
            state.isAdmin = payload.user.isAdmin;
            state.isSuperAdmin = payload.user.isSuperAdmin;
        })
        builder.addCase(userLogin.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(userSignup.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(userSignup.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.user=payload.user
        })
        builder.addCase(userSignup.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(getLoggedinUser.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(getLoggedinUser.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.user=payload.user
        })
        builder.addCase(getLoggedinUser.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(logoutUser.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(logoutUser.fulfilled,(state,{payload})=>{
            state.loading=false;

        })
        builder.addCase(logoutUser.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
    },
})


export const userReducer = userSlice.reducer;



