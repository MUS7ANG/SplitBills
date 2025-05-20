export interface Meal {
    id: string;
    title: string;
    description?: string;
    price: number;
    image: string;
    category?: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
    familyId?: string;
}

export interface Family {
    id: string;
    name: string;
    members: string[];
    createdBy: string;
}

export interface Payment {
    id: string;
    familyId: string;
    totalAmount: number;
    splitAmount: number;
    items: { mealId: string; quantity: number; price: number; title: string }[];
    createdAt: string;
    createdBy: string;
}