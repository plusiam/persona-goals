import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserMode, UserLevel, UserSettings, SmartSuggestion } from '@/types/userMode';

interface UserModeStore {
  settings: UserSettings;
  currentSuggestion: SmartSuggestion | null;
  
  // Mode actions
  setMode: (mode: UserMode) => void;
  upgradeLevel: () => void;
  
  // Activity tracking
  recordActivity: (hour?: number) => void;
  recordGoalCreation: () => void;
  recordGoalCompletion: () => void;
  updateConsecutiveDays: () => void;
  
  // Smart detection
  shouldShowSmartSuggestion: () => boolean;
  shouldShowPersonaSuggestion: () => boolean;
  setSuggestion: (suggestion: SmartSuggestion | null) => void;
  dismissSuggestion: (type: string) => void;
  
  // Feature checks
  canAccessFeature: (feature: string) => boolean;
  getAvailableFeatures: () => string[];
}

const defaultSettings: UserSettings = {
  mode: UserMode.SIMPLE,
  level: UserLevel.LEVEL_1,
  consecutiveDays: 0,
  totalGoalsCreated: 0,
  totalGoalsCompleted: 0,
  showOnboarding: true,
  hasSeenSmartSuggestion: false,
  hasSeenPersonaSuggestion: false,
  activeHours: {}
};

export const useUserModeStore = create<UserModeStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      currentSuggestion: null,
      
      setMode: (mode) => {
        set((state) => ({
          settings: { ...state.settings, mode }
        }));
      },
      
      upgradeLevel: () => {
        set((state) => {
          const currentLevel = state.settings.level;
          if (currentLevel < UserLevel.LEVEL_5) {
            return {
              settings: { ...state.settings, level: currentLevel + 1 }
            };
          }
          return state;
        });
      },
      
      recordActivity: (hour) => {
        const currentHour = hour ?? new Date().getHours();
        set((state) => {
          const activeHours = { ...state.settings.activeHours };
          activeHours[currentHour] = (activeHours[currentHour] || 0) + 1;
          
          return {
            settings: {
              ...state.settings,
              activeHours,
              lastActiveDate: new Date()
            }
          };
        });
      },
      
      recordGoalCreation: () => {
        set((state) => {
          const settings = { ...state.settings };
          settings.totalGoalsCreated += 1;
          
          // First goal created
          if (!settings.firstGoalDate) {
            settings.firstGoalDate = new Date();
          }
          
          // Check for level upgrade
          if (settings.totalGoalsCreated === 1 && settings.level < UserLevel.LEVEL_1) {
            settings.level = UserLevel.LEVEL_1;
          }
          
          return { settings };
        });
      },
      
      recordGoalCompletion: () => {
        set((state) => {
          const settings = { ...state.settings };
          settings.totalGoalsCompleted += 1;
          
          // First completion - upgrade to level 3
          if (settings.totalGoalsCompleted === 1 && settings.level < UserLevel.LEVEL_3) {
            settings.level = UserLevel.LEVEL_3;
          }
          
          return { settings };
        });
      },
      
      updateConsecutiveDays: () => {
        set((state) => {
          const settings = { ...state.settings };
          const lastActive = settings.lastActiveDate;
          const today = new Date();
          
          if (!lastActive) {
            settings.consecutiveDays = 1;
          } else {
            const daysDiff = Math.floor((today.getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
              settings.consecutiveDays += 1;
            } else if (daysDiff > 1) {
              settings.consecutiveDays = 1;
            }
          }
          
          // Check for level upgrades based on usage
          if (settings.consecutiveDays >= 7 && settings.level < UserLevel.LEVEL_2) {
            settings.level = UserLevel.LEVEL_2;
          }
          if (settings.consecutiveDays >= 14 && settings.level < UserLevel.LEVEL_4) {
            settings.level = UserLevel.LEVEL_4;
          }
          if (settings.consecutiveDays >= 30 && settings.level < UserLevel.LEVEL_5) {
            settings.level = UserLevel.LEVEL_5;
          }
          
          settings.lastActiveDate = today;
          return { settings };
        });
      },
      
      shouldShowSmartSuggestion: () => {
        const { settings } = get();
        return (
          settings.mode === UserMode.SIMPLE &&
          settings.totalGoalsCreated >= 5 &&
          settings.level >= UserLevel.LEVEL_2 &&
          !settings.hasSeenSmartSuggestion
        );
      },
      
      shouldShowPersonaSuggestion: () => {
        const { settings } = get();
        return (
          settings.mode === UserMode.SMART &&
          settings.level >= UserLevel.LEVEL_4 &&
          !settings.hasSeenPersonaSuggestion
        );
      },
      
      setSuggestion: (suggestion) => {
        set({ currentSuggestion: suggestion });
      },
      
      dismissSuggestion: (type) => {
        set((state) => {
          const settings = { ...state.settings };
          
          if (type === 'SMART') {
            settings.hasSeenSmartSuggestion = true;
          } else if (type === 'PERSONA') {
            settings.hasSeenPersonaSuggestion = true;
          }
          
          return { settings, currentSuggestion: null };
        });
      },
      
      canAccessFeature: (feature) => {
        const { settings } = get();
        const featureLevels: Record<string, UserLevel> = {
          'progress_history': UserLevel.LEVEL_2,
          'achievement_analysis': UserLevel.LEVEL_3,
          'persona_mode': UserLevel.LEVEL_4,
          'advanced_analytics': UserLevel.LEVEL_5,
          'ai_suggestions': UserLevel.LEVEL_3,
          'custom_categories': UserLevel.LEVEL_2
        };
        
        return settings.level >= (featureLevels[feature] || UserLevel.LEVEL_5);
      },
      
      getAvailableFeatures: () => {
        const { settings } = get();
        const features: string[] = ['basic_goals'];
        
        if (settings.level >= UserLevel.LEVEL_2) {
          features.push('progress_history', 'custom_categories');
        }
        if (settings.level >= UserLevel.LEVEL_3) {
          features.push('achievement_analysis', 'ai_suggestions');
        }
        if (settings.level >= UserLevel.LEVEL_4) {
          features.push('persona_mode', 'smart_notifications');
        }
        if (settings.level >= UserLevel.LEVEL_5) {
          features.push('advanced_analytics', 'automation');
        }
        
        return features;
      }
    }),
    {
      name: 'user-mode-storage'
    }
  )
);