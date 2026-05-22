import { useState, useEffect } from 'react';
import { subscribeToActionLogs, subscribeToGoalLogs, addActionLogToFirestore, deleteActionLogFromFirestore } from '@/firebase/firestore';
import type { ActionLog } from '@/models/types';

export function useActionLogs(actionId: string | null) {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actionId) { setLogs([]); setLoading(false); return () => {}; }
    const unsubscribe = subscribeToActionLogs(actionId, (logs) => {
      setLogs(logs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [actionId]);

  async function addLog(actionId: string, date: string, minutes: number, note: string = ''): Promise<string> {
    return await addActionLogToFirestore(actionId, date, minutes, note);
  }

  async function deleteLog(id: string): Promise<void> {
    await deleteActionLogFromFirestore(id);
  }

  return {
    logs,
    loading,
    addLog,
    deleteLog,
  };
}

export function useGoalLogs(goalId: string | null) {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToGoalLogs(goalId, (logs) => {
      setLogs(logs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [goalId]);

  return { logs, loading };
}