import { GoalData } from '@/store/personaStore';

interface TimePattern {
  hour: number;
  count: number;
  percentage: number;
}

interface CategoryPattern {
  category: string;
  count: number;
  percentage: number;
  avgProgress: number;
  completionRate: number;
}

interface UserPattern {
  timePatterns: TimePattern[];
  categoryPatterns: CategoryPattern[];
  mostActiveHours: number[];
  preferredCategories: string[];
  avgCompletionTime: number;
  overallCompletionRate: number;
}

export function analyzeUserPatterns(
  goals: GoalData[],
  activities: Record<number, number>
): UserPattern {
  // 시간대별 활동 분석
  const timePatterns = analyzeTimePatterns(activities);
  
  // 카테고리별 패턴 분석
  const categoryPatterns = analyzeCategoryPatterns(goals);
  
  // 가장 활발한 시간대
  const mostActiveHours = timePatterns
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(p => p.hour);
  
  // 선호 카테고리
  const preferredCategories = categoryPatterns
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(p => p.category);
  
  // 평균 완료 시간 (일)
  const completedGoals = goals.filter(g => g.status === 'COMPLETED');
  const avgCompletionTime = completedGoals.length > 0
    ? completedGoals.reduce((sum, goal) => {
        const created = new Date(goal.createdAt || Date.now());
        const completed = new Date(goal.completedAt || Date.now());
        const days = (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0) / completedGoals.length
    : 0;
  
  // 전체 완료율
  const overallCompletionRate = goals.length > 0
    ? (completedGoals.length / goals.length) * 100
    : 0;
  
  return {
    timePatterns,
    categoryPatterns,
    mostActiveHours,
    preferredCategories,
    avgCompletionTime,
    overallCompletionRate
  };
}

function analyzeTimePatterns(activities: Record<number, number>): TimePattern[] {
  const total = Object.values(activities).reduce((sum, count) => sum + count, 0);
  
  return Object.entries(activities)
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }))
    .sort((a, b) => a.hour - b.hour);
}

function analyzeCategoryPatterns(goals: GoalData[]): CategoryPattern[] {
  const categoryMap = new Map<string, {
    count: number;
    totalProgress: number;
    completed: number;
  }>();
  
  goals.forEach(goal => {
    const category = goal.category || '기타';
    const existing = categoryMap.get(category) || {
      count: 0,
      totalProgress: 0,
      completed: 0
    };
    
    existing.count++;
    existing.totalProgress += goal.progress;
    if (goal.status === 'COMPLETED') {
      existing.completed++;
    }
    
    categoryMap.set(category, existing);
  });
  
  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    percentage: (data.count / goals.length) * 100,
    avgProgress: data.totalProgress / data.count,
    completionRate: (data.completed / data.count) * 100
  }));
}

export function detectPatterns(goals: GoalData[]): {
  hasMultipleCategories: boolean;
  hasDiverseGoals: boolean;
  isConsistentUser: boolean;
  readyForPersonaMode: boolean;
} {
  const categories = new Set(goals.map(g => g.category || '기타'));
  const types = new Set(goals.map(g => g.type));
  
  // 완료된 목표가 5개 이상인지
  const completedCount = goals.filter(g => g.status === 'COMPLETED').length;
  
  return {
    hasMultipleCategories: categories.size >= 3,
    hasDiverseGoals: types.size >= 2,
    isConsistentUser: completedCount >= 5,
    readyForPersonaMode: categories.size >= 3 && completedCount >= 10
  };
}

export function suggestNextGoals(
  currentGoals: GoalData[],
  patterns: UserPattern
): string[] {
  const suggestions: string[] = [];
  
  // 선호 카테고리 기반 제안
  patterns.preferredCategories.forEach(category => {
    const categoryGoals = currentGoals.filter(g => g.category === category);
    if (categoryGoals.length < 3) {
      suggestions.push(`${category} 관련 목표를 더 추가해보세요`);
    }
  });
  
  // 완료율이 높은 카테고리 제안
  const highPerformanceCategories = patterns.categoryPatterns
    .filter(c => c.completionRate > 70 && c.count >= 2)
    .map(c => c.category);
  
  highPerformanceCategories.forEach(category => {
    suggestions.push(`${category} 분야에서 좋은 성과를 보이고 있어요! 더 도전적인 목표를 세워보세요`);
  });
  
  return suggestions;
}