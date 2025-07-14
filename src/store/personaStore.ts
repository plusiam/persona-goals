import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonaType, PersonaData, GoalData, GoalType, GoalStatus } from '@/types/firebase';
import { 
  createPersona as createPersonaDB, 
  getUserPersonas, 
  updatePersona as updatePersonaDB,
  deletePersona as deletePersonaDB,
  createGoal as createGoalDB,
  getPersonaGoals,
  updateGoal as updateGoalDB,
  deleteGoal as deleteGoalDB
} from '@/lib/firebase-helpers';

interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
}

interface PersonaTheme {
  color: string;
  icon: string;
  theme: Theme;
}

const defaultThemes: Record<PersonaType, PersonaTheme> = {
  [PersonaType.LEARNER]: {
    color: '#4F46E5',
    icon: '📚',
    theme: {
      primary: '#4F46E5',
      secondary: '#E0E7FF',
      background: '#F3F4F6',
      text: '#1F2937',
      border: '#E5E7EB'
    }
  },
  [PersonaType.PERSONAL]: {
    color: '#10B981',
    icon: '🏠',
    theme: {
      primary: '#10B981',
      secondary: '#D1FAE5',
      background: '#ECFDF5',
      text: '#064E3B',
      border: '#A7F3D0'
    }
  },
  [PersonaType.PROFESSIONAL]: {
    color: '#F59E0B',
    icon: '💼',
    theme: {
      primary: '#F59E0B',
      secondary: '#FEF3C7',
      background: '#FFFBEB',
      text: '#78350F',
      border: '#FDE68A'
    }
  },
  [PersonaType.CUSTOM]: {
    color: '#8B5CF6',
    icon: '✨',
    theme: {
      primary: '#8B5CF6',
      secondary: '#EDE9FE',
      background: '#F5F3FF',
      text: '#4C1D95',
      border: '#DDD6FE'
    }
  }
};

interface PersonaStore {
  userId: string | null;
  activePersonaId: string | null;
  personas: PersonaData[];
  goals: Record<string, GoalData[]>; // personaId -> goals
  isAutoSwitchEnabled: boolean;
  isLoading: boolean;
  
  // User Actions
  setUserId: (userId: string) => void;
  
  // Persona Actions
  loadPersonas: () => Promise<void>;
  setActivePersona: (personaId: string) => void;
  switchPersona: (personaId: string) => void;
  addPersona: (personaData: Omit<PersonaData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePersona: (personaId: string, updates: Partial<PersonaData>) => Promise<void>;
  deletePersona: (personaId: string) => Promise<void>;
  toggleAutoSwitch: () => void;
  
  // Goal Actions
  loadGoals: (personaId: string) => Promise<void>;
  addGoal: (personaId: string, goalData: Omit<GoalData, 'id' | 'personaId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (goalId: string, personaId: string, updates: Partial<GoalData>) => Promise<void>;
  deleteGoal: (goalId: string, personaId: string) => Promise<void>;
  
  // Computed
  getActivePersona: () => PersonaData | null;
  getPersonaByType: (type: PersonaType) => PersonaData | undefined;
  getAutoSwitchPersona: () => string | null;
  applyTheme: (personaId: string) => void;
  
  // Initialize default personas
  initializeDefaultPersonas: () => Promise<void>;
}

export const usePersonaStore = create<PersonaStore>()(
  persist(
    (set, get) => ({
      userId: null,
      activePersonaId: null,
      personas: [],
      goals: {},
      isAutoSwitchEnabled: false,
      isLoading: false,
      
      setUserId: (userId) => {
        set({ userId });
      },
      
      loadPersonas: async () => {
        const userId = get().userId;
        if (!userId) return;
        
        set({ isLoading: true });
        try {
          const personas = await getUserPersonas(userId);
          set({ personas, isLoading: false });
          
          // 활성 페르소나가 없으면 첫 번째로 설정
          if (!get().activePersonaId && personas.length > 0) {
            get().setActivePersona(personas[0].id!);
          }
        } catch (error) {
          console.error('Failed to load personas:', error);
          set({ isLoading: false });
        }
      },
      
      setActivePersona: (personaId) => {
        set({ activePersonaId: personaId });
        get().applyTheme(personaId);
        get().loadGoals(personaId);
      },
      
      switchPersona: (personaId) => {
        const persona = get().personas.find(p => p.id === personaId);
        if (persona) {
          set({ activePersonaId: personaId });
          get().applyTheme(personaId);
          get().loadGoals(personaId);
        }
      },
      
      addPersona: async (personaData) => {
        const userId = get().userId;
        if (!userId) return;
        
        try {
          const newPersona = await createPersonaDB({
            ...personaData,
            userId
          });
          
          set((state) => ({
            personas: [...state.personas, newPersona]
          }));
          
          // 첫 번째 페르소나인 경우 활성화
          if (get().personas.length === 1) {
            get().setActivePersona(newPersona.id!);
          }
        } catch (error) {
          console.error('Failed to create persona:', error);
        }
      },
      
      updatePersona: async (personaId, updates) => {
        try {
          await updatePersonaDB(personaId, updates);
          
          set((state) => ({
            personas: state.personas.map(p =>
              p.id === personaId ? { ...p, ...updates } : p
            )
          }));
        } catch (error) {
          console.error('Failed to update persona:', error);
        }
      },
      
      deletePersona: async (personaId) => {
        try {
          await deletePersonaDB(personaId);
          
          set((state) => ({
            personas: state.personas.filter(p => p.id !== personaId),
            activePersonaId: state.activePersonaId === personaId ? null : state.activePersonaId,
            goals: { ...state.goals, [personaId]: [] }
          }));
        } catch (error) {
          console.error('Failed to delete persona:', error);
        }
      },
      
      toggleAutoSwitch: () => {
        set((state) => ({ isAutoSwitchEnabled: !state.isAutoSwitchEnabled }));
      },
      
      loadGoals: async (personaId) => {
        try {
          const goals = await getPersonaGoals(personaId);
          set((state) => ({
            goals: { ...state.goals, [personaId]: goals }
          }));
        } catch (error) {
          console.error('Failed to load goals:', error);
        }
      },
      
      addGoal: async (personaId, goalData) => {
        try {
          const newGoal = await createGoalDB({
            ...goalData,
            personaId
          });
          
          set((state) => ({
            goals: {
              ...state.goals,
              [personaId]: [...(state.goals[personaId] || []), newGoal]
            }
          }));
        } catch (error) {
          console.error('Failed to create goal:', error);
        }
      },
      
      updateGoal: async (goalId, personaId, updates) => {
        try {
          await updateGoalDB(goalId, updates);
          
          set((state) => ({
            goals: {
              ...state.goals,
              [personaId]: state.goals[personaId]?.map(g =>
                g.id === goalId ? { ...g, ...updates } : g
              ) || []
            }
          }));
        } catch (error) {
          console.error('Failed to update goal:', error);
        }
      },
      
      deleteGoal: async (goalId, personaId) => {
        try {
          await deleteGoalDB(goalId);
          
          set((state) => ({
            goals: {
              ...state.goals,
              [personaId]: state.goals[personaId]?.filter(g => g.id !== goalId) || []
            }
          }));
        } catch (error) {
          console.error('Failed to delete goal:', error);
        }
      },
      
      getActivePersona: () => {
        const state = get();
        return state.personas.find(p => p.id === state.activePersonaId) || null;
      },
      
      getPersonaByType: (type) => {
        return get().personas.find(p => p.type === type);
      },
      
      getAutoSwitchPersona: () => {
        if (!get().isAutoSwitchEnabled) return null;
        
        const hour = new Date().getHours();
        const day = new Date().getDay();
        
        // 주중 업무 시간 (9-18시)
        if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
          const professional = get().getPersonaByType(PersonaType.PROFESSIONAL);
          return professional?.id || null;
        }
        
        // 아침/저녁 학습 시간 (6-9시, 19-22시)
        if ((hour >= 6 && hour < 9) || (hour >= 19 && hour < 22)) {
          const learner = get().getPersonaByType(PersonaType.LEARNER);
          return learner?.id || null;
        }
        
        // 그 외 개인 시간
        const personal = get().getPersonaByType(PersonaType.PERSONAL);
        return personal?.id || null;
      },
      
      applyTheme: (personaId) => {
        const persona = get().personas.find(p => p.id === personaId);
        if (!persona) return;
        
        const theme = defaultThemes[persona.type].theme;
        const root = document.documentElement;
        
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--background-color', theme.background);
        root.style.setProperty('--text-color', theme.text);
        root.style.setProperty('--border-color', theme.border);
      },
      
      initializeDefaultPersonas: async () => {
        const userId = get().userId;
        if (!userId || get().personas.length > 0) return;
        
        const defaultPersonas = [
          {
            type: PersonaType.LEARNER,
            name: '학습자',
            color: defaultThemes[PersonaType.LEARNER].color,
            icon: defaultThemes[PersonaType.LEARNER].icon,
            settings: {}
          },
          {
            type: PersonaType.PERSONAL,
            name: '개인',
            color: defaultThemes[PersonaType.PERSONAL].color,
            icon: defaultThemes[PersonaType.PERSONAL].icon,
            settings: {}
          },
          {
            type: PersonaType.PROFESSIONAL,
            name: '직장인',
            color: defaultThemes[PersonaType.PROFESSIONAL].color,
            icon: defaultThemes[PersonaType.PROFESSIONAL].icon,
            settings: {}
          }
        ];
        
        for (const persona of defaultPersonas) {
          await get().addPersona(persona);
        }
      }
    }),
    {
      name: 'persona-storage',
      partialize: (state) => ({
        activePersonaId: state.activePersonaId,
        isAutoSwitchEnabled: state.isAutoSwitchEnabled
      })
    }
  )
);