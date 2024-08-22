import { supabaseAuthAdapter } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }

        const nonce = uuid();
        const attempt = {
            address,
            nonce,
            ttl: (Math.floor(Date.now() / 1000) + 300).toString(), // 5 minutes TTL
        };

        await supabaseAuthAdapter.saveAttempt(attempt);

        return NextResponse.json({ nonce }, { status: 200 });
    } catch (error) {
        console.error('Error generating nonce:', error);
        return NextResponse.json({ error: 'Failed to generate nonce' }, { status: 500 });
    }
}
