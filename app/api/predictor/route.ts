import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_EXAMS = ['JEE', 'NEET', 'CUET'] as const;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get('exam')?.toUpperCase() || '';
    const rank = parseInt(searchParams.get('rank') || '', 10);

    if (!VALID_EXAMS.includes(exam as (typeof VALID_EXAMS)[number])) {
      return NextResponse.json(
        { error: 'Valid exams: JEE, NEET, CUET' },
        { status: 400 }
      );
    }

    if (!Number.isFinite(rank) || rank < 1) {
      return NextResponse.json({ error: 'Enter a valid rank (1 or above)' }, { status: 400 });
    }

    const cutoffs = await prisma.examCutoff.findMany({
      where: { exam, maxRank: { gte: rank } },
      include: {
        college: {
          include: {
            placements: { orderBy: { year: 'desc' }, take: 1 },
            _count: { select: { reviews: true } },
          },
        },
      },
      orderBy: { maxRank: 'asc' },
      take: 10,
    });

    return NextResponse.json({
      exam,
      rank,
      recommendations: cutoffs.map((c) => ({
        cutoffRank: c.maxRank,
        college: c.college,
      })),
      message:
        cutoffs.length === 0
          ? 'No matching colleges for this rank. Try a higher rank number or another exam.'
          : undefined,
    });
  } catch (error) {
    console.error('Predictor error:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
