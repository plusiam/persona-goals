'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePersonaStore } from '@/store/personaStore';
import { useUserModeStore } from '@/store/userModeStore';
import { Button } from '@/components/ui/Button';
import { LogOut, User, Zap, Users, Sparkles } from 'lucide-react';
import { UserMode } from '@/types/userMode';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { getActivePersona } = usePersonaStore();
  const { settings } = useUserModeStore();
  const activePersona = getActivePersona();
  
  const getModeIcon = () => {
    switch (settings.mode) {
      case UserMode.SIMPLE:
        return <Sparkles className="w-4 h-4" />;
      case UserMode.SMART:
        return <Zap className="w-4 h-4" />;
      case UserMode.PERSONA:
        return <Users className="w-4 h-4" />;
    }
  };
  
  const getModeName = () => {
    switch (settings.mode) {
      case UserMode.SIMPLE:
        return 'Simple';
      case UserMode.SMART:
        return 'Smart';
      case UserMode.PERSONA:
        return 'Persona';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                Persona Goals
              </h1>
              <div className="flex items-center space-x-3">
                {/* 현재 모드 표시 */}
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                  {getModeIcon()}
                  <span className="text-sm font-medium">
                    {getModeName()} Mode
                  </span>
                </div>
                
                {/* 페르소나 모드일 때만 현재 페르소나 표시 */}
                {settings.mode === UserMode.PERSONA && activePersona && (
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100">
                    <span className="text-lg">{activePersona.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {activePersona.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="w-4 h-4" />
                    <span>{user.displayName || user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};