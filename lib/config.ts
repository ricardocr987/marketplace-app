import { Connection } from "@solana/web3.js";

export const config = {
    RPC_KEY: process.env.RPC_KEY || '',
    RPC: new Connection(`https://mainnet.helius-rpc.com/?api-key=${process.env.RPC_KEY || ''}`),
    SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID || '',
    SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || '',
};