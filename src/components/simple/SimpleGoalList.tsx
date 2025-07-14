'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Clock, ChevronRight } from 'lucide-react';
import { usePersonaStore } from '@/store/personaStore';
import { useUserModeStore } from '@/store/userModeStore';
import { GoalStatus } from '@/types/firebase';
import { cn } from '@/lib/utils';

export const SimpleGoalList: React.FC = () => {
  const { activePersonaId, goals, updateGoal } = usePersonaStore();
  const { recordActivity, recordGoalCompletion } = useUserModeStore();
  
  // Simple 모드에서는 모든 페르소나의 목표를 합쳐서 보여줌
  const allGoals = Object.values(goals).flat().filter(g => 
    g.status !== GoalStatus.COMPLETED && g.status !== GoalStatus.CANCELLED
  );

  const handleComplete = async (goalId: string, personaId: string) => {
    await updateGoal(goalId, personaId, { 
      status: GoalStatus.COMPLETED,
      progress: 100 
    });
    recordActivity();
    recordGoalCompletion();
  };

  const handleProgress = async (goalId: string, personaId: string, increment: number) => {
    const goal = allGoals.find(g => g.id === goalId);
    if (!goal) return;

    const newProgress = Math.min(100, Math.max(0, goal.progress + increment));
    const newStatus = newProgress === 100 ? GoalStatus.COMPLETED : 
                     newProgress > 0 ? GoalStatus.IN_PROGRESS : GoalStatus.PENDING;
    
    await updateGoal(goalId, personaId, { 
      progress: newProgress,
      status: newStatus
    });
    recordActivity();
    
    if (newStatus === GoalStatus.COMPLETED) {
      recordGoalCompletion();
    }
  };

  const handleDelay = async (goalId: string, personaId: string) => {
    // 미루기 - 진행률은 유지하되 오늘은 숨김
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await updateGoal(goalId, personaId, { 
      dueDate: tomorrow
    });
    recordActivity();
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">오늘의 목표</h2>
      
      {allGoals.length === 0 ? (
        <Card className="p-6 sm:p-8 text-center">
          <p className="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">아직 목표가 없어요!</p>
          <p className="text-xs sm:text-sm text-gray-400">아래 버튼을 눌러 첫 목표를 만들어보세요</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {allGoals.map((goal) => {
            const personaId = goal.personaId;
            
            return (
              <Card key={goal.id} className="p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">{goal.title}</h3>
                  
                  {/* 진행률 바 */}
                  <div className="relative h-6 sm:h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
                      style={{ width: `${goal.progress}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {goal.progress}%
                      </span>
                    </div>
                  </div>
                  
                  {/* 액션 버튼들 - 모바일에서는 세로 배치 */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleComplete(goal.id!, personaId)}
                      className="w-full sm:flex-1 h-10 sm:h-auto"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      <span className="text-sm">했어요</span>
                    </Button>
                    
                    <div className="flex gap-2 sm:flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProgress(goal.id!, personaId, 20)}
                        className="flex-1"
                      >
                        <span className="hidden sm:inline text-sm">조금 했어요</span>
                        <span className="sm:hidden text-sm">+20%</span>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelay(goal.id!, personaId)}
                        className="flex-1"
                      >
                        <Clock className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline text-sm">미루기</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};