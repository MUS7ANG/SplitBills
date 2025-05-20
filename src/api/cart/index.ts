import { useCartStore } from '../../store/useCartStore';

export const syncCart = async (): Promise<void> => {
    try {
        await useCartStore.getState().createPayment();
    } catch (error: any) {
        throw new Error(error.message || 'Ошибка создания платежа');
    }
};