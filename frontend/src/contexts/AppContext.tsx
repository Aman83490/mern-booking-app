import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

//const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";
const STRIPE_PUB_KEY = 'pk_test_51PcLclRx2Bbg4XKhuNBWIC0RH8Uv1tkWCeJUL4Oj1OPQmTVgI0fTbccnvdHwUMTeS1WwBrmCw0Yc60RekJDkniZ500UIFnKbNv';

type ToastMessage = {
    message: string,
    type: "SUCCESS"|"ERROR"
};



type AppContext={
    showToast:(toastMessage:ToastMessage)=>void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
}

const AppContext = React.createContext<AppContext | undefined>(undefined)

const stripePromise = loadStripe(STRIPE_PUB_KEY);

export const AppContextProvider = ({children}:{children:React.ReactNode})=>{

    const [toast,setToast] = useState<ToastMessage | undefined>(undefined)

    const {isError} = useQuery("validateToken",apiClient.validateToken,{
       retry:false
    })

    return(
         <AppContext.Provider
          value={{
            showToast:(toastMessage)=>{
                setToast(toastMessage)
            },
            isLoggedIn: !isError,
            stripePromise,
          }}
         >
             {toast && (<Toast message={toast.message} type={toast.type} onClose={()=>setToast(undefined)}/>)}
            {children}
         </AppContext.Provider>
    )
   
}

export const useAppContext = () =>{
    const context = useContext(AppContext)
    return context as AppContext
}

