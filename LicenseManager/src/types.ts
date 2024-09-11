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
    status:Status[],
    vendors:Vendor[],
    categories:Category[],
    error:string,
    loading:boolean
}

export type License = {
    license_id:number
    title:string
    expiry_date:Date
    "User.username":string
    "Vendor.vendor_name":string
    "Category.category_name":string
    "Status.status_name":string
}

export type Filters = {
    "User.username": string;
    "Vendor.vendor_name": string;
    "Category.category_name": string;
    "Status.status_name":string
};

export type Status = {
    status_id:number,
    status_name:string
}
export type Vendor = {
    vendor_id:number,
    vendor_name:string
}
export type Category = {
    category_id:number,
    category_name:string
}

export type licenseForm = {
    title: string,
    expiry_date: Date | null,
    "Vendor.vendor_id": number,
    "Category.category_id": number,
    // "Status.status_id": number
}
export type categoryForm = {
    category_name:string
}
export type vendorForm = {
    vendor_name:string
}

export type DialogProps = {
    license_id?:number
    category_id?:number
    vendor_id?:number
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;