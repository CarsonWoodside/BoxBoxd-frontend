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
  params: { season: string };
}

export default function SeasonRacesPage({ params }: RacePageProps) {
  const { season } = params;
  const [races, setRaces] = useState<Race[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/races/season/${season}`;
        const response = await axios.get<Race[]>(apiUrl);
        setRaces(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch race data.');
        // eslint-disable-next-line no-console
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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {season} Season
      </Typography>

      {isLoading && <CircularProgress />}

      {error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && (
        <Paper>
          <List>
            {races.map((race) => (
              <ListItemButton
                key={race._id}
                component={Link}
                href={`/race/${race._id}`}
              >
                <ListItemText
                  primary={`${race.raceName} (${race.circuit})`}
                  secondary={new Date(race.date).toLocaleDateString()}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
