'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCookies } from 'next-client-cookies';
import { SignMessage } from '@/lib/signMessage';
import bs58 from 'bs58';

interface User {
    id: string;
    address: string;
    avatar_url: string | null;
    billing_address: any | null;
    email: string | null;
    full_name: string | null;
    last_auth: string | null;
    last_auth_status: string | null;
    nonce: string | null;
    payment_method: any | null;
}

interface AuthState {
    token: string | null;
    user: User | null;
    loading: boolean;
    connectedWallet: string | null;
}

type AuthAction =
    | { type: 'SIGN_IN'; token: string; user: User; connectedWallet: string }
    | { type: 'SIGN_OUT' };

const initialState: AuthState = {
    token: null,
    user: null,
    loading: true,
    connectedWallet: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'SIGN_IN':
            return {
                ...state,
                token: action.token,
                user: action.user,
                loading: false,
                connectedWallet: action.connectedWallet,
            };
        case 'SIGN_OUT':
            return {
                ...state,
                token: null,
                user: null,
                loading: false,
                connectedWallet: null,
            };
        default:
            return state;
    }
}

const AuthContext = createContext<{
    token: string | null;
    user: User | null;
    loading: boolean;
    connectedWallet: string | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
} | undefined>(undefined);

export const AuthProvider = ({ children, initToken }: { children: ReactNode, initToken: string | undefined }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { publicKey, signMessage, disconnect, wallet } = useWallet();
    const cookies = useCookies();

    const signIn = useCallback(async () => {
        if (!signMessage || !publicKey || state.user) return;

        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: publicKey.toBase58() }),
            };

            const nonceResponse = await fetch('http://localhost:3000/api/auth/nonce', requestOptions);
            if (!nonceResponse.ok) throw new Error(`Failed to fetch nonce: ${nonceResponse.statusText}`);

            const { nonce } = await nonceResponse.json();
            const message = new SignMessage({ publicKey: publicKey.toBase58(), statement: 'Sign in', nonce });
            const data = new TextEncoder().encode(message.prepare());
            const signature = await signMessage(data);
            const serializedSignature = bs58.encode(signature);

            const signInRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: JSON.stringify(message), signature: serializedSignature }),
            };

            const signInResponse = await fetch('http://localhost:3000/api/auth/login', signInRequestOptions);
            if (!signInResponse.ok) throw new Error(`Failed to sign in: ${signInResponse.statusText}`);

            const { token, user }: { token: string; user: User } = await signInResponse.json();
            cookies.set('token', token);
            const connectedWallet = wallet?.adapter.name || 'Unknown Wallet';

            dispatch({ type: 'SIGN_IN', token, user, connectedWallet });
        } catch (error: any) {
            disconnect();
            console.error("Sign in error:", error.message);
        }
    }, [publicKey, signMessage, wallet, state.user, cookies, disconnect]);

    const signOut = useCallback(async () => {
        if (!publicKey || !state.token) return;

        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };

            const logoutResponse = await fetch('http://localhost:3000/api/auth/logout', requestOptions);
            if (!logoutResponse.ok) throw new Error(`Failed to logout: ${logoutResponse.statusText}`);

            await disconnect();
            cookies.remove('token');
            dispatch({ type: 'SIGN_OUT' });
        } catch (error: any) {
            console.error("Sign out error:", error.message);
        }
    }, [publicKey, state.token, disconnect, cookies]);

    const getUser = useCallback(async () => {
        // only get user data on auto-login
        if (!initToken || !publicKey || state.user) return;

        try {
            const response = await fetch(`http://localhost:3000/api/user?address=${publicKey.toBase58()}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${initToken}` },
            });

            if (!response.ok) throw new Error(`Failed to fetch user info: ${response.statusText}`);

            const data = await response.json();
            const connectedWallet = wallet?.adapter.name || 'Unknown Wallet';

            dispatch({ type: 'SIGN_IN', token: initToken, user: data.user, connectedWallet });
        } catch (error: any) {
            console.error("Failed to load user info:", error.message);
            dispatch({ type: 'SIGN_OUT' });
        }
    }, [publicKey, wallet, state]);

    // triggered by auto-login (already with the token cookie) and selecting a wallet
    useEffect(() => {
        if (state.user) return;

        if (initToken) {
            getUser();
        } else {
            signIn();
        }
    }, [getUser, signIn]);

    const contextValue = useMemo(() => ({
        ...state,
        signIn,
        signOut,
    }), [state, signIn, signOut]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
