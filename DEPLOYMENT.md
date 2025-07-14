# 📚 Persona Goals 배포 관리자 가이드

## 🎯 배포 체크리스트

### 1. 사전 준비사항

- [ ] GitHub 계정
- [ ] Vercel 계정 
- [ ] Neon 계정 (PostgreSQL)
- [ ] Firebase 프로젝트
- [ ] Google AI Studio 계정 (Gemini API)

### 2. 서비스별 설정

#### 🗄️ Neon PostgreSQL

1. **계정 생성 및 프로젝트 생성**
   - https://neon.tech 접속
   - 무료 계정 생성
   - 새 프로젝트 생성

2. **연결 문자열 복사**
   ```
   postgresql://[username]:[password]@[host]/[database]?sslmode=require
   ```

#### 🔐 Firebase Authentication

1. **프로젝트 생성**
   - https://console.firebase.google.com
   - "프로젝트 만들기" 클릭
   - Google Analytics 설정 (선택사항)

2. **Authentication 설정**
   - 좌측 메뉴에서 "Authentication" 선택
   - "시작하기" 클릭
   - Sign-in providers에서 활성화:
     - ✅ 이메일/비밀번호
     - ✅ Google (선택사항)

3. **웹 앱 추가**
   - 프로젝트 설정 → 일반
   - "앱 추가" → 웹 선택
   - 앱 등록 후 설정 값 복사

4. **승인된 도메인 추가**
   - Authentication → Settings → 승인된 도메인
   - Vercel 배포 URL 추가 (예: your-app.vercel.app)

#### 🤖 Google Gemini API

1. **API 키 발급**
   - https://aistudio.google.com/app/apikey
   - "Create API key" 클릭
   - API 키 복사 및 안전하게 보관

### 3. Vercel 배포

#### 자동 배포 (추천)

1. README의 "Deploy with Vercel" 버튼 클릭
2. GitHub 저장소 연결
3. 환경변수 입력:
   ```
   DATABASE_URL=<Neon 연결 문자열>
   GEMINI_API_KEY=<Gemini API 키>
   NEXT_PUBLIC_FIREBASE_API_KEY=<Firebase 값>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<Firebase 값>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<Firebase 값>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<Firebase 값>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<Firebase 값>
   NEXT_PUBLIC_FIREBASE_APP_ID=<Firebase 값>
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<Firebase 값>
   ```
4. "Deploy" 클릭

#### 수동 배포

1. Vercel Dashboard에서 "New Project"
2. GitHub 저장소 Import
3. Framework Preset: Next.js (자동 감지)
4. 환경변수 설정 (위와 동일)
5. Deploy

### 4. 배포 후 설정

#### 도메인 설정

1. Vercel 프로젝트 → Settings → Domains
2. 커스텀 도메인 추가 (옵션)
3. DNS 설정 안내 따르기

#### Firebase 도메인 추가

1. Firebase Console → Authentication → Settings
2. 승인된 도메인에 추가:
   - `your-project.vercel.app`
   - 커스텀 도메인 (있는 경우)

#### 데이터베이스 확인

```bash
# Vercel CLI 설치 (선택사항)
npm i -g vercel

# 프로젝트 연결
vercel link

# 환경변수 확인
vercel env ls

# Prisma 마이그레이션 실행
vercel env pull .env.production.local
npx prisma migrate deploy
```

## 🔧 트러블슈팅

### 일반적인 문제 해결

#### 1. 빌드 실패

**증상**: Vercel에서 빌드 에러
**해결**:
- 로컬에서 `npm run build` 테스트
- `next.config.mjs` 확인
- TypeScript 에러 수정

#### 2. 데이터베이스 연결 실패

**증상**: 500 에러, Prisma 에러
**해결**:
- DATABASE_URL 형식 확인
- Neon 프로젝트 상태 확인
- SSL 설정 (`?sslmode=require`)

#### 3. Firebase 인증 실패

**증상**: 로그인 불가, 인증 에러
**해결**:
- Firebase 프로젝트 ID 확인
- 승인된 도메인 리스트 확인
- API 키 유효성 확인

#### 4. 환경변수 문제

**증상**: undefined 에러, 기능 작동 안함
**해결**:
- Vercel 대시보드에서 환경변수 확인
- NEXT_PUBLIC_ 접두사 확인
- 재배포 시도

### 성능 최적화

1. **데이터베이스**
   - Neon 프로젝트 위치를 사용자와 가까운 리전으로 설정
   - Connection pooling 활성화

2. **이미지 최적화**
   - Next.js Image 컴포넌트 사용
   - 적절한 이미지 크기 제공

3. **캐싱**
   - Vercel Edge Cache 활용
   - 정적 페이지 생성 (가능한 경우)

## 📊 모니터링

### Vercel Analytics

1. 프로젝트 → Analytics 탭
2. 성능 메트릭 확인:
   - First Contentful Paint
   - Largest Contentful Paint
   - Time to Interactive

### 로그 확인

1. Vercel Dashboard → Functions 탭
2. 실시간 로그 스트리밍
3. 에러 로그 필터링

### 데이터베이스 모니터링

1. Neon Dashboard에서 모니터링
2. 쿼리 성능 확인
3. 스토리지 사용량 체크

## 🚨 보안 고려사항

1. **환경변수**
   - 민감한 정보는 절대 코드에 포함하지 않기
   - .env 파일은 .gitignore에 포함

2. **API 키 관리**
   - 정기적인 키 로테이션
   - 사용량 제한 설정

3. **데이터베이스**
   - 정기적인 백업
   - 접근 권한 최소화

## 📞 지원 및 문의

- GitHub Issues: https://github.com/plusiam/persona-goals/issues
- 개발자 이메일: [개발자 이메일]
- 문서: 이 가이드 및 README.md

## 🔄 업데이트 프로세스

1. 코드 변경사항을 main 브랜치에 push
2. Vercel이 자동으로 빌드 및 배포
3. 프리뷰 URL에서 테스트
4. 문제 없으면 프로덕션 반영

---

마지막 업데이트: 2024년 1월