import { supabaseAuthAdapter } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const auth = await supabaseAuthAdapter.isAuthenticated(token);
        if (!auth) {
            console.error('Authentication error');
            return new NextResponse(JSON.stringify({ error: 'Invalid or expired token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return NextResponse.next();
    } catch (error: any) {
        console.error('Unexpected error during authentication:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export const config = {
    matcher: [
        '/api/product/:path*',
        '/api/solana/:path*',
        '/api/user/:path*',
    ],
};
  