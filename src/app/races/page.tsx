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
      } catch (err) {
        setError('Failed to fetch seasons.');
        // eslint-disable-next-line no-console
        console.error('Error fetching seasons:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Seasons
      </Typography>
      <Typography variant="body1" mb={3}>
        Select a season to view the race calendar.
      </Typography>

      {isLoading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && (
        <Box display="flex" flexDirection="column" gap={2}>
          {seasons.map((season) => (
            <Button
              key={season}
              variant="contained"
              onClick={() => router.push(`/races/${season}`)}
              sx={{ justifyContent: 'flex-start' }}
              fullWidth
            >
              {season} Season
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
