import { store } from "./redux/store";

export type userState = {
    user:User,
    error:string,
    loading:boolean
}

export type User = {
    user_id:number
    username:string
    email:string
}

export type licenseState = {
    licenses:License[],
    error:string,
    loading:boolean
}

export type License = {
    license_id:number
    title:string
    expiry_date:Date
    "user.username":string
    "vendor.vendor_name":string
    "category.category_name":string
    "status.status_name":string
}


export type Item = {
    id: number;
    name: string;
    expiryDate: string;
    createdBy: string;
    vendor: string;
    category: string;
    status: string;
    [key: string]: any; // Add index signature here
};


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;