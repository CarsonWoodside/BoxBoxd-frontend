// src/components/CardSkeleton.tsx
'use client';

import { Card, CardContent, Skeleton } from '@mui/material';

export default function CardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {/* Skeleton for the race name (h6) */}
        <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} width="80%" />
        
        {/* Skeleton for the season (subtitle) */}
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="40%" />

        {/* Skeleton for the Rating component */}
        <Skeleton variant="rectangular" sx={{ my: 1 }} width={120} height={24} />

        {/* Skeleton for the "Watched on" text */}
        <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="60%" />
      </CardContent>
    </Card>
  );
}
