import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { categoryForm, licenseForm, licenseState, vendorForm ,managerForm} from "../../types";
import axios from "axios";

const initialState: licenseState = {
    licenses: [],
    licExpInWeek: [],
    newLic: [],
    categories: [],
    status: [],
    vendors: [],
    managers: [],
    error: "",
    loading: false
};
const API_URL = import.meta.env.VITE_API_URL || "/api";

export const getLicenses = createAsyncThunk("license/getLicenses", async (_undefined, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${API_URL}/license/getLicenses`);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const getLicenseOpt = createAsyncThunk("license/getLicenseOpt", async (_undefined, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${API_URL}/getLicenseopt`);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const createLicense = createAsyncThunk("license/createLicense", async (data: licenseForm, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URL}/license/createLicense`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const createCategory = createAsyncThunk("license/createCategory", async (data: categoryForm, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URL}/createCategory`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const createVendor = createAsyncThunk("license/createVendor", async (data: vendorForm, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URL}/createVendor`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const createManager = createAsyncThunk("license/createManager", async (data: managerForm, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URL}/createManager`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const deleteLicense = createAsyncThunk("license/deleteLicense", async (data: { license_id: number }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URL}/license/deleteLicense`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const deleteCategory = createAsyncThunk("license/deleteCategory", async (data: { category_id: number }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URL}/deleteCategory`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const deleteVendor = createAsyncThunk("license/deleteVendor", async (data: { vendor_id: number }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URL}/deleteVendor`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});

export const editLicense = createAsyncThunk("license/editLicense", async (data: licenseForm & { license_id: number }, { rejectWithValue }) => {
    console.log("License", data);
    try {
        const res = await axios.post(`${API_URL}/license/editLicense`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        rejectWithValue({ error: error.message });
    }
});

export const editCategory = createAsyncThunk("license/editCategory", async (data: categoryForm & { category_id: number }, { rejectWithValue }) => {
    console.log("Category", data);
    try {
        const res = await axios.post(`${API_URL}/editCategory`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        rejectWithValue({ error: error.message });
    }
});

export const editVendor = createAsyncThunk("license/editVendor", async (data: vendorForm & { vendor_id: number }, { rejectWithValue }) => {
    console.log("Vendor", data);
    try {
        const res = await axios.post(`${API_URL}/editVendor`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        rejectWithValue({ error: error.message });
    }
});

export const editManager = createAsyncThunk("license/editManager", async (data: managerForm & { manager_id: number }, { rejectWithValue }) => {
    console.log("Manager", data);
    try {
        const res = await axios.post(`${API_URL}/editManager`, data);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        rejectWithValue({ error: error.message });
    }
});

export const getLicenseNot = createAsyncThunk("license/getLicenseNot", async (_undefined, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${API_URL}/license/getLicenseNot`);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.data) return rejectWithValue(error.response.data);

        return rejectWithValue({ error: error.message });
    }
});



const licenseSlice = createSlice({
    initialState,
    name: `license`,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLicenses.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLicenses.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.licenses = payload.licenses;
        });
        builder.addCase(getLicenses.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(getLicenseOpt.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLicenseOpt.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.categories = payload.categories;
            state.status = payload.status;
            state.vendors = payload.vendors;
            state.managers = payload.managers;
        });
        builder.addCase(getLicenseOpt.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(createLicense.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLicense.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.licenses.push(payload.license);
        });
        builder.addCase(createLicense.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(createCategory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createCategory.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.categories.push(payload.category);
        });
        builder.addCase(createCategory.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(createVendor.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createVendor.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.vendors.push(payload.vendor);
        });
        builder.addCase(createVendor.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(deleteLicense.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteLicense.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.licenses = state.licenses.filter((license) => license.license_id !== payload.license.license_id);
        });
        builder.addCase(deleteLicense.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(deleteCategory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteCategory.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.categories = state.categories.filter((category) => category.category_id !== payload.category.category_id);
        });
        builder.addCase(deleteCategory.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(deleteVendor.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteVendor.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.vendors = state.vendors.filter((vendor) => vendor.vendor_id !== payload.vendor.vendor_id);
        });
        builder.addCase(deleteVendor.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(editLicense.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editLicense.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.licenses = state.licenses.map((license) => {
                return license.license_id == payload.license.license_id ? payload.license : license;
            });
        });
        builder.addCase(editLicense.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(editCategory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editCategory.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.categories = state.categories.map((category) => {
                return category.category_id == payload.category.category_id ? payload.category : category;
            });
        });
        builder.addCase(editCategory.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(editVendor.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editVendor.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.vendors = state.vendors.map((vendor) => {
                return vendor.vendor_id == payload.vendor.vendor_id ? payload.vendor : vendor;
            });
        });
        builder.addCase(editVendor.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(getLicenseNot.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLicenseNot.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.licExpInWeek = payload.licExpInWeek;
            state.newLic = payload.newLic;
        });
        builder.addCase(getLicenseNot.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(createManager.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createManager.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.managers.push(payload.manager);}
        );
        builder.addCase(createManager.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(editManager.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editManager.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.managers = state.managers.map((manager) => {
                return manager.manager_id == payload.manager.manager_id ? payload.manager : manager;
            });
        });
        builder.addCase(editManager.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
    }
});

export const licenseReducer = licenseSlice.reducer;
