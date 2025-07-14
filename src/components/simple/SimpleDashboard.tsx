'use client';

import React, { useEffect } from 'react';
import { SimpleGoalList } from './SimpleGoalList';
import { SimpleAddGoal } from './SimpleAddGoal';
import { LevelIndicator } from './LevelIndicator';
import { SmartSuggestion } from '../SmartSuggestion';
import { useUserModeStore } from '@/store/userModeStore';

export const SimpleDashboard: React.FC = () => {
  const { updateConsecutiveDays } = useUserModeStore();

  useEffect(() => {
    // 매일 연속 사용일수 업데이트
    updateConsecutiveDays();
  }, [updateConsecutiveDays]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-4 sm:space-y-6">
          {/* 레벨 표시 */}
          <LevelIndicator />
          
          {/* 목표 리스트 */}
          <SimpleGoalList />
          
          {/* 목표 추가 버튼 - 모바일에서 하단 고정 */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 to-transparent sm:relative sm:p-0 sm:bg-none">
            <SimpleAddGoal />
          </div>
        </div>
      </div>
      
      {/* 스마트 제안 */}
      <SmartSuggestion />
    </>
  );
};