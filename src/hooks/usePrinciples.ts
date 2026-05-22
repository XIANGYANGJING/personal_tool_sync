import { useState, useEffect } from 'react';
import { subscribeToPrinciples, addPrincipleToFirestore, updatePrincipleHit } from '@/firebase/firestore';
import type { Principle } from '@/models/types';

export function usePrinciples() {
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPrinciples((principles) => {
      setPrinciples(principles);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addPrinciple(content: string, keywords: string[]): Promise<string> {
    return await addPrincipleToFirestore(content, keywords);
  }

  async function hitPrinciple(id: string): Promise<void> {
    await updatePrincipleHit(id);
  }

  function findMatchingPrinciples(text: string): { principle: Principle; score: number }[] {
    const words = text.toLowerCase().split(/\s+/);
    return principles
      .map(p => {
        let score = 0;
        p.keywords.forEach(kw => {
          if (words.some(w => kw.toLowerCase().includes(w) || w.includes(kw.toLowerCase()))) {
            score += 1;
          }
        });
        return { principle: p, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  return {
    principles,
    loading,
    addPrinciple,
    hitPrinciple,
    findMatchingPrinciples,
  };
}