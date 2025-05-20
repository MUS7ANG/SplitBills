import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { register } from '../api/users';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(email, password);
      setUser(response.user);
      navigate('/create-profile');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    }
  };

  return (
      <Container sx={{ mt: 4, maxWidth: '400px' }}>
        <Typography variant="h4" gutterBottom>
          Регистрация
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
          />
          <TextField
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained">
            Зарегистрироваться
          </Button>
        </Box>
      </Container>
  );
};

export default Register;