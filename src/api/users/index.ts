import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { User, Family } from '../../types';

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
            const userData = userDoc.data() as User;
            return {
                user: { id: user.uid, email: userData.email, role: userData.role, familyId: userData.familyId },
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
        await setDoc(doc(db, 'users', userId), { email: data.email }, { merge: true });
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data() as User;
        return { id: userId, email: userData.email, role: userData.role, familyId: userData.familyId };
    } catch (error: any) {
        throw new Error(error.message || 'Ошибка обновления профиля');
    }
};

export const createFamily = async (name: string, userId: string): Promise<Family> => {
    try {
        const familyRef = doc(collection(db, 'families'));
        const family: Family = {
            id: familyRef.id,
            name,
            members: [userId],
            createdBy: userId,
        };
        await setDoc(familyRef, family);
        await setDoc(doc(db, 'users', userId), { familyId: familyRef.id }, { merge: true });
        return family;
    } catch (error: any) {
        throw new Error(error.message || 'Ошибка создания семьи');
    }
};

export const addToFamily = async (familyId: string, email: string): Promise<void> => {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const targetUser = usersSnapshot.docs.find((doc) => doc.data().email === email);
        if (!targetUser) throw new Error('Пользователь не найден');
        const userId = targetUser.id;
        await updateDoc(doc(db, 'families', familyId), {
            members: arrayUnion(userId),
        });
        await setDoc(doc(db, 'users', userId), { familyId }, { merge: true });
    } catch (error: any) {
        throw new Error(error.message || 'Ошибка добавления в семью');
    }
};