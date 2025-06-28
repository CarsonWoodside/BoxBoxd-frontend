'use client';

import { use, useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Box, Typography, List, ListItemButton, ListItemText, CircularProgress, Alert, Paper } from '@mui/material';

interface Race {
  _id: string;
  season: number;
  round: number;
  raceName: string;
  circuit: string;
  date: string;
}

interface RacePageProps {
  params: Promise<{ season: string }>;
}

export default function SeasonRacesPage({ params }: RacePageProps) {
  // Unwrap params using the new React.use() hook
  const { season } = use(params);

  const [races, setRaces] = useState<Race[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/races/season/${season}`;
        const response = await axios.get(apiUrl);
        setRaces(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch race data.');
        console.error('Error fetching races:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (season) {
      fetchRaces();
    }
  }, [season]);

  return (
    <Box sx={{ p: 4, maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h3" gutterBottom>
        {season} Season
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && (
        <Paper elevation={3}>
          <List>
            {races.map((race) => (
              <ListItemButton
                key={race._id}
                component={Link}
                href={`/race/${race._id}`}
                divider
              >
                <ListItemText
                  primary={`Round ${race.round}: ${race.raceName}`}
                  secondary={`${race.circuit} - ${new Date(race.date).toLocaleDateString()}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
