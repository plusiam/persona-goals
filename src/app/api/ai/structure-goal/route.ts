import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoalType, GoalStatus } from '@/types/firebase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { userInput, duration } = await request.json();
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
사용자가 "${userInput}"라는 목표를 입력했습니다.
기간은 ${duration === 'week' ? '1주일' : duration === 'month' ? '1개월' : '1년'}입니다.

이 목표를 달성하기 위한 단계별 계획을 만들어주세요.
각 단계는 다음 형식의 JSON 배열로 반환해주세요:

[
  {
    "title": "구체적인 목표 제목",
    "type": "DREAM/PROJECT/HABIT/TASK 중 하나",
    "description": "목표에 대한 간단한 설명",
    "durationDays": 기간(일수)
  }
]

규칙:
- ${duration === 'year' ? 'DREAM 1개, PROJECT 2-3개, HABIT 2-3개, TASK 3-5개' : 
    duration === 'month' ? 'PROJECT 1개, HABIT 2-3개, TASK 5-10개' : 
    'HABIT 1-2개, TASK 3-5개'}로 구성
- 실현 가능하고 구체적인 목표로 작성
- 순서는 장기적인 것부터 단기적인 것 순으로
- 한국어로 작성
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const structuredData = JSON.parse(jsonMatch[0]);
    
    // Convert to our goal format
    const goals = structuredData.map((item: any, index: number) => {
      const daysFromNow = item.durationDays || 
        (item.type === 'DREAM' ? 365 : 
         item.type === 'PROJECT' ? 90 : 
         item.type === 'HABIT' ? 30 : 7);
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysFromNow);
      
      return {
        title: item.title,
        type: item.type as GoalType,
        description: item.description,
        status: GoalStatus.PENDING,
        progress: 0,
        dueDate
      };
    });
    
    return NextResponse.json(goals);
  } catch (error) {
    console.error('AI structure goal error:', error);
    return NextResponse.json(
      { error: 'Failed to structure goal' },
      { status: 500 }
    );
  }
}