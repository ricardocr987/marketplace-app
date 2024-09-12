import { supabaseAuthAdapter } from '@/lib/supabase';
import { getCookies } from 'next-client-cookies/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const cookies = getCookies();

        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const isAuthenticated = await supabaseAuthAdapter.isAuthenticated(token);

        if (isAuthenticated) {
            return NextResponse.json({ token }, { status: 200 });

        } else {
            cookies.remove('token');
            return NextResponse.json({ message: 'Invalid user' }, { status: 401 });
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
