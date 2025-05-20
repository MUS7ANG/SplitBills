import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { updateProfile } from '../api/users';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const CreateProfile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const updatedUser = await updateProfile({ email }, user.id);
      setUser(updatedUser);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления профиля');
    }
  };

  return (
      <Container sx={{ mt: 4, maxWidth: '400px' }}>
        <Typography variant="h4" gutterBottom>
          Редактировать профиль
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
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained">
            Сохранить
          </Button>
        </Box>
      </Container>
  );
};

export default CreateProfile;