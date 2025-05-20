import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Профиль
            </Typography>
            {user ? (
                <>
                    <Typography variant="h6">Email: {user.email}</Typography>
                    <Typography variant="h6">Роль: {user.role}</Typography>
                    <Button variant="contained" component={Link} to="/create-profile">
                        Редактировать профиль
                    </Button>
                </>
            ) : (
                <Typography>Пользователь не авторизован</Typography>
            )}
        </Container>
    );
};

export default Profile;