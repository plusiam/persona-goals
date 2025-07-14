# 🎭 Persona Goals - 페르소나 기반 목표 관리 플랫폼

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fplusiam%2Fpersona-goals&env=DATABASE_URL,GEMINI_API_KEY,NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID)

## 📌 프로젝트 소개

Persona Goals는 "처음엔 간단하게, 필요하면 강력하게" 철학을 바탕으로 한 목표 관리 플랫폼입니다. 
사용자의 숙련도에 따라 점진적으로 기능이 확장되는 Progressive Disclosure 방식을 채택했습니다.

### 주요 특징

#### 🎯 3단계 사용자 모드
1. **Simple Mode**: 처음 사용자를 위한 간단한 목표 관리
2. **Smart Mode**: 카테고리와 패턴 분석이 추가된 중급 모드  
3. **Persona Mode**: 역할별 관리가 가능한 고급 모드

#### 🚀 점진적 기능 해제
- **Level 1**: 기본 목표 관리
- **Level 2**: 진행률 히스토리, 커스텀 카테고리
- **Level 3**: AI 목표 추천, 성취 분석
- **Level 4**: 페르소나 모드, 스마트 알림
- **Level 5**: 고급 분석, 자동화 기능

#### 🛡️ 기술 스택
- **프론트엔드**: Next.js 14, TypeScript, Tailwind CSS
- **백엔드**: Next.js API Routes
- **데이터베이스**: PostgreSQL (Neon) + Prisma ORM
- **인증**: Firebase Authentication
- **AI**: Google Gemini API
- **상태관리**: Zustand
- **배포**: Vercel

## 🚀 빠른 시작

### 1️⃣ 원클릭 배포 (추천)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fplusiam%2Fpersona-goals&env=DATABASE_URL,GEMINI_API_KEY,NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,NEXT_PUBLIC_FIREBASE_APP_ID)

버튼을 클릭하고 필요한 환경변수를 입력하면 자동으로 배포됩니다.

### 2️⃣ 로컬 개발 환경 설정

#### 필수 요구사항

- Node.js 18.0 이상
- PostgreSQL 데이터베이스 (Neon 추천)
- Firebase 프로젝트 (Authentication용)
- Google Gemini API 키

#### 설치 방법

```bash
# 1. 저장소 클론
git clone https://github.com/plusiam/persona-goals.git
cd persona-goals

# 2. 의존성 설치
npm install

# 3. 환경변수 설정 (대화형 설정 도구)
npm run setup:env

# 4. 데이터베이스 설정
npm run setup

# 5. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속

## 📋 필수 환경변수 설정

### 1. Neon PostgreSQL 설정
1. [Neon](https://neon.tech) 가입 및 프로젝트 생성
2. Connection String 복사
3. `DATABASE_URL`에 설정

### 2. Firebase 설정
1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. Authentication 활성화
   - 이메일/비밀번호 인증 활성화
   - Google 로그인 활성화 (선택사항)
3. 프로젝트 설정에서 웹 앱 추가
4. Firebase 설정 값을 환경변수에 추가

### 3. Google Gemini API
1. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 API 키 발급
2. `GEMINI_API_KEY`에 설정

## 🏗️ 프로젝트 구조

```
persona-goals/
├── src/
│   ├── app/              # Next.js 앱 라우터
│   ├── components/       # React 컴포넌트
│   ├── contexts/         # React Context (인증)
│   ├── lib/             # 유틸리티 함수
│   ├── store/           # Zustand 스토어
│   └── types/           # TypeScript 타입 정의
├── prisma/
│   ├── schema.prisma    # 데이터베이스 스키마
│   └── seed.ts         # 시드 데이터
├── public/              # 정적 파일 (PWA, 아이콘)
├── scripts/             # 유틸리티 스크립트
└── package.json
```

## 📱 주요 기능

### 1. 페르소나 관리
- 기본 3개 페르소나 자동 생성 (학습자, 개인, 직장인)
- 페르소나별 색상과 아이콘
- 클릭으로 간편한 전환

### 2. 목표 관리
- 4가지 목표 유형 (Dream, Project, Habit, Task)
- 진행률 슬라이더로 직관적인 관리
- 상태 변경 (대기중, 진행중, 완료, 취소)

### 3. AI 기능
- 목표 구조화 도우미
- 스마트 추천
- 패턴 분석

### 4. 자동화
- 시간대별 페르소나 자동 전환
- 진행률 100% 시 자동 완료 처리

## 🎮 사용자 경험 흐름

### 첫 사용자 (Simple Mode)
1. 회원가입 → 자동으로 Simple Mode 시작
2. "오늘의 목표" 리스트만 표시
3. 간단한 목표 추가 (2단계 플로우)
4. 레벨업하면서 기능 점진적 해제

### 모드 전환 시점
- **Simple → Smart**: Level 2 도달 + 5개 이상 목표 생성
- **Smart → Persona**: Level 4 도달 + 다양한 카테고리 목표 보유

## 💾 데이터베이스 구조

### 주요 테이블
- `users`: Firebase 인증과 연동된 사용자 정보
- `user_settings`: 사용자별 설정 (모드, 레벨, 통계)
- `personas`: 페르소나 정보
- `goals`: 목표 데이터

## 🚀 배포 가이드

### Vercel 배포

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경변수 설정:
   ```
   DATABASE_URL=postgresql://...
   GEMINI_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
4. Deploy 클릭

### 배포 후 설정

1. Vercel 프로젝트 설정에서 환경변수 확인
2. 도메인 설정 (선택사항)
3. Firebase에서 배포된 도메인 추가 (인증 설정)

## 🛠️ 개발 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 린트
npm run lint

# Prisma 명령어
npm run prisma:generate  # 클라이언트 생성
npm run prisma:push      # 스키마 푸시
npm run prisma:studio    # 데이터베이스 GUI
npm run prisma:seed      # 시드 데이터

# 환경 설정
npm run setup:env        # 환경변수 설정 도우미
npm run setup           # 전체 설정 (설치 + DB)
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이센스

MIT License

## 👨‍💻 개발자

- 여한기 - [GitHub](https://github.com/plusiam)

## 🙏 감사의 말

이 프로젝트는 교육 현장에서의 필요성과 개인의 다양한 역할을 인정하는 철학에서 시작되었습니다.

## 🔗 링크

- [라이브 데모](https://persona-goals.vercel.app)
- [이슈 트래커](https://github.com/plusiam/persona-goals/issues)
- [프로젝트 보드](https://github.com/plusiam/persona-goals/projects)