import { NextRequest, NextResponse } from 'next/server';
import { updateGoal, deleteGoal, incrementUserStats } from '@/lib/db-helpers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const goal = await updateGoal(params.id, data);
    
    // 완료 상태로 변경 시 통계 업데이트
    if (data.status === 'COMPLETED' && data.userId) {
      await incrementUserStats(data.userId, 'totalGoalsCompleted');
    }
    
    return NextResponse.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteGoal(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete goal error:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}