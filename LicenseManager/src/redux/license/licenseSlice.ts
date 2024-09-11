import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import type { categoryForm, licenseForm, licenseState, vendorForm } from "../../types"
import axios from "axios"

const initialState:licenseState ={
    licenses: [],
    categories: [],
    status: [],
    vendors: [],
    error: "",
    loading: false
} 

export const getLicenses = createAsyncThunk("license/getLicenses",async (_undefined,{rejectWithValue})=>{
    try {
        const res = await axios.get("/api/license/getLicenses");
        return res.data;
    } catch (error:any) {
        if(error.response && error.response.data) return rejectWithValue(error.response.data);
        
        return rejectWithValue({error:error.message});
    }
})

export const getLicenseOpt = createAsyncThunk("license/getLicenseOpt",async(_undefined,{rejectWithValue})=>{
    try {
        const res = await axios.get("/api/getLicenseopt");
        return res.data;
    } catch (error:any) {
        if(error.response && error.response.data) return rejectWithValue(error.response.data);
        
        return rejectWithValue({error:error.message});
    }
})

export const createLicense = createAsyncThunk("license/createLicense",async(data:licenseForm,{rejectWithValue})=>{
    console.log("data from slice ",data);
    try {
        const res = await axios.post("/api/license/createLicense",data);
        return res.data;
    } catch (error:any) {
        if(error.response & error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({error:error.message});
    }
})

export const createCategory = createAsyncThunk("license/createCategory", async(data:categoryForm,{rejectWithValue})=>{
    try {
        const res = await axios.post("/api/createCategory",data);
        return res.data
    } catch (error:any) {

        if(error.response && error.response.data ) return rejectWithValue(error.response.data);

        return rejectWithValue({error:error.message});
    }
})

export const createVendor = createAsyncThunk("license/createVendor", async(data:vendorForm,{rejectWithValue})=>{
    try {
        const res = await axios.post("/api/createVendor",data);
        return res.data
    } catch (error:any) {

        if(error.response && error.response.data ) return rejectWithValue(error.response.data);

        return rejectWithValue({error:error.message});
    }
})

export const deleteLicense = createAsyncThunk("license/deleteLicense",async(data:{license_id:number},{rejectWithValue})=>{
    try {
        const res = await axios.post("/api/license/deleteLicense",data);
        return res.data
    } catch (error:any) {
        if(error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({error:error.message})
    }
})

export const deleteCategory = createAsyncThunk("license/deleteCategory",async(data:{category_id:number},{rejectWithValue})=>{
    try {
        const res = await axios.post("/api/deleteCategory",data);
        return res.data
    } catch (error:any) {
        if(error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({error:error.message})
    }
})

export const deleteVendor = createAsyncThunk("license/deleteVendor",async(data:{vendor_id:number},{rejectWithValue})=>{
    try {
        const res = await axios.post("/api/deleteVendor",data);
        return res.data
    } catch (error:any) {
        if(error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({error:error.message})
    }
})

const licenseSlice = createSlice({
    initialState,
    name:`license`,
    reducers:{
    },
    extraReducers:(builder) => {
        builder.addCase(getLicenses.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(getLicenses.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.licenses=payload.licenses;
        })
        builder.addCase(getLicenses.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(getLicenseOpt.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(getLicenseOpt.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.categories = payload.categories;
            state.status = payload.status;
            state.vendors = payload.vendors;
        })
        builder.addCase(getLicenseOpt.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(createLicense.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(createLicense.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.licenses.push(payload.license);
        })
        builder.addCase(createLicense.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(createCategory.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(createCategory.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.categories.push(payload.category);
        })
        builder.addCase(createCategory.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(createVendor.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(createVendor.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.vendors.push(payload.vendor);
        })
        builder.addCase(createVendor.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(deleteLicense.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(deleteLicense.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.licenses = state.licenses.filter((license)=> license.license_id !== payload.license.license_id);            
        })
        builder.addCase(deleteLicense.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(deleteCategory.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(deleteCategory.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.categories = state.categories.filter((category)=> category.category_id !== payload.category.category_id);            
        })
        builder.addCase(deleteCategory.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
        builder.addCase(deleteVendor.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(deleteVendor.fulfilled,(state,{payload})=>{
            state.loading=false;
            state.vendors = state.vendors.filter((vendor)=> vendor.vendor_id !== payload.vendor.vendor_id);            
        })
        builder.addCase(deleteVendor.rejected,(state,{payload})=>{
            state.loading=false;
            state.error=payload as string;
        })
    }
})

export const licenseReducer = licenseSlice.reducer;