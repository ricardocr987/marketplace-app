'use client';

import WalletModal from "./WalletModal";
import { Button } from "./ui/button";
import { useAuth } from '@/contexts/AuthProvider';

export default function Wallet() {
    const { signOut, token } = useAuth();
    return (
        <div className="border-t px-4 py-4">
            {token ? (
                <div className="flex flex-col items-center">
                    <Button onClick={signOut} className="w-full">
                        Disconnect Wallet
                    </Button>
                </div>
            ) : (
                <WalletModal />
            )}
        </div>
    );
}
