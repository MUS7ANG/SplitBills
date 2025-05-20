import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header: React.FC = () => {
    const { user, clearUser } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearUser();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Онлайн-магазин блюд
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/">
                        Главная
                    </Button>
                    <Button color="inherit" component={Link} to="/meals">
                        Блюда
                    </Button>
                    {user ? (
                        <>
                            <Button color="inherit" component={Link} to="/cart">
                                Корзина
                            </Button>
                            <Button color="inherit" component={Link} to="/profile">
                                Профиль
                            </Button>
                            <Button color="inherit" component={Link} to="/family">
                                Семья
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Войти
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Регистрация
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;