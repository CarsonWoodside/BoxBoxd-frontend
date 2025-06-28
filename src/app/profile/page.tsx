'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import CardSkeleton from '@/components/CardSkeleton';
import EmptyState from '@/components/EmptyState';
import TeamSelector from '@/components/TeamSelector';
import { Box, Typography, Paper, Alert, Grid, Card, Rating, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';

// --- Race name to flag code mapping (case-insensitive) ---
const raceToFlag: Record<string, string> = {
  'spanish grand prix': 'es',
  'british grand prix': 'gb',
  'monaco grand prix': 'mc',
  'belgian grand prix': 'be',
  'italian grand prix': 'it',
  'french grand prix': 'fr',
  'german grand prix': 'de',
  'austrian grand prix': 'at',
  'hungarian grand prix': 'hu',
  'singapore grand prix': 'sg',
  'japanese grand prix': 'jp',
  'united states grand prix': 'us',
  'canadian grand prix': 'ca',
  'brazilian grand prix': 'br',
  'qatar grand prix': 'qa',
  'saudi arabian grand prix': 'sa',
  'bahrain grand prix': 'bh',
  'abu dhabi grand prix': 'ae',
  'mexican grand prix': 'mx',
  'turkish grand prix': 'tr',
  'dutch grand prix': 'nl',
  'russian grand prix': 'ru',
  'chinese grand prix': 'cn',
  'australian grand prix': 'au',
  'portuguese grand prix': 'pt',
  'emilia romagna grand prix': 'it',
  'miami grand prix': 'us',
  'las vegas grand prix': 'us',
  'spanish gp': 'es',
  'british gp': 'gb',
  'monaco gp': 'mc',
  'belgian gp': 'be',
  'italian gp': 'it',
  'french gp': 'fr',
  'german gp': 'de',
  'austrian gp': 'at',
  'hungarian gp': 'hu',
  'singapore gp': 'sg',
  'japanese gp': 'jp',
  'united states gp': 'us',
  'canadian gp': 'ca',
  'brazilian gp': 'br',
  'qatar gp': 'qa',
  'saudi arabian gp': 'sa',
  'bahrain gp': 'bh',
  'abu dhabi gp': 'ae',
  'mexican gp': 'mx',
  'turkish gp': 'tr',
  'dutch gp': 'nl',
  'russian gp': 'ru',
  'chinese gp': 'cn',
  'australian gp': 'au',
  'portuguese gp': 'pt',
};

// Helper to get flag code from race name
function getFlagCode(raceName?: string) {
  if (!raceName) return undefined;
  return raceToFlag[raceName.trim().toLowerCase()];
}

// Get the API URL from env (must start with http/https and NOT have a trailing slash)
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

// --- Type Definitions ---
interface RaceInfo { _id: string; raceName: string; season: number; circuit: string; country?: string }
interface UserReview {
  _id: string;
  rating: number;
  watchedOn: string;
  race: RaceInfo;
  user: { username?: string; avatar?: string };
}

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/user/${user.id}`;
        const response = await axios.get(apiUrl);
        setReviews(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch your reviews.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserReviews();
  }, [user]);

  // Avatar rendering helper (for main profile avatar only)
  function renderAvatar(user: { username?: string; avatar?: string } = {}, size = 48) {
    const showAvatar = user.avatar && user.avatar !== 'default-avatar-url';
    const avatarSrc = showAvatar
      ? user.avatar?.startsWith('http')
        ? user.avatar
        : `${API_URL}${user.avatar ?? ''}`
      : undefined;
    return (
      <Avatar
        alt={user.username ?? 'User'}
        src={avatarSrc}
        sx={{ width: size, height: size, fontSize: size / 2, mr: 2, bgcolor: !showAvatar ? 'primary.main' : undefined }}
      >
        {!showAvatar && (user.username?.charAt(0).toUpperCase() ?? '?')}
      </Avatar>
    );
  }

  // Watched Races section with only the flag (no avatar)
  const watchedRacesContent = () => {
    if (isLoading) {
      return (
        <Grid container spacing={2}>
          {Array.from(new Array(6)).map((_, index) => (
            // @ts-ignore
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CardSkeleton />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (reviews.length === 0) {
      return (
        <EmptyState
          title="Your Diary is Empty"
          message="You haven't logged any races yet. Start by browsing the race calendars."
          action={{
            text: "Browse Races",
            onClick: () => router.push('/races')
          }}
        />
      );
    }

    return (
      <Box>
        {reviews.map((review) => {
          const flagCode = getFlagCode(review.race.raceName);
          return (
            <Card
              key={review._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                px: 2,
                py: 2,
                boxShadow: 2,
                borderRadius: 3,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 6 },
                bgcolor: 'background.default'
              }}
            >
              {/* No avatar here, just the flag and race info */}
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" component="div">
                    {review.race.raceName}
                  </Typography>
                  {flagCode && (
                    <img
                      src={`https://flagcdn.com/w20/${flagCode}.png`}
                      alt={review.race.raceName + " flag"}
                      style={{ borderRadius: 2, boxShadow: '0 1px 2px #0001' }}
                      width={20}
                      height={14}
                    />
                  )}
                </Box>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {review.race.season} Season
                </Typography>
                <Rating name="read-only" value={review.rating} precision={0.5} readOnly size="small" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Watched on: {new Date(review.watchedOn).toLocaleDateString()}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>
    );
  };

  return (
    <ProtectedRoute>
      <Box sx={{ p: 4, maxWidth: '700px', margin: 'auto' }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && renderAvatar(user, 64)}
          <Box>
            <Typography variant="h3" gutterBottom>{user?.username}'s Profile</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Your personal F1 diary.</Typography>
            <TeamSelector />
          </Box>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Watched Races ({reviews.length})
        </Typography>

        {watchedRacesContent()}
      </Box>
    </ProtectedRoute>
  );
};

export default ProfilePage;
