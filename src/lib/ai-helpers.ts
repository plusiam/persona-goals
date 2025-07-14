import { GoalType, GoalStatus } from '@/types/firebase';

interface StructuredGoal {
  title: string;
  type: GoalType;
  status: GoalStatus;
  progress: number;
  description?: string;
  dueDate?: Date;
}

export async function structureGoalWithAI(
  userInput: string, 
  duration: string
): Promise<StructuredGoal[]> {
  try {
    const response = await fetch('/api/ai/structure-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput, duration })
    });

    if (!response.ok) {
      throw new Error('Failed to structure goal');
    }

    return await response.json();
  } catch (error) {
    console.error('AI structuring failed:', error);
    // Fallback to simple goal
    return [{
      title: userInput,
      type: GoalType.PROJECT,
      status: GoalStatus.PENDING,
      progress: 0
    }];
  }
}

export async function categorizeGoal(goalText: string): Promise<string> {
  const keywords = {
    '학습': ['공부', '배우', '학습', '읽기', '독서', '시험', '자격증', '강의', '영어', '언어', '수학', '과학'],
    '건강': ['운동', '헬스', '다이어트', '체중', '건강', '요가', '러닝', '걷기', '수영', '자전거'],
    '업무': ['일', '업무', '프로젝트', '회사', '미팅', '보고서', '개발', '마감', '발표', '협업'],
    '관계': ['친구', '가족', '부모님', '연락', '만나', '데이트', '모임', '파티'],
    '개발': ['코딩', '프로그래밍', '개발', '앱', '웹', '디자인', '기술', 'IT'],
    '취미': ['그림', '음악', '악기', '요리', '여행', '사진', '영화', '드라마', '게임'],
    '재정': ['저축', '투자', '돈', '용돈', '절약', '부업', '월급'],
    '습관': ['매일', '매주', '꾸준히', '습관', '루틴', '아침', '저녁', '일찍']
  };

  // 여러 카테고리에 매칭될 수 있으므로 점수 계산
  const scores: Record<string, number> = {};
  
  for (const [category, words] of Object.entries(keywords)) {
    scores[category] = words.filter(word => goalText.includes(word)).length;
  }
  
  // 가장 높은 점수의 카테고리 반환
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    const topCategory = Object.entries(scores).find(([_, score]) => score === maxScore);
    return topCategory ? topCategory[0] : '기타';
  }

  return '기타';
}

export function detectTimeContext(): string {
  const hour = new Date().getHours();
  const day = new Date().getDay();

  // 주중
  if (day >= 1 && day <= 5) {
    if (hour >= 6 && hour < 9) return '아침_준비';
    if (hour >= 9 && hour < 12) return '오전_업무';
    if (hour >= 12 && hour < 14) return '점심_시간';
    if (hour >= 14 && hour < 18) return '오후_업무';
    if (hour >= 18 && hour < 20) return '저녁_시간';
    if (hour >= 20 && hour < 23) return '개인_시간';
    return '휴식_시간';
  }

  // 주말
  if (hour >= 7 && hour < 12) return '주말_오전';
  if (hour >= 12 && hour < 18) return '주말_오후';
  if (hour >= 18 && hour < 22) return '주말_저녁';
  return '휴식_시간';
}

export function getContextualGoalSuggestions(context: string): string[] {
  const suggestions: Record<string, string[]> = {
    '아침_준비': ['아침 운동하기', '영어 단어 10개 외우기', '하루 계획 세우기'],
    '오전_업무': ['중요한 업무 먼저 처리하기', '이메일 확인하기', '프로젝트 진행상황 체크'],
    '점심_시간': ['산책하기', '동료와 대화하기', '짧은 명상하기'],
    '오후_업무': ['미팅 준비하기', '보고서 작성하기', '내일 일정 확인하기'],
    '저녁_시간': ['운동하기', '가족과 시간 보내기', '저녁 준비하기'],
    '개인_시간': ['독서하기', '취미 활동하기', '내일 준비하기'],
    '주말_오전': ['늦잠 자기', '브런치 먹기', '청소하기'],
    '주말_오후': ['취미 활동하기', '친구 만나기', '쇼핑하기'],
    '주말_저녁': ['영화 보기', '다음 주 계획하기', '일찍 자기'],
    '휴식_시간': ['명상하기', '일기 쓰기', '스트레칭하기']
  };

  return suggestions[context] || [];
}