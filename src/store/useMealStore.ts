import { create } from 'zustand';

interface Meal {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

interface MealState {
    meals: Meal[];
    setMeals: (meals: Meal[]) => void;
}

export const useMealStore = create<MealState>((set) => ({
    meals: [],
    setMeals: (meals) => set({ meals }),
}));