import {createSlice} from "@reduxjs/toolkit";
import type { userState } from "../../types";

const initialState:userState = {
    user:{
        user_id:0,
        email:'',
        username:'',
        password:''
    },
    loading:false,
    error:""
}

const userSlice = createSlice({
    initialState,
    name: `user`,
    reducers: {
    },
    extraReducers:(builder) => {
        
    },
})


export const userReducer = userSlice.reducer;

