import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { userState } from "../../types";
import axios from "axios";

const initialState:userState = {
    user:{
        user_id:0,
        email:'',
        username:'',
        isAdmin:false,
        isSuperAdmin:false,
        isDisable:false
    },
    users:[],
    isAdmin:false,
    isSuperAdmin:false,
    loading:false,
    error:""
}
const API_URI = import.meta.env.VITE_API_URL || "/api";
export const userLogin = createAsyncThunk('user/userLogin', async (credentials: { email: string, password: string }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URI}/user/login`, credentials);
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
        const res = await axios.post(`${API_URI}/user/register`, credentials);
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
        const res = await axios.get(`${API_URI}/user/getLoggedinUser`);
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
        const res = await axios.get(`${API_URI}/user/logoutUser`);
        // console.log("from redux",res);
        return res.data;
    } catch (err: any) {
        if (err.response && err.response.data) {
            return rejectWithValue(err.response.data);
        }
        return rejectWithValue({ error: 'Something went wrong' });
    }

})


export const toggleDisable = createAsyncThunk('user/toggleDisable',async (credentials:{user_id:number},{rejectWithValue})=>{
    try {
        const res = await axios.post(`${API_URI}/user/toggleDisable`,credentials);
        return res.data;
    } catch (error:any) {

        if(error.response && error.response.data) return rejectWithValue(error.response.data);
        rejectWithValue({error:error.message});

    }
})

export const toggleAdmin = createAsyncThunk('user/toggleAdmin',async (credentials:{user_id:number},{rejectWithValue})=>{
    try {
        const res = await axios.post(`${API_URI}/user/toggleAdmin`,credentials);
        return res.data;
    } catch (error:any) {

        if(error.response && error.response.data) return rejectWithValue(error.response.data);
        rejectWithValue({error:error.message});

    }
})

export const resetPassword = createAsyncThunk('user/resetPassword',async (credentials:{user_id:number,password:string},{rejectWithValue})=>{
    try {
        const res = await axios.post(`${API_URI}/user/resetPassword`,credentials);
        return res.data;
    } catch (error:any) {

        if(error.response && error.response.data) return rejectWithValue(error.response.data);
        rejectWithValue({error:error.message});

    }
})

export const getAllUsers = createAsyncThunk('user/getAllUsers',async (_undefined,{rejectWithValue})=>{
    try {
        const res = await axios.get(`${API_URI}/user/getAllUsers`);
        return res.data;
    } catch (error:any) {
        if(error.response && error.response.data) return rejectWithValue(error.response.data);
        rejectWithValue({error:error.message});

    }
})

export const updateUser = createAsyncThunk('user/updateUser',async (credentials:{user_id:number,password?:string,username?:string},{rejectWithValue})=>{
    try {
        const res = await axios.post(`${API_URI}/user/updateUser`,credentials);
        return res.data;
    } catch (error:any) {

        if(error.response && error.response.data) return rejectWithValue(error.response.data);
        rejectWithValue({error:error.message});

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
            // console.log(payload.user)
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
        builder.addCase(userSignup.fulfilled,(state,{})=>{
            state.loading=false;
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
            // console.log(payload);
            state.user=payload.user;
            state.isAdmin = payload.user.isAdmin;
            state.isSuperAdmin = payload.user.isSuperAdmin;
        })
        builder.addCase(getLoggedinUser.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(logoutUser.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(logoutUser.fulfilled,(state,{})=>{
            state.loading=false;

        })
        builder.addCase(logoutUser.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(toggleDisable.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(toggleDisable.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.users.forEach((user)=>{
                user.user_id === payload.user.user_id ? user.isDisable = payload.user.isDisable : null
            });
        })
        builder.addCase(toggleDisable.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(toggleAdmin.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(toggleAdmin.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.users.forEach((user)=>{
                user.user_id === payload.user.user_id ? user.isAdmin = payload.user.isAdmin : null
            });
        })
        builder.addCase(toggleAdmin.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(resetPassword.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(resetPassword.fulfilled,(state,{})=>{
            state.loading=false;
            
        })
        builder.addCase(resetPassword.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(updateUser.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(updateUser.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.user = payload.user;
        })
        builder.addCase(updateUser.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(getAllUsers.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(getAllUsers.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.users = payload.users;
        })
        builder.addCase(getAllUsers.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
    },
})


export const userReducer = userSlice.reducer;
