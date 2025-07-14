'use client';

import React from 'react';
import { usePersonaStore } from '@/store/personaStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const PersonaSwitcher: React.FC = () => {
  const { personas, activePersonaId, switchPersona, isAutoSwitchEnabled, toggleAutoSwitch } = usePersonaStore();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">페르소나</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAutoSwitch}
          className="text-sm"
        >
          {isAutoSwitchEnabled ? '자동 전환 ON' : '자동 전환 OFF'}
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => switchPersona(persona.id!)}
            className={cn(
              'relative p-4 rounded-lg border-2 transition-all duration-200',
              'hover:shadow-md hover:scale-105',
              'flex flex-col items-center space-y-2',
              activePersonaId === persona.id
                ? 'border-opacity-100 shadow-lg scale-105'
                : 'border-opacity-30'
            )}
            style={{
              borderColor: persona.color,
              backgroundColor: activePersonaId === persona.id ? `${persona.color}10` : 'white'
            }}
          >
            <span className="text-3xl">{persona.icon}</span>
            <span className={cn(
              'text-sm font-medium',
              activePersonaId === persona.id ? 'text-gray-900' : 'text-gray-600'
            )}>
              {persona.name}
            </span>
            
            {activePersonaId === persona.id && (
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: persona.color }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};