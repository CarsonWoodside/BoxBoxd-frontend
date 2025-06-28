// src/components/ReviewForm.tsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Box, Button, TextField, Rating, Typography, Alert, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';

// Define the shape of a full Review object
interface Review { _id: string; rating: number; text: string; watchedOn: string; tags: string[]; isRewatch: boolean; user: { _id: string; username: string; avatar?: string; }; }
interface ReviewFormProps {
  raceId: string;
  onReviewSubmit: () => void;
  editingReview: Review | null;
  setEditingReview: (review: Review | null) => void;
}

// Helper to get today's date in YYYY-MM-DD format
const getTodayString = () => new Date().toISOString().split('T')[0];

export default function ReviewForm({ raceId, onReviewSubmit, editingReview, setEditingReview }: ReviewFormProps) {
  const { token } = useAuth();
  const { showNotification } = useNotification();
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [watchedOn, setWatchedOn] = useState(getTodayString());
  const [tags, setTags] = useState('');
  const [isRewatch, setIsRewatch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setText(editingReview.text);
      setWatchedOn(new Date(editingReview.watchedOn).toISOString().split('T')[0]);
      setTags(editingReview.tags.join(', '));
      setIsRewatch(editingReview.isRewatch);
    }
  }, [editingReview]);

  const resetForm = () => {
    setEditingReview(null);
    setRating(null);
    setText('');
    setWatchedOn(getTodayString());
    setTags('');
    setIsRewatch(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('A rating is required.');
      return;
    }
    setError(null);

    const payload = { raceId, rating, text, watchedOn, tags: tags.split(',').map(tag => tag.trim()).filter(Boolean), isRewatch };
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editingReview) {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${editingReview._id}`;
        await axios.put(apiUrl, payload, { headers });
        showNotification('Review updated successfully!', 'success');
      } else {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`;
        await axios.post(apiUrl, payload, { headers });
        showNotification('Review saved successfully!', 'success');
      }
      resetForm();
      onReviewSubmit();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit review.';
      setError(errorMessage); // Keep local error for form validation
      showNotification(errorMessage, 'error'); // Also show global notification
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>{editingReview ? 'Edit Your Review' : 'Log, Rate & Review'}</Typography>
      <FormGroup row sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField label="Watched On" type="date" value={watchedOn} onChange={(e) => setWatchedOn(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: '48%' }} />
        <FormControlLabel control={<Checkbox checked={isRewatch} onChange={(e) => setIsRewatch(e.target.checked)} />} label="I've watched this before" />
      </FormGroup>
      <Rating name="rating" value={rating} onChange={(_, val) => setRating(val)} precision={0.5} size="large" />
      <TextField label="Add a review..." multiline rows={3} value={text} onChange={(e) => setText(e.target.value)} margin="normal" fullWidth />
      <TextField label="Tags (comma-separated)" placeholder="e.g. classic, wet race, favourite" value={tags} onChange={(e) => setTags(e.target.value)} margin="normal" fullWidth />
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" disabled={!rating}>{editingReview ? 'Update' : 'Save'}</Button>
        {editingReview && <Button variant="outlined" onClick={resetForm}>Cancel Edit</Button>}
      </Stack>
    </Box>
  );
}
