import { Timestamp } from 'firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PersonaData {
  id?: string;
  userId: string;
  type: PersonaType;
  name: string;
  color: string;
  icon: string;
  settings?: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GoalData {
  id?: string;
  personaId: string;
  type: GoalType;
  title: string;
  description?: string;
  status: GoalStatus;
  progress: number;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  parentGoalId?: string;
}

export interface ActivityData {
  id?: string;
  goalId: string;
  userId: string;
  action: string;
  details?: Record<string, any>;
  timestamp: Timestamp;
}

export enum PersonaType {
  LEARNER = 'LEARNER',
  PERSONAL = 'PERSONAL',
  PROFESSIONAL = 'PROFESSIONAL',
  CUSTOM = 'CUSTOM'
}

export enum GoalType {
  DREAM = 'DREAM',
  PROJECT = 'PROJECT',
  HABIT = 'HABIT',
  TASK = 'TASK'
}

export enum GoalStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}