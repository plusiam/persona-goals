# 🎭 Persona Goals - 페르소나 기반 목표 관리 플랫폼

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
- **인증**: Firebase Authentication (무료)
- **데이터베이스**: PostgreSQL + Prisma ORM
- **AI**: Google Gemini API
- **프론트엔드**: Next.js 14, TypeScript, Tailwind CSS
- **상태관리**: Zustand

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- PostgreSQL 데이터베이스
- Firebase 프로젝트 (Authentication만 사용)

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/[your-username]/persona-goals.git
cd persona-goals

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 필요한 값들을 설정

# 데이터베이스 마이그레이션
npm run prisma:push

# Prisma 클라이언트 생성
npm run prisma:generate
```

### Firebase 설정

1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. Authentication 활성화
   - 이메일/비밀번호 인증 활성화
   - Google 로그인 활성화 (선택사항)
3. 프로젝트 설정에서 웹 앱 추가
4. Firebase 설정 값을 `.env.local`에 추가

### PostgreSQL 설정

```bash
# PostgreSQL이 없다면 설치
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# 데이터베이스 생성
createdb persona_goals

# DATABASE_URL 환경변수 설정
# postgresql://USER:PASSWORD@localhost:5432/persona_goals
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속

### 빌드

```bash
npm run build
npm start
```

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Charts**: Recharts

## 📱 주요 기능

### 1. 페르소나 관리
- 기본 3개 페르소나 자동 생성 (학습자, 개인, 직장인)
- 페르소나별 색상과 아이콘
- 클릭으로 간편한 전환

### 2. 목표 관리
- 4가지 목표 유형 (Dream, Project, Habit, Task)
- 진행률 슬라이더로 직관적인 관리
- 상태 변경 (대기중, 진행중, 완료, 취소)

### 3. 자동화
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

## 💾 데이터 구조

### User & Settings
- Firebase Auth로 인증
- PostgreSQL에 사용자 정보 및 설정 저장
- 레벨, 연속 사용일, 완료 통계 추적

### Goals
- 페르소나별 목표 관리
- Dream → Project → Habit → Task 계층 구조
- 진행률, 상태, 카테고리 관리

## 📁 프로젝트 구조

```
persona-goals/
├── src/
│   ├── app/              # Next.js 앱 라우터
│   ├── components/       # React 컴포넌트
│   ├── contexts/         # React Context
│   ├── lib/             # 유틸리티 함수
│   ├── store/           # Zustand 스토어
│   └── types/           # TypeScript 타입 정의
├── public/              # 정적 파일
└── package.json
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
