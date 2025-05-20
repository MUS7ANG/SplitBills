import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {doc, getDoc, setDoc, collection, addDoc, updateDoc} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from './useAuthStore';
import { Payment } from '../types';

interface CartItem {
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
    createPayment: () => Promise<void>;
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
            createPayment: async () => {
                const { user } = useAuthStore.getState();
                if (!user || !user.familyId) throw new Error('Пользователь не в семье');
                const familyDoc = await getDoc(doc(db, 'families', user.familyId));
                if (!familyDoc.exists()) throw new Error('Семья не найдена');
                const family = familyDoc.data();
                const totalAmount = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const splitAmount = totalAmount / family.members.length;
                const payment: Payment = {
                    id: '',
                    familyId: user.familyId,
                    totalAmount,
                    splitAmount,
                    items: get().items,
                    createdAt: new Date().toISOString(),
                    createdBy: user.id,
                };
                const paymentRef = await addDoc(collection(db, 'payments'), payment);
                await updateDoc(doc(db, 'payments', paymentRef.id), { id: paymentRef.id });
                set({ items: [] });
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);