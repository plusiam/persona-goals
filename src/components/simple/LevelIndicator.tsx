'use client';

import React from 'react';
import { useUserModeStore } from '@/store/userModeStore';
import { Trophy, Star, Zap, Target, Rocket } from 'lucide-react';

const levelIcons = [
  { icon: Target, color: 'text-gray-500' },
  { icon: Zap, color: 'text-blue-500' },
  { icon: Star, color: 'text-yellow-500' },
  { icon: Trophy, color: 'text-purple-500' },
  { icon: Rocket, color: 'text-red-500' }
];

const levelNames = [
  '시작',
  '초보자',
  '성취자',
  '전문가',
  '마스터'
];

export const LevelIndicator: React.FC = () => {
  const { settings } = useUserModeStore();
  const { level, consecutiveDays, totalGoalsCompleted } = settings;
  
  const currentLevel = level - 1; // 0-indexed
  const Icon = levelIcons[currentLevel].icon;
  const color = levelIcons[currentLevel].color;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-8 h-8 ${color}`} />
          <div>
            <h3 className="text-lg font-semibold">
              레벨 {level} - {levelNames[currentLevel]}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>🔥 {consecutiveDays}일 연속</span>
              <span>✅ {totalGoalsCompleted}개 완료</span>
            </div>
          </div>
        </div>
        
        {/* 레벨 프로그레스 */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`w-2 h-8 rounded-full transition-colors ${
                lvl <= level ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* 다음 레벨 힌트 */}
      {level < 5 && (
        <p className="text-xs text-gray-500 mt-2">
          {level === 1 && '목표를 꾸준히 달성하면 새로운 기능이 열려요!'}
          {level === 2 && '진행률 히스토리 기능이 활성화되었어요!'}
          {level === 3 && 'AI 목표 추천 기능을 사용할 수 있어요!'}
          {level === 4 && '역할별 관리 기능이 곧 제안됩니다!'}
        </p>
      )}
    </div>
  );
};