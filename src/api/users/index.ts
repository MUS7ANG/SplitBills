import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { User } from '../../types';

interface AuthResponse {
    user: User;
}

export const register = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'user',
        });
        return {
            user: { id: user.uid, email: user.email!, role: 'user' },
        };
    } catch (error: any) {
        throw new Error(error.message || 'Ошибка регистрации');
    }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                user: { id: user.uid, email: userData.email, role: userData.role },
            };
        } else {
            throw new Error('Данные пользователя не найдены');
        }
    } catch (error: any) {
        throw new Error(error.message || 'Ошибка входа');
    }
};

export const updateProfile = async (data: { email: string }, userId: string): Promise<User> => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Пользователь не авторизован');
        await updateEmail(user, data.email);
        await setDoc(doc(db, 'users', userId), { email: data.email, role: 'user' }, { merge: true });
        return { id: userId, email: data.email, role: 'user' };
    } catch (error: any) {
        throw new Error(error.message || 'Ошибка обновления профиля');
    }
};