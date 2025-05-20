import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { getMealById } from '../api/meals';
import { Container, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';

interface Meal {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

const Meal: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addItem } = useCartStore();
    const [meal, setMeal] = useState<Meal | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeal = async () => {
            if (!id) return;
            try {
                const fetchedMeal = await getMealById(id);
                setMeal(fetchedMeal);
            } catch (err) {
                setError('Failed to fetch meal details');
            }
        };
        fetchMeal();
    }, [id]);

    const handleAddToCart = () => {
        if (meal) {
            addItem({
                mealId: meal.id,
                quantity: 1,
                price: meal.price,
                title: meal.title,
            });
        }
    };

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!meal) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Card>
                <CardMedia
                    component="img"
                    height="300"
                    image={meal.image}
                    alt={meal.title}
                />
                <CardContent>
                    <Typography variant="h4">{meal.title}</Typography>
                    <Typography variant="body1" paragraph>
                        {meal.description}
                    </Typography>
                    <Typography variant="h6">Category: {meal.category}</Typography>
                    <Typography variant="h6">${meal.price.toFixed(2)}</Typography>
                    <Button variant="contained" onClick={handleAddToCart}>
                        Add to Cart
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Meal;