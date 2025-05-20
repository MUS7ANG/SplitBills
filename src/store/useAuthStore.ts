import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            useAuthStore.getState().setUser({
                id: firebaseUser.uid,
                email: userData.email,
                role: userData.role,
            });
        }
    } else {
        useAuthStore.getState().clearUser();
    }
});