'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from 'react';
import { NextCiperClient } from './client';
const CiperContext = createContext(undefined);
export function CiperProvider({ children }) {
    if (!process.env.NEXT_PUBLIC_CIPHER_AUTH_URL ||
        !process.env.NEXT_PUBLIC_CIPHER_API_KEY) {
        throw new Error('NEXT_PUBLIC_CIPHER_AUTH_URL and NEXT_PUBLIC_CIPHER_API_KEY must be set in your environment variables');
    }
    const client = new NextCiperClient(process.env.NEXT_PUBLIC_CIPHER_AUTH_URL, process.env.NEXT_PUBLIC_CIPHER_API_KEY);
    return (_jsx(CiperContext.Provider, { value: { client }, children: children }));
}
export function useCiper() {
    const context = useContext(CiperContext);
    if (!context) {
        throw new Error('useCiper must be used within a CiperProvider');
    }
    return context.client;
}
export function useAuth() {
    const client = useCiper();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        client
            .currentUser()
            .then(setUser)
            .finally(() => setLoading(false));
    }, [client]);
    const signUp = (params) => __awaiter(this, void 0, void 0, function* () {
        const result = yield client.signUp(params);
        setUser(result.user);
        return result;
    });
    const signIn = (params) => __awaiter(this, void 0, void 0, function* () {
        const result = yield client.signIn(params);
        setUser(result.user);
        return result;
    });
    const logOut = () => __awaiter(this, void 0, void 0, function* () {
        yield client.logOut();
        setUser(null);
    });
    return {
        user,
        loading,
        signUp,
        signIn,
        logOut,
        isAuthenticated: !!user,
    };
}
