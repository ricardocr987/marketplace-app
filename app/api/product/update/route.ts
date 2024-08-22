import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { data, error } = await supabase
            .from('products')
            .update({
                price: body.price,
                currency: body.currency,
            })
            .eq('id', body.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'success', data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
    }
}
