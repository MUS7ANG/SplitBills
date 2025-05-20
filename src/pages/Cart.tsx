import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { syncCart } from '../api/cart';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';

const Cart: React.FC = () => {
    const { user } = useAuthStore();
    const { items, removeItem, clearCart, loadCart } = useCartStore();
    const [splitAmount, setSplitAmount] = useState<number | null>(null);
    const [memberCount, setMemberCount] = useState<number>(0);

    useEffect(() => {
        if (user) {
            loadCart();
        }
    }, [user, loadCart]);

    useEffect(() => {
        const fetchFamily = async () => {
            if (user?.familyId) {
                const familyDoc = await getDoc(doc(db, 'families', user.familyId));
                if (familyDoc.exists()) {
                    const members = familyDoc.data().members;
                    setMemberCount(members.length);
                    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    setSplitAmount(total / members.length);
                }
            }
        };
        fetchFamily();
    }, [user, items]);

    const handleSyncCart = async () => {
        try {
            await syncCart();
            alert('Платеж успешно создан');
        } catch (err: any) {
            alert(err.message || 'Ошибка создания платежа');
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
                        {user?.familyId && memberCount > 0 && (
                            <Typography variant="h6">
                                Доля на человека: ${splitAmount?.toFixed(2)} (разделено на {memberCount} чел.)
                            </Typography>
                        )}
                        <Button variant="contained" onClick={handleSyncCart} sx={{ mr: 2 }} disabled={!user?.familyId}>
                            Создать платеж
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