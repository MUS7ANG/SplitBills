import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from './useAuthStore';

export interface CartItem {
    mealId: string;
    quantity: number;
    price: number;
    title: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (mealId: string) => void;
    clearCart: () => void;
    loadCart: () => Promise<void>;
    saveCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.mealId === item.mealId);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.mealId === item.mealId ? { ...i, quantity: i.quantity + item.quantity } : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),
            removeItem: (mealId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.mealId !== mealId),
                })),
            clearCart: () => set({ items: [] }),
            loadCart: async () => {
                const { user } = useAuthStore.getState();
                if (user) {
                    const cartDoc = await getDoc(doc(db, 'carts', user.id));
                    if (cartDoc.exists()) {
                        set({ items: cartDoc.data().items || [] });
                    }
                }
            },
            saveCart: async () => {
                const { user } = useAuthStore.getState();
                if (user) {
                    await setDoc(doc(db, 'carts', user.id), { items: get().items }, { merge: true });
                }
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);