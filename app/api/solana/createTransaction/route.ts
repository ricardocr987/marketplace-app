import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { supabase } from '@/lib/supabase';
import { createSPLTokenInstruction, createSystemInstruction, getTransaction } from '@/lib/solana';
import { config } from '@/lib/config';
import { APP_REFERENCE } from '@/lib/constants';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const signer = new PublicKey(body.signer);
        const senderInfo = await config.RPC.getAccountInfo(signer);
        if (!senderInfo) {
            const message = 'Sender not found';
            console.error(message);
            return NextResponse.json({ error: message }, { status: 404 });
        }

        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', body.product)
            .single();

        if (error || !product) {
            const message = 'Error fetching product';
            console.error(message, error?.message);
            return NextResponse.json({ error: message }, { status: 404 });
        }

        const quantity = new BigNumber(body.quantity);
        const price = new BigNumber(product.price, 16);
        const amount = quantity.multipliedBy(price);

        const splToken = new PublicKey(product.currency);
        const recipient = new PublicKey(product.seller);
        const payInstruction = product.currency !== 'So11111111111111111111111111111111111111112'
            ? await createSPLTokenInstruction(recipient, amount, splToken, signer)
            : await createSystemInstruction(recipient, amount, signer, senderInfo);

        const [productReference] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('reference', 'utf-8'),
                Buffer.from(product.id, 'hex'),
            ],
            TOKEN_PROGRAM_ID
        );

        payInstruction.keys.push(
            { pubkey: productReference, isWritable: false, isSigner: false },
            { pubkey: APP_REFERENCE, isWritable: false, isSigner: false }
        );

        const serializedTransaction = getTransaction(payInstruction, signer);

        return NextResponse.json({ message: serializedTransaction }, { status: 200 });
    } catch (e: any) {
        console.error('Error creating transaction:', e.message);
        return NextResponse.json({ message: 'error', error: e.message }, { status: 500 });
    }
}
