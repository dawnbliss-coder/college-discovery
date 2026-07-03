import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json({ error: 'College IDs are required' }, { status: 400 });
    }

    const idList = ids.split(',').slice(0, 3); // max 3 colleges

    if (idList.length < 2) {
      return NextResponse.json({ error: 'At least 2 college IDs are required for comparison' }, { status: 400 });
    }

    const found = await prisma.college.findMany({
      where: { id: { in: idList } },
      include: {
        courses: true,
        placements: { orderBy: { year: 'desc' }, take: 1 },
        _count: { select: { reviews: true } },
      },
    });

    const colleges = idList
      .map((id) => found.find((c) => c.id === id))
      .filter((c): c is (typeof found)[number] => c != null);

    if (colleges.length < 2) {
      return NextResponse.json({ error: 'One or more colleges not found' }, { status: 404 });
    }

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error('Compare error:', error);
    return NextResponse.json({ error: 'Failed to compare colleges' }, { status: 500 });
  }
}
