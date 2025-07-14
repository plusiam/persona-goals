'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { SimpleGoalList } from '../simple/SimpleGoalList';
import { SimpleAddGoal } from '../simple/SimpleAddGoal';
import { LevelIndicator } from '../simple/LevelIndicator';
import { StatsChart } from '../StatsChart';
import { SmartSuggestion } from '../SmartSuggestion';
import { Button } from '@/components/ui/Button';
import { BarChart3, Target, TrendingUp } from 'lucide-react';
import { useUserModeStore } from '@/store/userModeStore';
import { usePersonaStore } from '@/store/personaStore';
import { detectPatterns } from '@/lib/pattern-analysis';

export const SmartDashboard: React.FC = () => {
  const { updateConsecutiveDays, canAccessFeature } = useUserModeStore();
  const { goals } = usePersonaStore();
  const [showStats, setShowStats] = React.useState(false);
  
  const allGoals = Object.values(goals).flat();
  const patterns = detectPatterns(allGoals);

  useEffect(() => {
    updateConsecutiveDays();
  }, [updateConsecutiveDays]);

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* 상단 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LevelIndicator />
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    카테고리 다양성
                  </h3>
                  <p className="text-2xl font-bold mt-1">
                    {new Set(allGoals.map(g => g.category || '기타')).size}개
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">목표 유형</p>
                  <p className="text-lg font-semibold">
                    {new Set(allGoals.map(g => g.type)).size}종
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    성장 지표
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {patterns.isConsistentUser ? '꾸준한 사용자' : '성장 중'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStats(!showStats)}
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  통계
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 통계 차트 (토글) */}
        {showStats && canAccessFeature('progress_history') && (
          <div className="animate-fade-in">
            <StatsChart />
          </div>
        )}

        {/* 목표 관리 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SimpleGoalList />
          </div>
          
          <div className="space-y-6">
            <SimpleAddGoal />
            
            {/* 추천 사항 */}
            {patterns.hasMultipleCategories && (
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-semibold">💡 인사이트</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 다양한 카테고리의 목표를 관리 중이에요</li>
                    {patterns.hasDiverseGoals && (
                      <li>• 장기/단기 목표의 균형이 좋아요</li>
                    )}
                    {patterns.readyForPersonaMode && (
                      <li className="text-purple-600 font-medium">
                        • 페르소나 모드를 사용할 준비가 되었어요!
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* 스마트 제안 */}
      <SmartSuggestion />
    </>
  );
};