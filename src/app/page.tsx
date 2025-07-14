'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePersonaStore } from '@/store/personaStore';
import { useUserModeStore } from '@/store/userModeStore';
import { AuthForm } from '@/components/AuthForm';
import { Layout } from '@/components/Layout';
import { SimpleDashboard } from '@/components/simple/SimpleDashboard';
import { SmartDashboard } from '@/components/smart/SmartDashboard';
import { PersonaSwitcher } from '@/components/PersonaSwitcher';
import { GoalList } from '@/components/GoalList';
import { AddGoalForm } from '@/components/AddGoalForm';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { UserMode } from '@/types/userMode';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { personas, isLoading: personasLoading, setUserId, loadPersonas, loadAllGoals } = usePersonaStore();
  const { settings } = useUserModeStore();

  useEffect(() => {
    if (user) {
      // PostgreSQL에서 사용자 ID 가져오기
      fetch(`/api/users/firebase/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUserId(data.user.id);
            loadPersonas();
            
            // Simple 모드에서는 모든 목표 로드
            if (settings.mode === UserMode.SIMPLE) {
              loadAllGoals();
            }
          }
        })
        .catch(console.error);
    }
  }, [user, setUserId, loadPersonas, loadAllGoals, settings.mode]);

  if (loading || personasLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  // 사용자 모드에 따라 다른 UI 렌더링
  if (settings.mode === UserMode.SIMPLE) {
    return (
      <Layout>
        <SimpleDashboard />
      </Layout>
    );
  }

  if (settings.mode === UserMode.SMART) {
    return (
      <Layout>
        <SmartDashboard />
      </Layout>
    );
  }

  // Persona 모드
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 페르소나 전환 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">나의 페르소나</h2>
            </CardHeader>
            <CardContent>
              <PersonaSwitcher />
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 목표 관리 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">목표 관리</h2>
                <div className="text-sm text-gray-500">
                  {personas.find(p => p.id === usePersonaStore.getState().activePersonaId)?.name} 모드
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <AddGoalForm />
                <GoalList />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}