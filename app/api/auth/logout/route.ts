import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log({ error });
    }

    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set('token', '', { maxAge: 0 });
    return response;
}
