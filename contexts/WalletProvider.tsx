'use client'

import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import { WalletError } from '@solana/wallet-adapter-base';
import { toast } from '@/hooks/useToast';

export const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    const onError = useCallback(
        (error: WalletError) => {
            toast({
                title: "Wallet Error",
                description: error.message,
            });
        },
        []
    );

    return (
        <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC!}>
            <WalletProvider autoConnect wallets={wallets} onError={onError}>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );
};

