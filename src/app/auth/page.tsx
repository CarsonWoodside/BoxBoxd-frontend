'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLoginView) {
        await login({ email: formData.email, password: formData.password });
      } else {
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (avatarFile) data.append('avatar', avatarFile);

        await register(data); // Your AuthContext.register must support FormData!
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, width: '100%', maxWidth: '400px' }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">{isLoginView ? 'Login' : 'Register'}</Typography>
        {!isLoginView && (
          <>
            <TextField label="Username" name="username" value={formData.username} onChange={handleInputChange} margin="normal" required fullWidth />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ my: 1 }}
            >
              {avatarFile ? 'Avatar Selected' : 'Upload Avatar'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </Button>
          </>
        )}
        <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} margin="normal" required fullWidth />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} margin="normal" required fullWidth />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2, py: 1.5 }}>{isLoginView ? 'Login' : 'Create Account'}</Button>
        <Typography textAlign="center">
          <Button onClick={toggleView} size="small">{isLoginView ? 'Need an account? Register' : 'Already have an account? Login'}</Button>
        </Typography>
      </Box>
    </Box>
  );
}
