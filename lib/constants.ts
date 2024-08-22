import { PublicKey, SystemProgram } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export const TEN = new BigNumber(10);

export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
export const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

export const [APP_REFERENCE] = PublicKey.findProgramAddressSync(
    [Buffer.from("brick", "utf-8")],
    SystemProgram.programId
);