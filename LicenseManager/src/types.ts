import { store } from "./redux/store";

export type userState = {
    user:User,
    users:User[],
    isAdmin:boolean,
    isSuperAdmin:boolean,
    error:string,
    loading:boolean
}

export type User = {
    user_id:number
    username:string
    email:string
    isDisable:boolean,
    isAdmin:boolean,
    isSuperAdmin:boolean
}
export type UserFilters = {
    name: string;
    email: string;
    isAdmin: string; // e.g., "admin", "user", or empty for all
    isDisable: string; // e.g., "active", "disabled", or empty for all
};

export type licenseState = {
    licenses:License[],
    status:Status[],
    vendors:Vendor[],
    categories:Category[],
    error:string,
    loading:boolean,
    licExpInWeek:License[],
    newLic:License[]
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
    title:string|null;
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
    vendor_name:string,
    vendor_email:string,
    vendor_representative:string,
    vendor_rep_phone:string,
    vendor_rep_email:string,
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
    category_name:string,
}
export type vendorForm = {
    vendor_name:string,
    vendor_email:string,
    vendor_representative:string,
    vendor_rep_phone:string,
    vendor_rep_email:string,
}
export type DialogProps = {
    license_id?:number
    category_id?:number
    vendor_id?:number
}


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;