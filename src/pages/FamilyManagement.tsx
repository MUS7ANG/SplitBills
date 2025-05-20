import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { createFamily, addToFamily } from '../api/users';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Container, Typography, TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';

const FamilyManagement: React.FC = () => {
    const { user } = useAuthStore();
    const [familyName, setFamilyName] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [family, setFamily] = useState<{ id: string; name: string; members: string[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFamily = async () => {
            if (user?.familyId) {
                const familyDoc = await getDoc(doc(db, 'families', user.familyId));
                if (familyDoc.exists()) {
                    setFamily(familyDoc.data() as { id: string; name: string; members: string[] });
                }
            }
        };
        fetchFamily();
    }, [user]);

    const handleCreateFamily = async () => {
        if (!user) return;
        try {
            const newFamily = await createFamily(familyName, user.id);
            setFamily(newFamily);
            setFamilyName('');
        } catch (err: any) {
            setError(err.message || 'Ошибка создания семьи');
        }
    };

    const handleAddMember = async () => {
        if (!user?.familyId) return;
        try {
            await addToFamily(user.familyId, memberEmail);
            const familyDoc = await getDoc(doc(db, 'families', user.familyId));
            setFamily(familyDoc.data() as { id: string; name: string; members: string[] });
            setMemberEmail('');
        } catch (err: any) {
            setError(err.message || 'Ошибка добавления пользователя');
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Управление платежной семьей
            </Typography>
            {family ? (
                <Box>
                    <Typography variant="h6">Семья: {family.name}</Typography>
                    <Typography variant="subtitle1">Члены семьи:</Typography>
                    <List>
                        {family.members.map((memberId) => (
                            <ListItem key={memberId}>
                                <ListItemText primary={memberId} />
                            </ListItem>
                        ))}
                    </List>
                    <Box component="form" sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <TextField
                            label="Email пользователя"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleAddMember}>
                            Добавить
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box component="form" sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Название семьи"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleCreateFamily}>
                        Создать семью
                    </Button>
                </Box>
            )}
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </Container>
    );
};

export default FamilyManagement;