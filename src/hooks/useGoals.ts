import { useState, useEffect } from 'react';
import { subscribeToGoals, addGoalToFirestore, updateGoalInFirestore, deleteGoalFromFirestore } from '@/firebase/firestore';
import type { Goal } from '@/models/types';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToGoals((goals) => {
      setGoals(goals);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addGoal(title: string, startDate: string, endDate: string, effectiveMinutesPerDay: number = 480): Promise<string> {
    return await addGoalToFirestore(title, startDate, endDate, effectiveMinutesPerDay);
  }

  async function updateGoal(id: string, updates: Partial<Goal>): Promise<void> {
    await updateGoalInFirestore(id, updates);
  }

  async function deleteGoal(id: string): Promise<void> {
    await deleteGoalFromFirestore(id);
  }

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
  };
}