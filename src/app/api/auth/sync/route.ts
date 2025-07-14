import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByFirebaseUid, createDefaultPersonas } from '@/lib/db-helpers';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firebaseUid, email, name, photoUrl } = await request.json();

    if (!firebaseUid || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 기존 사용자 확인
    let user = await getUserByFirebaseUid(firebaseUid);

    if (!user) {
      // 새 사용자 생성
      user = await createUser({
        firebaseUid,
        email,
        name,
        photoUrl
      });

      // 기본 페르소나 생성
      await createDefaultPersonas(user.id);
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}