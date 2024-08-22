"use server";
import { cookies } from 'next/headers';

export interface Market {
    id: string;
    name: string;
    user: string
    location?: string;
}

export async function fetchMarkets(): Promise<Market[] | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) return null;

  try {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        Cookie: cookies().toString(),
      },
      method: 'GET',
    };
    const response = await fetch('http://localhost:3000/api/market/user', config);
    return await response.json() as Market[];
  } catch (error) {
    console.error('Error fetching markets:', error);
    return null;
  }
}
