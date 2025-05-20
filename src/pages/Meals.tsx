import React, { useEffect, useState } from 'react';
import { useMealStore } from '../store/useMealStore';
import { getMeals, getCategories, Category } from '../api/meals';
import { Button, TextField, Container, Typography, Box, Grid, Card, CardContent, CardMedia, Select, MenuItem } from '@mui/material';

const Meals: React.FC = () => {
    const { meals, setMeals } = useMealStore();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const fetchedMeals = await getMeals(search, category);
                setMeals(fetchedMeals);
            } catch (err) {
                setError('Failed to fetch meals');
            }
        };
        fetchMeals();
    }, [search, category, setMeals]);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Meals
            </Typography>
            <Box sx={{ mb: 4 }}>
                <TextField
                    label="Search Meals"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.name}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            <Grid container spacing={3}>
                {meals.map((meal) => (
                    <Card>
                        <CardMedia
                            component="img"
                            height="140"
                            image={meal.image}
                            alt={meal.title}
                        />
                        <CardContent>
                            <Typography variant="h6">{meal.title}</Typography>
                            <Typography>{meal.category}</Typography>
                            <Typography>${meal.price.toFixed(2)}</Typography>
                            <Button variant="outlined" onClick={() => window.location.href = `/meal/${meal.id}`}>
                                View Details
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Grid>
        </Container>
    );
};

export default Meals;