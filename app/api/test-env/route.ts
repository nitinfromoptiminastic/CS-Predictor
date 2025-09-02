import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    hasOpenAIKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'null',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
  });
}
