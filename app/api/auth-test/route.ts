import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({
      session,
      hasSession: !!session,
      authOptions: {
        providers: authOptions.providers?.map(p => ({ id: p.id, name: p.name })),
        pages: authOptions.pages,
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Auth test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
