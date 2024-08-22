'use client';

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { Wallet, useWallet } from '@solana/wallet-adapter-react';
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import Image from "next/image";

export default function WalletModal() {
    const { wallets, select } = useWallet();
    
    const installedWallets = useMemo(() => {
        const installed: Wallet[] = [];

        for (const wallet of wallets) {
            if (wallet.readyState === WalletReadyState.Installed) {
                installed.push(wallet);
            }
        }

        return installed;
    }, [wallets]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full">
                    Connect Wallet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Connect a Wallet</DialogTitle>
                    <DialogDescription>Select a wallet to connect and start using our dApp.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    {installedWallets.length ? (
                        installedWallets.map(wallet => (
                            <Button 
                                key={wallet.adapter.name} 
                                className="rounded-lg border p-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-start"
                                onClick={() => select(wallet.adapter.name)}
                            >
                                <Image 
                                    src={wallet.adapter.icon} 
                                    width={32} 
                                    height={32} 
                                    alt={`${wallet.adapter.name} Wallet`} 
                                />
                                <h1 className="ml-3 font-medium">{wallet.adapter.name}</h1>
                            </Button>
                        ))
                    ) : (
                        <h1>You'll need a wallet on Solana to continue</h1>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
