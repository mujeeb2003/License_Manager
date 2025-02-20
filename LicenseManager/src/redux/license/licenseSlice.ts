import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
    categoryForm,
    licenseForm,
    licenseState,
    vendorForm,
    managerForm,
    domainForm,
} from "../../types";
// import axios from "axios";
import api from "../../utils/axiosUtil";

const initialState: licenseState = {
    licenses: [],
    licExpInWeek: [],
    newLic: [],
    categories: [],
    status: [],
    vendors: [],
    managers: [],
    domains: [],
    error: "",
    loading: false,
};

export const getLicenses = createAsyncThunk(
    "license/getLicenses",
    async (_undefined, { rejectWithValue }) => {
        try {
            const res = await api.get(`/license/getLicenses`);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const getLicenseOpt = createAsyncThunk(
    "license/getLicenseOpt",
    async (_undefined, { rejectWithValue }) => {
        try {
            const res = await api.get(`/getLicenseopt`);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const createLicense = createAsyncThunk(
    "license/createLicense",
    async (data: licenseForm, { rejectWithValue }) => {
        try {
            const res = await api.post(`/license/createLicense`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const createCategory = createAsyncThunk(
    "license/createCategory",
    async (data: categoryForm, { rejectWithValue }) => {
        try {
            const res = await api.post(`/createCategory`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const createVendor = createAsyncThunk(
    "license/createVendor",
    async (data: vendorForm, { rejectWithValue }) => {
        try {
            const res = await api.post(`/createVendor`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const createManager = createAsyncThunk(
    "license/createManager",
    async (data: managerForm, { rejectWithValue }) => {
        try {
            const res = await api.post(`/createManager`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const createDomain = createAsyncThunk(
    "license/createDomain",
    async (data: domainForm, { rejectWithValue }) => {
        try {
            const res = await api.post(`/createDomain`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);
            return rejectWithValue({ error: error.message });
        }
    }
);

export const deleteLicense = createAsyncThunk(
    "license/deleteLicense",
    async (data: { license_id: number }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/license/deleteLicense`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "license/deleteCategory",
    async (data: { category_id: number }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/deleteCategory`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const deleteVendor = createAsyncThunk(
    "license/deleteVendor",
    async (data: { vendor_id: number }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/deleteVendor`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

export const deleteDomain = createAsyncThunk(
    "license/deleteDomain",
    async (data: { domain_id: number }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/deleteDomain`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);
            return rejectWithValue({ error: error.message });
        }
    }
);

export const editLicense = createAsyncThunk(
    "license/editLicense",
    async (data: licenseForm & { license_id: number }, { rejectWithValue }) => {
        console.log("License", data);
        try {
            const res = await api.post(`/license/editLicense`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            rejectWithValue({ error: error.message });
        }
    }
);

export const editCategory = createAsyncThunk(
    "license/editCategory",
    async (
        data: categoryForm & { category_id: number },
        { rejectWithValue }
    ) => {
        console.log("Category", data);
        try {
            const res = await api.post(`/editCategory`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            rejectWithValue({ error: error.message });
        }
    }
);

export const editVendor = createAsyncThunk(
    "license/editVendor",
    async (data: vendorForm & { vendor_id: number }, { rejectWithValue }) => {
        console.log("Vendor", data);
        try {
            const res = await api.post(`/editVendor`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            rejectWithValue({ error: error.message });
        }
    }
);

export const editManager = createAsyncThunk(
    "license/editManager",
    async (data: managerForm & { manager_id: number }, { rejectWithValue }) => {
        console.log("Manager", data);
        try {
            const res = await api.post(`/editManager`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            rejectWithValue({ error: error.message });
        }
    }
);

export const editDomain = createAsyncThunk(
    "license/editDomain",
    async (data: domainForm & { domain_id: number }, { rejectWithValue }) => {
        try {
            const res = await api.post(`/editDomain`, data);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);
            return rejectWithValue({ error: error.message });
        }
    }
);

export const getLicenseNot = createAsyncThunk(
    "license/getLicenseNot",
    async (_undefined, { rejectWithValue }) => {
        try {
            const res = await api.get(`/license/getLicenseNot`);
            return res.data;
        } catch (error: any) {
            if (error.response && error.response.data)
                return rejectWithValue(error.response.data);

            return rejectWithValue({ error: error.message });
        }
    }
);

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
            state.domains = payload.domains;
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
        builder.addCase(createDomain.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createDomain.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.domains.push(payload.domain);
        });
        builder.addCase(createDomain.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(deleteLicense.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteLicense.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.licenses = state.licenses.filter(
                (license) => license.license_id !== payload.license.license_id
            );
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
            state.categories = state.categories.filter(
                (category) =>
                    category.category_id !== payload.category.category_id
            );
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
            state.vendors = state.vendors.filter(
                (vendor) => vendor.vendor_id !== payload.vendor.vendor_id
            );
        });
        builder.addCase(deleteVendor.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(deleteDomain.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteDomain.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.domains = state.domains.filter(
                (domain) => domain.domain_id !== payload.domain.domain_id
            );
        });
        builder.addCase(deleteDomain.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(editLicense.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editLicense.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.licenses = state.licenses.map((license) => {
                return license.license_id == payload.license.license_id
                    ? payload.license
                    : license;
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
                return category.category_id == payload.category.category_id
                    ? payload.category
                    : category;
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
                return vendor.vendor_id == payload.vendor.vendor_id
                    ? payload.vendor
                    : vendor;
            });
        });
        builder.addCase(editVendor.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        builder.addCase(editDomain.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editDomain.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.domains = state.domains.map((domain) => {
                return domain.domain_id == payload.domain.domain_id
                    ? payload.domain
                    : domain;
            });
        });
        builder.addCase(editDomain.rejected, (state, { payload }) => {
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
            state.managers.push(payload.manager);
        });
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
                return manager.manager_id == payload.manager.manager_id
                    ? payload.manager
                    : manager;
            });
        });
        builder.addCase(editManager.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
    },
});

export const licenseReducer = licenseSlice.reducer;
