import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user/userSlice";
import { licenseReducer } from "./license/licenseSlice";

export const store = configureStore({
    reducer:{
        user:userReducer,
        license:licenseReducer
    },

})