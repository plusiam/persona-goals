'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import { useUserModeStore } from '@/store/userModeStore';
import { usePersonaStore } from '@/store/personaStore';
import { UserMode } from '@/types/userMode';

export const SmartSuggestion: React.FC = () => {
  const { 
    settings, 
    shouldShowSmartSuggestion, 
    shouldShowPersonaSuggestion,
    dismissSuggestion,
    setMode
  } = useUserModeStore();
  
  const { goals } = usePersonaStore();
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionType, setSuggestionType] = useState<'SMART' | 'PERSONA' | null>(null);

  useEffect(() => {
    // Smart Mode 제안 체크
    if (shouldShowSmartSuggestion()) {
      setShowSuggestion(true);
      setSuggestionType('SMART');
    }
    // Persona Mode 제안 체크
    else if (shouldShowPersonaSuggestion()) {
      setShowSuggestion(true);
      setSuggestionType('PERSONA');
    }
  }, [settings, shouldShowSmartSuggestion, shouldShowPersonaSuggestion]);

  if (!showSuggestion || !suggestionType) return null;

  const handleAccept = () => {
    if (suggestionType === 'SMART') {
      setMode(UserMode.SMART);
    } else if (suggestionType === 'PERSONA') {
      setMode(UserMode.PERSONA);
    }
    setShowSuggestion(false);
  };

  const handleDismiss = () => {
    dismissSuggestion(suggestionType);
    setShowSuggestion(false);
  };

  const allGoals = Object.values(goals).flat();
  const categories = new Set(allGoals.map(g => g.category || '기타')).size;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50 animate-slide-up">
      <Card className="shadow-lg border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold">
                {suggestionType === 'SMART' ? '더 체계적으로 관리해볼까요?' : '역할별로 나누어 관리해볼까요?'}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {suggestionType === 'SMART' && (
            <div className="space-y-3 mb-4">
              <p className="text-gray-600">
                현재 {allGoals.length}개의 목표를 관리하고 계시네요! 카테고리별로 분류하면 더 효율적으로 관리할 수 있어요.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>목표별 진행 추이 분석</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>시간대별 활동 패턴 파악</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI 기반 목표 추천</span>
                </div>
              </div>
            </div>
          )}

          {suggestionType === 'PERSONA' && (
            <div className="space-y-3 mb-4">
              <p className="text-gray-600">
                {categories}개 이상의 다양한 카테고리 목표를 가지고 계시네요! 역할별로 나누면 더 집중할 수 있어요.
              </p>
              
              <div className="bg-purple-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>학습자, 개인, 직장인 모드 분리</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>자동 모드 전환 기능</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span>역할별 성과 분석</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={handleAccept} className="flex-1">
              체험해보기
            </Button>
            <Button onClick={handleDismiss} variant="outline">
              나중에
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};