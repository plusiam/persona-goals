import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { PersonaData, GoalData, ActivityData, UserData } from '@/types/firebase';

// User 관련 함수들
export const createUser = async (userData: Omit<UserData, 'createdAt' | 'updatedAt'>) => {
  const userRef = doc(db, 'users', userData.uid);
  const newUser: UserData = {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  await setDoc(userRef, newUser);
  return newUser;
};

export const getUser = async (uid: string): Promise<UserData | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() as UserData : null;
};

// Persona 관련 함수들
export const createPersona = async (personaData: Omit<PersonaData, 'id' | 'createdAt' | 'updatedAt'>) => {
  const personasRef = collection(db, 'personas');
  const newPersona: Omit<PersonaData, 'id'> = {
    ...personaData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  const docRef = await addDoc(personasRef, newPersona);
  return { id: docRef.id, ...newPersona };
};

export const getUserPersonas = async (userId: string): Promise<PersonaData[]> => {
  const personasRef = collection(db, 'personas');
  const q = query(personasRef, where('userId', '==', userId), orderBy('createdAt'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as PersonaData));
};

export const updatePersona = async (personaId: string, updates: Partial<PersonaData>) => {
  const personaRef = doc(db, 'personas', personaId);
  await updateDoc(personaRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const deletePersona = async (personaId: string) => {
  const personaRef = doc(db, 'personas', personaId);
  await deleteDoc(personaRef);
  
  // 관련 목표들도 삭제
  const goalsRef = collection(db, 'goals');
  const q = query(goalsRef, where('personaId', '==', personaId));
  const querySnapshot = await getDocs(q);
  
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

// Goal 관련 함수들
export const createGoal = async (goalData: Omit<GoalData, 'id' | 'createdAt' | 'updatedAt'>) => {
  const goalsRef = collection(db, 'goals');
  const newGoal: Omit<GoalData, 'id'> = {
    ...goalData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  const docRef = await addDoc(goalsRef, newGoal);
  return { id: docRef.id, ...newGoal };
};

export const getPersonaGoals = async (personaId: string): Promise<GoalData[]> => {
  const goalsRef = collection(db, 'goals');
  const q = query(goalsRef, where('personaId', '==', personaId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as GoalData));
};

export const updateGoal = async (goalId: string, updates: Partial<GoalData>) => {
  const goalRef = doc(db, 'goals', goalId);
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.now()
  };
  
  // 완료 상태로 변경 시 completedAt 설정
  if (updates.status === 'COMPLETED' && !updates.completedAt) {
    updateData.completedAt = Timestamp.now();
  }
  
  await updateDoc(goalRef, updateData);
};

export const deleteGoal = async (goalId: string) => {
  const goalRef = doc(db, 'goals', goalId);
  await deleteDoc(goalRef);
  
  // 관련 활동들도 삭제
  const activitiesRef = collection(db, 'activities');
  const q = query(activitiesRef, where('goalId', '==', goalId));
  const querySnapshot = await getDocs(q);
  
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

// Activity 관련 함수들
export const createActivity = async (activityData: Omit<ActivityData, 'id' | 'timestamp'>) => {
  const activitiesRef = collection(db, 'activities');
  const newActivity: Omit<ActivityData, 'id'> = {
    ...activityData,
    timestamp: Timestamp.now()
  };
  const docRef = await addDoc(activitiesRef, newActivity);
  return { id: docRef.id, ...newActivity };
};

export const getGoalActivities = async (goalId: string): Promise<ActivityData[]> => {
  const activitiesRef = collection(db, 'activities');
  const q = query(activitiesRef, where('goalId', '==', goalId), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as ActivityData));
};