import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [states, types, categories] = await Promise.all([
      prisma.college.findMany({ select: { state: true }, distinct: ['state'], orderBy: { state: 'asc' } }),
      prisma.college.findMany({ select: { type: true }, distinct: ['type'], orderBy: { type: 'asc' } }),
      prisma.college.findMany({ select: { category: true }, distinct: ['category'], orderBy: { category: 'asc' } }),
    ]);

    return NextResponse.json({
      states: states.map((s: { state: string }) => s.state),
      types: types.map((t: { type: string }) => t.type),
      categories: categories.map((c: { category: string }) => c.category),
    });
  } catch (error) {
    console.error('Filters error:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}
