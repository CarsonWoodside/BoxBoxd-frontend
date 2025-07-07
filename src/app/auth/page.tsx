'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation'; // <-- Import useRouter

// Define proper error type
interface ErrorWithResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Type guard to check if error has response property
function isErrorWithResponse(error: unknown): error is ErrorWithResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { login, register, user } = useAuth(); // <-- Get user from context
  const router = useRouter(); // <-- Initialize router

  // --- Redirect if already logged in ---
  useEffect(() => {
    if (user) {
      router.replace('/'); // Redirect to home if logged in
    }
  }, [user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLoginView) {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (avatarFile) data.append('avatar', avatarFile);

        await register(data); // Your AuthContext.register must support FormData!
      }
    } catch (err) {
      // Properly handle error with type safety
      let errorMessage = 'An unexpected error occurred.';
      
      if (isErrorWithResponse(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
  };

  // Prevent rendering the form if already logged in (optional, for UX)
  if (user) return null;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, boxShadow: 3 }}
    >
      <Typography variant="h4" mb={2} align="center">
        {isLoginView ? 'Login' : 'Register'}
      </Typography>

      {!isLoginView && (
        <>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
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

      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        type="email"
      />
      <TextField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        type="password"
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {isLoginView ? 'Login' : 'Create Account'}
      </Button>

      <Button
        onClick={toggleView}
        color="secondary"
        fullWidth
        sx={{ mt: 1 }}
      >
        {isLoginView
          ? 'Need an account? Register'
          : 'Already have an account? Login'}
      </Button>
    </Box>
  );
}
