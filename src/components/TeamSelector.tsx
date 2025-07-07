// src/components/TeamSelector.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

// The definitive list of current F1 teams for the theme selector
const teams = [
  { key: 'default', name: 'Default Red' },
  { key: 'mercedes', name: 'Mercedes-AMG Petronas Formula One Team' },
  { key: 'ferrari', name: 'Scuderia Ferrari' },
  { key: 'red_bull_racing', name: 'Oracle Red Bull Racing' },
  { key: 'mclaren', name: 'McLaren Formula 1 Team' },
  { key: 'aston_martin', name: 'Aston Martin Aramco Formula One Team' },
  { key: 'alpine', name: 'BWT Alpine F1 Team' },
  { key: 'williams', name: 'Williams Racing' },
  { key: 'rb', name: 'Visa Cash App RB' }, // RB is the new name for AlphaTauri
  { key: 'haas', name: 'MoneyGram Haas F1 Team' },
  { key: 'sauber', name: 'Stake F1 Team Kick Sauber' },
];


export default function TeamSelector() {
  const { user, updateFavoriteTeam } = useAuth();

  const handleChange = (event: SelectChangeEvent) => {
    updateFavoriteTeam(event.target.value as string);
  };

  if (!user) return null;

  return (
    <FormControl sx={{ mt: 2, minWidth: 240 }} size="small">
      <InputLabel id="team-select-label">Favorite Team Theme</InputLabel>
      <Select
        labelId="team-select-label"
        id="team-select"
        value={user.favoriteTeam || 'default'}
        label="Favorite Team Theme"
        onChange={handleChange}
      >
        {teams.map((team) => (
          <MenuItem key={team.key} value={team.key}>{team.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
