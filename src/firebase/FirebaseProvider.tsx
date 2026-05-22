import { useState, useEffect } from 'react';
import { auth, signIn } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    signIn().catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚡</div>
          <div className="text-[#888]">连接 Firebase...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}