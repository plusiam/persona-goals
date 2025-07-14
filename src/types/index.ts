export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Persona {
  id: string;
  userId: string;
  type: PersonaType;
  name: string;
  color: string;
  icon: string;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  goals?: Goal[];
}

export interface Goal {
  id: string;
  personaId: string;
  type: GoalType;
  title: string;
  description?: string;
  status: GoalStatus;
  progress: number;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  persona?: Persona;
  activities?: Activity[];
  subGoals?: Goal[];
  parentGoal?: Goal;
  parentGoalId?: string;
}

export interface Activity {
  id: string;
  goalId: string;
  action: string;
  details?: Record<string, any>;
  timestamp: Date;
  goal?: Goal;
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

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
}