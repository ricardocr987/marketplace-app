import { useCallback, useEffect, useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { SignMessage } from "@/lib/signMessage";
import { useCookies } from 'next-client-cookies';
import bs58 from "bs58";

export default function useAuth() {
    const { publicKey, connected, signMessage } = useWallet();
    const cookies = useCookies();
    const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.get('token'));
    
    const signIn = useCallback(async () => {
        if (cookies.get('token')) return;
        if (!connected || !signMessage || !publicKey) {
            console.log("Public key or signMessage function is not available");
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: publicKey.toBase58() })
        };

        const nonceResponse = await fetch('http://localhost:3000/api/auth/nonce', requestOptions);
        if (!nonceResponse.ok) {
            console.error("Failed to fetch nonce:", nonceResponse.statusText);
            return;
        }

        const { nonce } = await nonceResponse.json();
        const message = new SignMessage({
            publicKey: publicKey.toBase58(),
            statement: `Sign in`,
            nonce,
        });

        const data = new TextEncoder().encode(message.prepare());
        const signature = await signMessage(data);
        const serializedSignature = bs58.encode(signature);

        const signInRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: JSON.stringify(message),
                signature: serializedSignature,
            }),
        };

        const signInResponse = await fetch('http://localhost:3000/api/auth/login', signInRequestOptions);
        if (!signInResponse.ok) {
            console.error("Failed to sign in:", signInResponse.statusText);
            return;
        }

        const { token } = await signInResponse.json();
        cookies.set('token', token);
        setIsAuthenticated(true);
    }, [publicKey, connected, signMessage]);

    const signOut = useCallback(async () => {
        const token = cookies.get('token');
        if (!connected || !token) return;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const logoutResponse = await fetch('http://localhost:3000/api/auth/logout', requestOptions);
        if (!logoutResponse.ok) {
            console.error("Failed to logout:", logoutResponse.statusText);
            return;
        }

        cookies.remove('token');
        setIsAuthenticated(false);
    }, [connected]);

    return { signIn, signOut, isAuthenticated };
};
