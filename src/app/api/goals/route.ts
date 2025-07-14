import { NextRequest, NextResponse } from 'next/server';
import { createGoal, getPersonaGoals, updateUserSettings, incrementUserStats } from '@/lib/db-helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId');

    if (!personaId) {
      return NextResponse.json({ error: 'personaId is required' }, { status: 400 });
    }

    const goals = await getPersonaGoals(personaId);
    return NextResponse.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json(
      { error: 'Failed to get goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const goal = await createGoal(data);
    
    // 목표 생성 통계 업데이트
    if (data.userId) {
      await incrementUserStats(data.userId, 'totalGoalsCreated');
    }
    
    return NextResponse.json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}