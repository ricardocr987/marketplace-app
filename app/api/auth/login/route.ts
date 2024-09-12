import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAuthAdapter } from '@/lib/supabase';
import { SignMessage } from '@/lib/signMessage';

export async function POST(req: NextRequest) {
    try {
        const { message, signature } = await req.json();

        if (!message || !signature) {
            return NextResponse.json({ error: 'Message and signature are required' }, { status: 400 });
        }

        const signMessage = new SignMessage(JSON.parse(message));

        const validationResult = await signMessage.validate(signature);
        if (!validationResult) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const storedNonce = await supabaseAuthAdapter.getNonce(signMessage.publicKey);
        if (storedNonce !== signMessage.nonce) {
            return NextResponse.json({ error: 'Invalid nonce' }, { status: 401 });
        }

        const address = signMessage.publicKey;
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('address', address)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        } else if (!user) {
            // Creating a new user
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email: `${address}@email.com`,
                user_metadata: { address },
            });
            if (authError) throw authError;

            let { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('address', address)
                .single();

            if (error) throw authError;

            user = data
        }

        if (!user) throw Error('Could not get user on login')

        const token = await supabaseAuthAdapter.generateToken(user.id);

        await supabase
            .from('users')
            .update({
                nonce: null,
                last_auth: new Date().toISOString(),
                last_auth_status: 'success',
            })
            .eq('address', address);

        return NextResponse.json({ token, user }, { status: 200 });
    } catch (error: any) {
        console.error('Error during login:', error);
        return NextResponse.json({ error: error.message || 'Login failed' }, { status: error.status || 500 });
    }
}
