'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import CardSkeleton from '@/components/CardSkeleton';
import EmptyState from '@/components/EmptyState';
import { Box, Typography, Alert, Grid, Card, Rating, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
interface RaceInfo {
  _id: string;
  raceName: string;
  season: number;
  circuit: string;
  country?: string;
}

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
        const response = await axios.get<UserReview[]>(apiUrl);
        setReviews(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch your reviews.');
        } else {
          setError('Failed to fetch your reviews.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserReviews();
  }, [user]);

  // Avatar rendering helper (for main profile avatar only)
  function renderAvatar(userObj: { username?: string; avatar?: string } = {}, size = 48) {
    const showAvatar = userObj.avatar && userObj.avatar !== 'default-avatar-url';
    const avatarSrc =
      showAvatar && userObj.avatar
        ? userObj.avatar.startsWith('http')
          ? userObj.avatar
          : `${API_URL}${userObj.avatar ?? ''}`
        : undefined;
    return (
      <Avatar
        src={avatarSrc}
        sx={{ width: size, height: size, fontSize: size / 2, mb: 2 }}
      >
        {!showAvatar && (userObj.username?.charAt(0).toUpperCase() ?? '?')}
      </Avatar>
    );
  }

  // Watched Races section with only the flag (no avatar)
  const watchedRacesContent = () => {
    if (isLoading) {
      return (
        <Grid container spacing={2}>
          {Array.from(new Array(6)).map((_, index) => (
            // @ts-expect-error
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
      router.push('/races');
      return <EmptyState message="No reviews yet. Go review your first race!" title={''} />;
    }

    return (
      <Grid container spacing={2}>
        {reviews.map((review) => {
          const flagCode = getFlagCode(review.race.raceName);
          return (
            // @ts-expect-error
            <Grid item xs={12} sm={6} md={4} key={review._id}>
              <Card sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  {flagCode && (
                    <Image
                      src={`https://flagcdn.com/w40/${flagCode}.png`}
                      alt={`${review.race.raceName} flag`}
                      width={32}
                      height={20}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Typography variant="subtitle1" fontWeight="bold">
                    {review.race.raceName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {review.race.season} Season
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Watched on: {new Date(review.watchedOn).toLocaleDateString()}
                </Typography>
                <Box mt={1}>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      {user && renderAvatar(user, 64)}
      <Typography variant="h5" mb={1}>
        {user?.username}&apos;s Profile
      </Typography>
      <Typography variant="body2" mb={3}>
        Your personal F1 diary.
      </Typography>
      <Typography variant="subtitle1" mb={1}>
        Watched Races ({reviews.length})
      </Typography>
      {watchedRacesContent()}
    </Box>
  );
};

export default ProfilePage;