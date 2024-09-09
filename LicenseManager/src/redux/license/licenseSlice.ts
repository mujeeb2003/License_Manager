import {createSlice} from "@reduxjs/toolkit"
import type { licenseState } from "../../types"


const initialState:licenseState ={
    licenses: [],
    error: "",
    loading: false
} 
const licenseSlice = createSlice({
    initialState,
    name:`license`,
    reducers:{
    },
    extraReducers:(builder) => {
        
    }
})

export const licenseReducer = licenseSlice.reducer;