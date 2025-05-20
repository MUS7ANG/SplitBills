import axios from 'axios';

interface Meal {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export interface Category {
    id: string;
    name: string;
}

export const getMeals = async (search?: string, category?: string): Promise<Meal[]> => {
    try {
        let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + (search || '');
        if (category) {
            url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        }
        const response = await axios.get(url);
        const meals = response.data.meals || [];
        return meals.map((meal: any) => ({
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions || 'No description available',
            price: Math.floor(Math.random() * 20) + 5,
            image: meal.strMealThumb,
            category: meal.strCategory,
        }));
    } catch (error: any) {
        throw new Error('Failed to fetch meals');
    }
};

export const getMealById = async (id: string): Promise<Meal> => {
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const meal = response.data.meals?.[0];
        if (!meal) throw new Error('Meal not found');
        return {
            id: meal.idMeal,
            title: meal.strMeal,
            description: meal.strInstructions || 'No description available',
            price: Math.floor(Math.random() * 20) + 5,
            image: meal.strMealThumb,
            category: meal.strCategory,
        };
    } catch (error: any) {
        throw new Error('Failed to fetch meal details');
    }
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        const categories = response.data.categories || [];
        return categories.map((category: any) => ({
            id: category.idCategory,
            name: category.strCategory,
        }));
    } catch (error: any) {
        throw new Error('Failed to fetch categories');
    }
};