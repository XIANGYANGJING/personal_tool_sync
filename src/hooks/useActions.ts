import { useState, useEffect } from 'react';
import { subscribeToActions, addActionToFirestore, deleteActionFromFirestore } from '@/firebase/firestore';
import type { Action } from '@/models/types';

export function useActions(goalId: string | null) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActions(goalId, (actions) => {
      setActions(actions);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [goalId]);

  async function addAction(title: string, icon: string, startDate: string, endDate: string): Promise<string> {
    if (!goalId) throw new Error('No goal selected');
    const sortOrder = actions.length;
    return await addActionToFirestore(goalId, title, icon, startDate, endDate, sortOrder);
  }

  async function deleteAction(id: string): Promise<void> {
    await deleteActionFromFirestore(id);
  }

  return {
    actions,
    loading,
    addAction,
    deleteAction,
  };
}