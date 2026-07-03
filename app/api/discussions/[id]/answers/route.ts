import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = getTokenFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: 'Login required to answer' }, { status: 401 });
  }

  try {
    const { id: questionId } = await params;
    const { body } = await req.json();

    if (!body?.trim()) {
      return NextResponse.json({ error: 'Answer body is required' }, { status: 400 });
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const answer = await prisma.answer.create({
      data: {
        questionId,
        userId: payload.userId,
        body: body.trim(),
      },
      include: { user: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ answer }, { status: 201 });
  } catch (error) {
    console.error('Create answer error:', error);
    return NextResponse.json({ error: 'Failed to post answer' }, { status: 500 });
  }
}
