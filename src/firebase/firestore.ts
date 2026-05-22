import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where, orderBy, serverTimestamp, Timestamp, increment } from 'firebase/firestore';
import { db } from '@/firebase';
import { generateId } from '@/utils/uuid';
import type { Goal, Action, ActionLog, Principle, Achievement, AchievementType } from '@/models/types';

function tsToNumber(ts: Timestamp | null | undefined): number {
  if (!ts) return Date.now();
  return ts.toMillis ? ts.toMillis() : Date.now();
}

// ============ Goals ============
export function subscribeToGoals(callback: (goals: Goal[]) => void) {
  const q = query(collection(db, 'goals'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const goals: Goal[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        effectiveMinutesPerDay: data.effectiveMinutesPerDay || 480,
        currentLevel: data.currentLevel || 1,
        createdAt: tsToNumber(data.createdAt),
        updatedAt: tsToNumber(data.updatedAt),
      } as Goal;
    });
    callback(goals);
  });
}

export async function addGoalToFirestore(title: string, startDate: string, endDate: string, effectiveMinutesPerDay: number = 480): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, 'goals', id), {
    title,
    status: 'active',
    startDate,
    endDate,
    effectiveMinutesPerDay,
    currentLevel: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function updateGoalInFirestore(id: string, updates: Partial<Goal>): Promise<void> {
  await setDoc(doc(db, 'goals', id), { ...updates, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteGoalFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'goals', id));
}

// ============ Actions ============
export function subscribeToActions(goalId: string | null, callback: (actions: Action[]) => void) {
  if (!goalId) { callback([]); return () => {}; }
  const q = query(collection(db, 'actions'), where('goalId', '==', goalId));
  return onSnapshot(q, (snapshot) => {
    const actions: Action[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        goalId: data.goalId,
        title: data.title,
        icon: data.icon || '📌',
        startDate: data.startDate,
        endDate: data.endDate,
        sortOrder: data.sortOrder || 0,
        createdAt: tsToNumber(data.createdAt),
        updatedAt: tsToNumber(data.updatedAt),
      } as Action;
    });
    // Sort by sortOrder in memory
    actions.sort((a, b) => a.sortOrder - b.sortOrder);
    callback(actions);
  });
}

export async function addActionToFirestore(goalId: string, title: string, icon: string, startDate: string, endDate: string, sortOrder: number): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, 'actions', id), {
    goalId,
    title,
    icon,
    startDate,
    endDate,
    sortOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function deleteActionFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'actions', id));
}

// ============ Action Logs ============
export function subscribeToActionLogs(actionId: string | null, callback: (logs: ActionLog[]) => void) {
  if (!actionId) { callback([]); return () => {}; }
  const q = query(collection(db, 'actionLogs'), where('actionId', '==', actionId), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const logs: ActionLog[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        actionId: data.actionId,
        date: data.date,
        minutes: data.minutes,
        note: data.note || '',
        createdAt: tsToNumber(data.createdAt),
        updatedAt: tsToNumber(data.updatedAt),
      } as ActionLog;
    });
    callback(logs);
  });
}

export async function addActionLogToFirestore(actionId: string, date: string, minutes: number, note: string = ''): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, 'actionLogs', id), {
    actionId,
    date,
    minutes,
    note,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function deleteActionLogFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, 'actionLogs', id));
}

export function subscribeToGoalLogs(goalId: string | null, callback: (logs: ActionLog[]) => void) {
  if (!goalId) { callback([]); return () => {}; }
  const actionsQuery = query(collection(db, 'actions'), where('goalId', '==', goalId));
  return onSnapshot(actionsQuery, (actionsSnap) => {
    const actionIds = actionsSnap.docs.map(d => d.id);
    if (actionIds.length === 0) { callback([]); return () => {}; }
    // Use 'in' query but limited to 10 items (Firestore limitation)
    const logsQuery = query(collection(db, 'actionLogs'), where('actionId', 'in', actionIds.slice(0, 10)));
    return onSnapshot(logsQuery, (logsSnap) => {
      const logs: ActionLog[] = logsSnap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          actionId: data.actionId,
          date: data.date,
          minutes: data.minutes,
          note: data.note || '',
          createdAt: tsToNumber(data.createdAt),
          updatedAt: tsToNumber(data.updatedAt),
        } as ActionLog;
      });
      callback(logs);
    });
  });
}

// ============ Principles ============
export function subscribeToPrinciples(callback: (principles: Principle[]) => void) {
  const q = query(collection(db, 'principles'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const principles: Principle[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        content: data.content,
        keywords: data.keywords || [],
        hitCount: data.hitCount || 0,
        lastHitAt: data.lastHitAt ? tsToNumber(data.lastHitAt) : null,
        createdAt: tsToNumber(data.createdAt),
        updatedAt: tsToNumber(data.updatedAt),
      } as Principle;
    });
    callback(principles);
  });
}

export async function addPrincipleToFirestore(content: string, keywords: string[]): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, 'principles', id), {
    content,
    keywords,
    hitCount: 0,
    lastHitAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}

export async function updatePrincipleHit(id: string): Promise<void> {
  await setDoc(doc(db, 'principles', id), {
    hitCount: increment(1),
    lastHitAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ============ Achievements ============
export function subscribeToAchievements(callback: (achievements: Achievement[]) => void) {
  const q = query(collection(db, 'achievements'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const achievements: Achievement[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        type: data.type,
        title: data.title,
        description: data.description,
        icon: data.icon,
        goalId: data.goalId || null,
        unlockedAt: data.unlockedAt ? tsToNumber(data.unlockedAt) : null,
        createdAt: tsToNumber(data.createdAt),
        updatedAt: tsToNumber(data.updatedAt),
      } as Achievement;
    });
    callback(achievements);
  });
}

export async function addAchievementToFirestore(type: AchievementType, title: string, description: string, icon: string, goalId: string | null = null): Promise<string> {
  const id = generateId();
  await setDoc(doc(db, 'achievements', id), {
    type,
    title,
    description,
    icon,
    goalId,
    unlockedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return id;
}