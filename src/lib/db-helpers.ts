import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

// User 관련 함수들
export const createUser = async (data: {
  firebaseUid: string;
  email: string;
  name?: string;
  photoUrl?: string;
}) => {
  return await prisma.user.create({
    data: {
      ...data,
      settings: {
        create: {
          mode: 'SIMPLE',
          level: 1,
          consecutiveDays: 0,
          totalGoalsCreated: 0,
          totalGoalsCompleted: 0,
          showOnboarding: true,
          hasSeenSmartSuggestion: false,
          hasSeenPersonaSuggestion: false,
          preferredCategories: []
        }
      }
    },
    include: {
      settings: true
    }
  });
};

export const getUserByFirebaseUid = async (firebaseUid: string) => {
  return await prisma.user.findUnique({
    where: { firebaseUid },
    include: {
      settings: true,
      personas: true
    }
  });
};

// Persona 관련 함수들
export const createPersona = async (data: {
  userId: string;
  type: string;
  name: string;
  color: string;
  icon: string;
  settings?: any;
}) => {
  return await prisma.persona.create({
    data
  });
};

export const getUserPersonas = async (userId: string) => {
  return await prisma.persona.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  });
};

export const updatePersona = async (id: string, data: Prisma.PersonaUpdateInput) => {
  return await prisma.persona.update({
    where: { id },
    data
  });
};

export const deletePersona = async (id: string) => {
  return await prisma.persona.delete({
    where: { id }
  });
};

// Goal 관련 함수들
export const createGoal = async (data: {
  personaId: string;
  type: string;
  title: string;
  description?: string;
  status?: string;
  progress?: number;
  dueDate?: Date;
  category?: string;
  parentGoalId?: string;
}) => {
  return await prisma.goal.create({
    data: {
      ...data,
      status: data.status || 'PENDING',
      progress: data.progress || 0
    }
  });
};

export const getPersonaGoals = async (personaId: string) => {
  return await prisma.goal.findMany({
    where: { 
      personaId,
      isHidden: false
    },
    orderBy: { createdAt: 'desc' },
    include: {
      subGoals: true,
      activities: {
        orderBy: { timestamp: 'desc' },
        take: 5
      }
    }
  });
};

export const getAllUserGoals = async (userId: string) => {
  const personas = await prisma.persona.findMany({
    where: { userId },
    select: { id: true }
  });
  
  const personaIds = personas.map(p => p.id);
  
  return await prisma.goal.findMany({
    where: { 
      personaId: { in: personaIds },
      isHidden: false
    },
    orderBy: { createdAt: 'desc' },
    include: {
      persona: true
    }
  });
};

export const updateGoal = async (id: string, data: Prisma.GoalUpdateInput) => {
  // 완료 상태로 변경 시 completedAt 설정
  if (data.status === 'COMPLETED' && !data.completedAt) {
    data.completedAt = new Date();
  }
  
  return await prisma.goal.update({
    where: { id },
    data
  });
};

export const deleteGoal = async (id: string) => {
  return await prisma.goal.delete({
    where: { id }
  });
};

// Activity 관련 함수들
export const createActivity = async (data: {
  goalId: string;
  action: string;
  details?: any;
}) => {
  return await prisma.activity.create({
    data
  });
};

export const getGoalActivities = async (goalId: string) => {
  return await prisma.activity.findMany({
    where: { goalId },
    orderBy: { timestamp: 'desc' }
  });
};

// UserSettings 관련 함수들
export const updateUserSettings = async (userId: string, data: Prisma.UserSettingsUpdateInput) => {
  return await prisma.userSettings.update({
    where: { userId },
    data
  });
};

export const incrementUserStats = async (userId: string, field: 'totalGoalsCreated' | 'totalGoalsCompleted') => {
  return await prisma.userSettings.update({
    where: { userId },
    data: {
      [field]: { increment: 1 }
    }
  });
};

// 기본 페르소나 생성
export const createDefaultPersonas = async (userId: string) => {
  const defaultPersonas = [
    {
      userId,
      type: 'LEARNER',
      name: '학습자',
      color: '#4F46E5',
      icon: '📚'
    },
    {
      userId,
      type: 'PERSONAL',
      name: '개인',
      color: '#10B981',
      icon: '🏠'
    },
    {
      userId,
      type: 'PROFESSIONAL',
      name: '직장인',
      color: '#F59E0B',
      icon: '💼'
    }
  ];

  return await prisma.persona.createMany({
    data: defaultPersonas
  });
};