'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { analyzeUserPatterns } from '@/lib/pattern-analysis';
import { usePersonaStore } from '@/store/personaStore';
import { useUserModeStore } from '@/store/userModeStore';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const StatsChart: React.FC = () => {
  const { goals } = usePersonaStore();
  const { settings } = useUserModeStore();
  
  // 모든 목표 합치기
  const allGoals = Object.values(goals).flat();
  
  // 패턴 분석
  const patterns = analyzeUserPatterns(allGoals, settings.activeHours || {});
  
  // 시간대별 활동 차트 데이터
  const timeData = patterns.timePatterns.map(p => ({
    hour: `${p.hour}시`,
    활동: p.count
  }));
  
  // 카테고리별 목표 분포
  const categoryData = patterns.categoryPatterns.map((p, index) => ({
    name: p.category,
    value: p.count,
    color: COLORS[index % COLORS.length]
  }));
  
  // 진행률 데이터
  const progressData = patterns.categoryPatterns.map(p => ({
    category: p.category,
    평균진행률: Math.round(p.avgProgress),
    완료율: Math.round(p.completionRate)
  }));

  return (
    <div className="space-y-6">
      {/* 시간대별 활동 패턴 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">시간대별 활동 패턴</h3>
          <p className="text-sm text-gray-500">
            가장 활발한 시간: {patterns.mostActiveHours.map(h => `${h}시`).join(', ')}
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="활동" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 카테고리별 목표 분포 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">카테고리별 목표 분포</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">카테고리별 성과</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="평균진행률" fill="#10B981" />
                <Bar dataKey="완료율" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 전체 통계 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">전체 성과</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{allGoals.length}</p>
              <p className="text-sm text-gray-600">전체 목표</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(patterns.overallCompletionRate)}%
              </p>
              <p className="text-sm text-gray-600">완료율</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(patterns.avgCompletionTime)}일
              </p>
              <p className="text-sm text-gray-600">평균 완료 시간</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {patterns.preferredCategories[0] || '없음'}
              </p>
              <p className="text-sm text-gray-600">주요 카테고리</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};