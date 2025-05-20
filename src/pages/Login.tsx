import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/users';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
      <Container sx={{ mt: 4, maxWidth: '400px' }}>
        <Typography variant="h4" gutterBottom>
          Вход
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
            Войти
          </Button>
        </Box>
      </Container>
  );
};

export default Login;