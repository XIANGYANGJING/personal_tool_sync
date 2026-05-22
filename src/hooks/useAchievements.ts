import { useState, useEffect } from 'react';
import { subscribeToAchievements, addAchievementToFirestore } from '@/firebase/firestore';
import type { Achievement, AchievementType } from '@/models/types';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAchievements((achievements) => {
      setAchievements(achievements);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addAchievement(type: AchievementType, title: string, description: string, icon: string, goalId: string | null = null): Promise<string> {
    return await addAchievementToFirestore(type, title, description, icon, goalId);
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt !== null);
  const lockedAchievements = achievements.filter(a => a.unlockedAt === null);

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    loading,
    addAchievement,
  };
}