import { store } from "./redux/store";

export type userState = {
    user:User,
    users:User[],
    isAdmin:boolean,
    isSuperAdmin:boolean,
    error:string,
    loading:boolean,
}

export type User = {
    user_id:number
    username:string
    email:string
    isDisable:boolean,
    isAdmin:boolean,
    isSuperAdmin:boolean,
    domain_id: number,
    "Domain.domain_name"?: string
}

export type UserFilters = {
    name: string;
    email: string;
    isAdmin: string; 
    isDisable: string; 
    "Domain.domain_name":string;
};

export type licenseState = {
    licenses:License[],
    status:Status[],
    vendors:Vendor[],
    categories:Category[],
    managers:Manager[],
    domains: Domain[],
    error:string,
    loading:boolean,
    licExpInWeek:License[],
    newLic:License[],
    eligibleManagerUsers: User[];
}

export type License = {
    license_id:number
    title:string
    expiry_date:Date
    "User.username":string
    "Vendor.vendor_name":string
    "Category.category_name":string
    "Status.status_name":string
    "Manager.name":string
    "Manager.email":string
    "Domain.domain_name": string
}

export type Filters = {
    title:string|null;
    "User.username": string;
    "Vendor.vendor_name": string;
    "Category.category_name": string;
    "Status.status_name":string
    "Domain.domain_name": string;
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
    Domains: Domain[];
}

export type Category = {
    category_id:number,
    category_name:string
}

export type Manager = {
    manager_id: number;
    name: string;
    email: string;
    user_id: number;
    Domains: Domain;
    domain_id:number;
}

export type licenseForm = {
    title: string,
    expiry_date: Date | null,
    "Vendor.vendor_id": number,
    "Category.category_id": number,
    "Manager.manager_id": number,
    "Domain.domain_id": number
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
    domain_ids:number[]
}

export interface managerForm {
    domain_id?: number;
    user_id?: number | null;
    manager_id?: number;
}

export type Domain = {
    domain_id: number,
    domain_name: string,
    parent_domain_id: number
}

export type domainForm = {
    domain_name: string;
    parent_domain_id: number;
}

export type DialogProps = {
    license_id?:number
    category_id?:number
    vendor_id?:number
    domain_id?:number
    isRound?:boolean
}


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;