// src/components/EmptyState.tsx
'use client';

import { Box, Typography, Button } from '@mui/material';
import TheatersIcon from '@mui/icons-material/Theaters'; // An icon that evokes "logging" or "watching"

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        border: '2px dashed #ddd',
        borderRadius: 2,
        mt: 4,
      }}
    >
      <TheatersIcon sx={{ fontSize: 60, color: 'grey.500', mb: 2 }} />
      <Typography variant="h5" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.text}
        </Button>
      )}
    </Box>
  );
}
