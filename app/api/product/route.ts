import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const seller = url.searchParams.get('seller');

        let query = supabase.from('products').select('*');

        if (seller) {
            query = query.eq('seller', seller);
        }

        const { data, error } = await query;

        console.log(data)
        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ status: 'Success', data }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ status: 'Error', message: error.message || 'Something went wrong' }, { status: 500 });
    }
}
