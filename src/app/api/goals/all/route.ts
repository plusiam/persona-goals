import { NextRequest, NextResponse } from 'next/server';
import { getAllUserGoals } from '@/lib/db-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const goals = await getAllUserGoals(userId);
    return NextResponse.json(goals);
  } catch (error) {
    console.error('Get all goals error:', error);
    return NextResponse.json(
      { error: 'Failed to get all goals' },
      { status: 500 }
    );
  }
}