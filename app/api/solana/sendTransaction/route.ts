import { NextRequest, NextResponse } from 'next/server';
import { VersionedTransaction } from '@solana/web3.js';
import { config } from '@/lib/config';
import { validateTransfer } from '@/lib/solana';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { transaction, productId } = body;

        const transactionBuffer = Buffer.from(transaction, 'base64');
        const deserializedTransaction = VersionedTransaction.deserialize(transactionBuffer);

        const signature = await config.RPC.sendRawTransaction(deserializedTransaction.serialize(), {
            skipPreflight: true,
            maxRetries: 0,
        });

        let confirmedTx = null;
        const confirmTransactionPromise = config.RPC.confirmTransaction(
            {
                signature,
                blockhash: deserializedTransaction.message.recentBlockhash,
                lastValidBlockHeight: (await config.RPC.getLatestBlockhash()).lastValidBlockHeight,
            },
            'confirmed'
        );

        while (!confirmedTx) {
            confirmedTx = await Promise.race([
                confirmTransactionPromise,
                new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(null);
                    }, 2000)
                ),
            ]);

            if (!confirmedTx) {
                await config.RPC.sendRawTransaction(deserializedTransaction.serialize(), {
                    skipPreflight: true,
                    maxRetries: 0,
                });
            }
        }

        if (!confirmedTx) {
            throw new Error('Transaction confirmation failed');
        }

        await validateTransfer(signature, productId);

        return NextResponse.json({ message: 'success', signature }, { status: 200 });
    } catch (error: any) {
        console.error('Error sending transaction:', error.message);
        return NextResponse.json({ message: 'error', error: error.message }, { status: 500 });
    }
}
