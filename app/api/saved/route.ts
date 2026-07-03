import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: payload.userId },
      include: {
        college: {
          include: {
            placements: { orderBy: { year: 'desc' }, take: 1 },
            _count: { select: { reviews: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ savedColleges: saved });
  } catch (error) {
    console.error('Saved colleges error:', error);
    return NextResponse.json({ error: 'Failed to fetch saved colleges' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { collegeId } = await req.json();
    if (!collegeId) return NextResponse.json({ error: 'College ID is required' }, { status: 400 });

    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 });

    const saved = await prisma.savedCollege.create({
      data: { userId: payload.userId, collegeId },
    });
    return NextResponse.json({ saved }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'College already saved' }, { status: 409 });
    }
    console.error('Save college error:', error);
    return NextResponse.json({ error: 'Failed to save college' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const payload = getTokenFromRequest(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { collegeId } = await req.json();
    await prisma.savedCollege.deleteMany({
      where: { userId: payload.userId, collegeId },
    });
    return NextResponse.json({ message: 'College removed from saved' });
  } catch (error) {
    console.error('Remove saved error:', error);
    return NextResponse.json({ error: 'Failed to remove saved college' }, { status: 500 });
  }
}
