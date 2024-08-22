import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const address = url.searchParams.get('address');
        if (!address) return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('address', address)
            .single();

        if (error || !user) {
            console.error('Authentication error:', error);
            return new NextResponse(JSON.stringify({ error: 'Invalid or expired token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error: any) {
        console.error(error.message);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}
