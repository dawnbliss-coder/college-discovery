import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'rating';
    const defaultSortOrder: Record<string, 'asc' | 'desc'> = {
      rating: 'desc',
      fees: 'asc',
      name: 'asc',
      established: 'desc',
    };
    const sortOrder = (searchParams.get('sortOrder') ||
      defaultSortOrder[sortBy] ||
      'desc') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;

    const filters: Prisma.CollegeWhereInput[] = [];

    if (search) {
      filters.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { state: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      });
    }
    if (state) filters.push({ state: { equals: state, mode: 'insensitive' } });
    if (type) filters.push({ type: { equals: type, mode: 'insensitive' } });
    if (category) filters.push({ category: { equals: category, mode: 'insensitive' } });

    const where: Prisma.CollegeWhereInput =
      filters.length > 0 ? { AND: filters } : {};

    const validSortFields: Record<string, Prisma.CollegeOrderByWithRelationInput> = {
      rating: { rating: sortOrder },
      fees: { fees: sortOrder },
      name: { name: sortOrder },
      established: { established: sortOrder },
    };
    const orderBy = validSortFields[sortBy] || { rating: 'desc' };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          placements: { orderBy: { year: 'desc' }, take: 1 },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Colleges fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}
