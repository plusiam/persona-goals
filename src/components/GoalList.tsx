'use client';

import React, { useState } from 'react';
import { usePersonaStore } from '@/store/personaStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GoalData, GoalStatus, GoalType } from '@/types/firebase';
import { Plus, Check, X, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GoalList: React.FC = () => {
  const { activePersonaId, goals, updateGoal, deleteGoal } = usePersonaStore();
  const personaGoals = activePersonaId ? goals[activePersonaId] || [] : [];

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.COMPLETED:
        return <Check className="w-4 h-4 text-green-600" />;
      case GoalStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-blue-600" />;
      case GoalStatus.CANCELLED:
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type: GoalType) => {
    switch (type) {
      case GoalType.DREAM:
        return 'bg-purple-100 text-purple-800';
      case GoalType.PROJECT:
        return 'bg-blue-100 text-blue-800';
      case GoalType.HABIT:
        return 'bg-green-100 text-green-800';
      case GoalType.TASK:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleStatusChange = async (goalId: string, newStatus: GoalStatus) => {
    if (!activePersonaId) return;
    
    const updates: Partial<GoalData> = { status: newStatus };
    if (newStatus === GoalStatus.COMPLETED) {
      updates.progress = 100;
    }
    
    await updateGoal(goalId, activePersonaId, updates);
  };

  const handleProgressChange = async (goalId: string, progress: number) => {
    if (!activePersonaId) return;
    
    const updates: Partial<GoalData> = { progress };
    if (progress === 100) {
      updates.status = GoalStatus.COMPLETED;
    } else if (progress > 0) {
      updates.status = GoalStatus.IN_PROGRESS;
    }
    
    await updateGoal(goalId, activePersonaId, updates);
  };

  const handleDelete = async (goalId: string) => {
    if (!activePersonaId || !confirm('정말로 이 목표를 삭제하시겠습니까?')) return;
    await deleteGoal(goalId, activePersonaId);
  };

  const groupedGoals = personaGoals.reduce((acc, goal) => {
    if (!acc[goal.type]) acc[goal.type] = [];
    acc[goal.type].push(goal);
    return acc;
  }, {} as Record<GoalType, GoalData[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedGoals).map(([type, typeGoals]) => (
        <div key={type} className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getTypeColor(type as GoalType))}>
              {type}
            </span>
            <span className="text-gray-500">({typeGoals.length})</span>
          </h3>
          
          <div className="space-y-2">
            {typeGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(goal.status)}
                        <h4 className={cn(
                          'font-medium',
                          goal.status === GoalStatus.COMPLETED && 'line-through text-gray-500'
                        )}>
                          {goal.title}
                        </h4>
                      </div>
                      
                      {goal.description && (
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      )}
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-500">진행률:</span>
                          <div className="flex-1 flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                            <span className="text-gray-700 font-medium">{goal.progress}%</span>
                          </div>
                        </div>
                        
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => handleProgressChange(goal.id!, parseInt(e.target.value))}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                      <select
                        value={goal.status}
                        onChange={(e) => handleStatusChange(goal.id!, e.target.value as GoalStatus)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value={GoalStatus.PENDING}>대기중</option>
                        <option value={GoalStatus.IN_PROGRESS}>진행중</option>
                        <option value={GoalStatus.COMPLETED}>완료</option>
                        <option value={GoalStatus.CANCELLED}>취소</option>
                      </select>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      {personaGoals.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          아직 목표가 없습니다. 새로운 목표를 추가해보세요!
        </div>
      )}
    </div>
  );
};