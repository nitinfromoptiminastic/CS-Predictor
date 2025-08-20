import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ModelService } from '@/lib/model-service';
import { AuditService } from '@/lib/audit-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const platforms = JSON.parse(formData.get('platforms') as string);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'No platforms selected' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Analyze the asset
    const result = await ModelService.analyzAsset(buffer, file.name, platforms);

    // Log the action
    await AuditService.logAction(
      session.user.email,
      session.user.email,
      'Asset Analysis',
      platforms,
      file.name,
      file.type
    );

    return NextResponse.json({
      success: true,
      ...result,
      fileName: file.name,
      fileType: file.type,
    });

  } catch (error) {
    console.error('Prediction API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
