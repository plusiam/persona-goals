#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envTemplate = `# PostgreSQL Database (Neon)
DATABASE_URL="postgresql://[username]:[password]@[host]/[database]?sslmode=require"

# NextAuth (optional for future use)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# Gemini API
GEMINI_API_KEY="your-gemini-api-key"

# Firebase 설정 (공개 가능)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"
`;

console.log('🚀 Persona Goals 환경 설정 도우미\n');

const questions = [
  {
    name: 'DATABASE_URL',
    question: 'Neon PostgreSQL 연결 문자열을 입력하세요 (형식: postgresql://username:password@host/database?sslmode=require):',
    default: ''
  },
  {
    name: 'GEMINI_API_KEY',
    question: 'Google Gemini API 키를 입력하세요:',
    default: ''
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    question: 'Firebase API 키를 입력하세요:',
    default: ''
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    question: 'Firebase Auth Domain을 입력하세요:',
    default: ''
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    question: 'Firebase Project ID를 입력하세요:',
    default: ''
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    question: 'Firebase Storage Bucket을 입력하세요:',
    default: ''
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    question: 'Firebase Messaging Sender ID를 입력하세요:',
    default: ''
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_APP_ID',
    question: 'Firebase App ID를 입력하세요:',
    default: ''
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    question: 'Firebase Measurement ID를 입력하세요 (선택사항):',
    default: ''
  }
];

let envContent = envTemplate;
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];
    rl.question(`${q.question}\n> `, (answer) => {
      const value = answer.trim() || q.default;
      if (value) {
        envContent = envContent.replace(
          new RegExp(`${q.name}=".*"`),
          `${q.name}="${value}"`
        );
      }
      currentQuestion++;
      askQuestion();
    });
  } else {
    // 환경변수 파일 생성
    const envPath = path.join(__dirname, '..', '.env.local');
    fs.writeFileSync(envPath, envContent);
    
    // .env 파일도 생성 (Prisma용)
    const envPrismaPath = path.join(__dirname, '..', '.env');
    fs.writeFileSync(envPrismaPath, envContent);
    
    console.log('\n✅ 환경변수 파일이 생성되었습니다!');
    console.log('   - .env.local (Next.js용)');
    console.log('   - .env (Prisma용)');
    
    rl.close();
  }
}

// 시작
askQuestion();