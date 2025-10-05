"use client"
import store from "@/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

export default function Providers({children}:Readonly<{children: ReactNode}>) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}