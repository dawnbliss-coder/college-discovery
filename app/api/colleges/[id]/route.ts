import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: { orderBy: { year: 'desc' } },
        reviews: { orderBy: { createdAt: 'desc' } },
        _count: { select: { reviews: true, savedBy: true } },
      },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json({ college });
  } catch (error) {
    console.error('College detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch college' }, { status: 500 });
  }
}
