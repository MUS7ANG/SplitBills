import axios from 'axios';
import { CartItem } from '../../store/useCartStore';

export const syncCart = async (items: CartItem[], token: string): Promise<void> => {
    try {
        await axios.post('https://your-backend-api/cart', { items }, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to sync cart');
    }
};