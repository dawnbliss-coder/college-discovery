import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { answers: true } },
      },
    });
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Discussions list error:', error);
    return NextResponse.json({ error: 'Failed to load discussions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: 'Login required to post a question' }, { status: 401 });
  }

  try {
    const { title, body } = await req.json();
    if (!title?.trim() || !body?.trim()) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        userId: payload.userId,
        title: title.trim(),
        body: body.trim(),
      },
      include: { user: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
