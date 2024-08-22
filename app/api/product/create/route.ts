import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuid } from 'uuid';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, description, price, currency, active, image, user } = body;
        if (!name || !description || !price || !currency) {
            return NextResponse.json({ status: 'Error', message: 'Missing required fields' }, { status: 400 });
        }

        const id = uuid();
        const [productReference] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('reference', 'utf-8'),
                Buffer.from(id, 'hex'),
            ],
            TOKEN_PROGRAM_ID
        );
        const { data, error } = await supabase
            .from('products')
            .insert({
                id,
                name,
                description,
                price,
                currency,
                active,
                image,
                seller: user,
                solana_index: productReference.toBase58(),
            })
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ status: 'Success', data }, { status: 201 });
    } catch (error: any) {
        console.error('Error inserting product:', error);
        return NextResponse.json({ status: 'Error', message: error.message || 'Something went wrong' }, { status: 500 });
    }
}