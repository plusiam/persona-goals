import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 데이터베이스 시드 시작...');

  // 기본 페르소나 데이터
  const defaultPersonas = [
    {
      name: '학습자',
      icon: '📚',
      color: '#4F46E5',
      description: '새로운 지식과 기술을 습득하는 학습 목표'
    },
    {
      name: '개인',
      icon: '🏠',
      color: '#10B981',
      description: '건강, 취미, 자기계발 등 개인적인 목표'
    },
    {
      name: '직장인',
      icon: '💼',
      color: '#F59E0B',
      description: '경력 개발과 업무 관련 목표'
    }
  ];

  // 샘플 목표 데이터
  const sampleGoals = {
    '학습자': [
      {
        title: 'TypeScript 마스터하기',
        type: 'PROJECT',
        description: 'TypeScript 고급 기능 학습 및 실전 프로젝트 적용',
        progress: 30,
        status: 'IN_PROGRESS'
      },
      {
        title: '매일 알고리즘 문제 풀기',
        type: 'HABIT',
        description: '하루 1문제씩 코딩 테스트 준비',
        progress: 45,
        status: 'IN_PROGRESS'
      }
    ],
    '개인': [
      {
        title: '건강한 생활 습관 만들기',
        type: 'DREAM',
        description: '규칙적인 운동과 건강한 식습관으로 체력 향상',
        progress: 20,
        status: 'IN_PROGRESS'
      },
      {
        title: '주 3회 운동하기',
        type: 'HABIT',
        description: '월/수/금 저녁 운동',
        progress: 60,
        status: 'IN_PROGRESS'
      }
    ],
    '직장인': [
      {
        title: '프로젝트 매니저 자격증 취득',
        type: 'PROJECT',
        description: 'PMP 자격증 준비 및 시험 응시',
        progress: 15,
        status: 'IN_PROGRESS'
      },
      {
        title: '팀 문서화 개선',
        type: 'TASK',
        description: '팀 위키 정리 및 프로세스 문서화',
        progress: 70,
        status: 'IN_PROGRESS'
      }
    ]
  };

  console.log('✅ 시드 데이터 준비 완료');
  console.log('');
  console.log('📝 참고: 실제 사용자 데이터는 Firebase 인증 후 자동으로 생성됩니다.');
  console.log('   - 첫 로그인 시 기본 페르소나 3개 자동 생성');
  console.log('   - 사용자별 독립적인 목표 관리');
  console.log('   - 레벨 시스템과 모드 전환 자동 적용');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n✨ 시드 스크립트 완료!');
  })
  .catch(async (e) => {
    console.error('❌ 시드 스크립트 오류:', e);
    await prisma.$disconnect();
    process.exit(1);
  });