import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';

const Cart: React.FC = () => {
    const { user } = useAuthStore();
    const { items, removeItem, clearCart, loadCart, saveCart } = useCartStore();

    useEffect(() => {
        if (user) {
            loadCart();
        }
    }, [user, loadCart]);

    const handleSyncCart = async () => {
        try {
            await saveCart();
            alert('Корзина успешно сохранена');
        } catch (err: any) {
            alert(err.message || 'Ошибка сохранения корзины');
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Корзина покупок
            </Typography>
            {items.length === 0 ? (
                <Typography>Ваша корзина пуста</Typography>
            ) : (
                <Box>
                    <List>
                        {items.map((item) => (
                            <ListItem
                                key={item.mealId}
                                secondaryAction={
                                    <Button variant="outlined" color="error" onClick={() => removeItem(item.mealId)}>
                                        Удалить
                                    </Button>
                                }
                            >
                                <ListItemText
                                    primary={item.title}
                                    secondary={`Количество: ${item.quantity}, Цена: $${(item.price * item.quantity).toFixed(2)}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">
                            Итого: ${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                        </Typography>
                        <Button variant="contained" onClick={handleSyncCart} sx={{ mr: 2 }}>
                            Сохранить корзину
                        </Button>
                        <Button variant="outlined" color="error" onClick={clearCart}>
                            Очистить корзину
                        </Button>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default Cart;