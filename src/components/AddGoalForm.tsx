'use client';

import React, { useState } from 'react';
import { usePersonaStore } from '@/store/personaStore';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { GoalType, GoalStatus } from '@/types/firebase';
import { Plus, X } from 'lucide-react';

export const AddGoalForm: React.FC = () => {
  const { activePersonaId, addGoal } = usePersonaStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>(GoalType.TASK);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePersonaId || !title.trim()) return;

    setIsLoading(true);
    try {
      await addGoal(activePersonaId, {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        status: GoalStatus.PENDING,
        progress: 0
      });

      // Reset form
      setTitle('');
      setDescription('');
      setType(GoalType.TASK);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        새 목표 추가
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">새 목표 추가</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              목표 제목 *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 매일 30분 운동하기"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              설명 (선택사항)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="목표에 대한 자세한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              목표 유형
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as GoalType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={GoalType.DREAM}>꿈 (장기 목표)</option>
              <option value={GoalType.PROJECT}>프로젝트</option>
              <option value={GoalType.HABIT}>습관</option>
              <option value={GoalType.TASK}>할 일</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              isLoading={isLoading}
              className="flex-1"
            >
              추가
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};