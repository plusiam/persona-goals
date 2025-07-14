'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Calendar, Sparkles } from 'lucide-react';
import { usePersonaStore } from '@/store/personaStore';
import { useUserModeStore } from '@/store/userModeStore';
import { GoalType, GoalStatus } from '@/types/firebase';
import { structureGoalWithAI, categorizeGoal } from '@/lib/ai-helpers';

export const SimpleAddGoal: React.FC = () => {
  const { activePersonaId, addGoal, personas } = usePersonaStore();
  const { recordGoalCreation, recordActivity, canAccessFeature } = useUserModeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [goalText, setGoalText] = useState('');
  const [duration, setDuration] = useState('week'); // today, week, month, year
  const [isLoading, setIsLoading] = useState(false);

  const canUseAI = canAccessFeature('ai_suggestions');

  const handleSubmit = async () => {
    if (!goalText.trim()) return;

    setIsLoading(true);
    try {
      // AI가 활성화되어 있고 사용자가 원하면 목표를 구조화
      let structuredGoals = null;
      if (canUseAI && duration !== 'today') {
        structuredGoals = await structureGoalWithAI(goalText, duration);
      }

      // 가장 적절한 페르소나 찾기 (Simple 모드에서는 백그라운드에서만 동작)
      const targetPersonaId = activePersonaId || personas[0]?.id;
      
      if (!targetPersonaId) return;

      if (structuredGoals) {
        // AI가 구조화한 목표들 추가
        for (const goal of structuredGoals) {
          await addGoal(targetPersonaId, goal);
        }
      } else {
        // 단순 목표 추가
        const category = await categorizeGoal(goalText);
        
        await addGoal(targetPersonaId, {
          title: goalText.trim(),
          type: GoalType.TASK,
          status: GoalStatus.PENDING,
          progress: 0,
          dueDate: getDueDate(duration),
          category
        });
      }

      recordGoalCreation();
      recordActivity();
      
      // Reset
      setGoalText('');
      setStep(1);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDueDate = (duration: string) => {
    const date = new Date();
    switch (duration) {
      case 'today':
        return date;
      case 'week':
        date.setDate(date.getDate() + 7);
        return date;
      case 'month':
        date.setMonth(date.getMonth() + 1);
        return date;
      case 'year':
        date.setFullYear(date.getFullYear() + 1);
        return date;
      default:
        return undefined;
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full shadow-lg"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        새 목표 추가
      </Button>
    );
  }

  return (
    <>
      {/* 모바일 전체화면 모달 배경 */}
      <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" onClick={() => setIsOpen(false)} />
      
      {/* 모바일에서는 하단 시트, 데스크톱에서는 카드 */}
      <div className="fixed inset-x-0 bottom-0 z-50 sm:relative sm:inset-auto">
        <Card className="rounded-t-2xl sm:rounded-lg animate-slide-up sm:animate-none">
          <CardContent className="p-4 sm:p-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold">무엇을 이루고 싶나요?</h3>
                
                <textarea
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  placeholder="예: 영어로 자유롭게 대화하기"
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  rows={3}
                  autoFocus
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!goalText.trim()}
                    className="flex-1"
                  >
                    다음
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setGoalText('');
                      setStep(1);
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold">언제까지 하고 싶나요?</h3>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => setDuration('today')}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      duration === 'today' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 mx-auto mb-1 sm:mb-2 text-gray-600" />
                    <p className="font-medium text-sm sm:text-base">오늘</p>
                    <p className="text-xs text-gray-500 hidden sm:block">바로 시작하기</p>
                  </button>
                  
                  <button
                    onClick={() => setDuration('week')}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      duration === 'week' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 mx-auto mb-1 sm:mb-2 text-gray-600" />
                    <p className="font-medium text-sm sm:text-base">이번 주</p>
                    <p className="text-xs text-gray-500 hidden sm:block">7일간</p>
                  </button>
                  
                  <button
                    onClick={() => setDuration('month')}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      duration === 'month' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 mx-auto mb-1 sm:mb-2 text-gray-600" />
                    <p className="font-medium text-sm sm:text-base">이번 달</p>
                    <p className="text-xs text-gray-500 hidden sm:block">30일간</p>
                  </button>
                  
                  <button
                    onClick={() => setDuration('year')}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all relative ${
                      duration === 'year' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {canUseAI && (
                      <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 absolute top-1 right-1 sm:top-2 sm:right-2 text-purple-500" />
                    )}
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 mx-auto mb-1 sm:mb-2 text-gray-600" />
                    <p className="font-medium text-sm sm:text-base">올해</p>
                    <p className="text-xs text-gray-500 hidden sm:block">장기 목표</p>
                  </button>
                </div>

                {canUseAI && duration !== 'today' && (
                  <p className="text-xs text-purple-600 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI가 단계별 목표로 나누어 드려요
                  </p>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                  >
                    이전
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    완료!
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};