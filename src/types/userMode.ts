export enum UserMode {
  SIMPLE = 'SIMPLE',
  SMART = 'SMART',
  PERSONA = 'PERSONA'
}

export enum UserLevel {
  LEVEL_1 = 1, // 첫 목표
  LEVEL_2 = 2, // 1주 사용
  LEVEL_3 = 3, // 첫 완료
  LEVEL_4 = 4, // 2주 연속
  LEVEL_5 = 5  // 1개월
}

export interface UserSettings {
  mode: UserMode;
  level: UserLevel;
  firstGoalDate?: Date;
  lastActiveDate?: Date;
  consecutiveDays: number;
  totalGoalsCreated: number;
  totalGoalsCompleted: number;
  showOnboarding: boolean;
  hasSeenSmartSuggestion: boolean;
  hasSeenPersonaSuggestion: boolean;
  preferredCategories?: string[];
  activeHours?: Record<number, number>; // hour -> activity count
}

export interface SmartSuggestion {
  type: 'CATEGORY_DETECTED' | 'TIME_PATTERN' | 'UPGRADE_PROMPT';
  title: string;
  description: string;
  action: () => void;
  dismissAction: () => void;
}