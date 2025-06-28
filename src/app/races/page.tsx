'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RacesPage() {
  const router = useRouter();
  const [seasons, setSeasons] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/races`;
        const response = await axios.get(apiUrl);
        setSeasons(response.data.seasons || []);
      } catch (err: any) {
        setError('Failed to fetch seasons.');
        console.error('Error fetching seasons:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeasons();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Browse Seasons
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Select a season to view the race calendar.
      </Typography>
      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        {!isLoading && !error && seasons.map((season) => (
          <Button
            key={season}
            variant="contained"
            onClick={() => router.push(`/races/${season}`)}
          >
            {season} Season
          </Button>
        ))}
      </Box>
    </Box>
  );
}
