'use client';

import React, { use } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmptyState from '@/components/EmptyState';
import { Box, Typography, Paper, Alert, Card, Rating, Avatar, CircularProgress } from '@mui/material';

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

function getFlagCode(raceName: string | undefined): string | undefined {
  if (!raceName) return undefined;
  return raceToFlag[raceName.trim().toLowerCase()];
}

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
interface PublicUser {
  username?: string;
  avatar?: string;
  favoriteTeam?: string;
}
interface Params {
  id: string;
}

export default function UserProfilePage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<PublicUser | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const userRes = await axios.get(`${API_URL}/api/users/${id}`);
        setProfileUser(userRes.data);
        const reviewsRes = await axios.get(`${API_URL}/api/reviews/user/${id}`);
        setReviews(reviewsRes.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load user profile.');
        } else {
          setError('Failed to load user profile.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  function renderAvatar(user: PublicUser = {}, size = 64) {
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

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;
  if (!profileUser) return null;

  return (
    <ProtectedRoute>
      <Box sx={{ p: 4, maxWidth: '700px', margin: 'auto' }}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          {renderAvatar(profileUser)}
          <Box>
            <Typography variant="h3" gutterBottom>{profileUser.username}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>Favorite Team: {profileUser.favoriteTeam || 'None'}</Typography>
            {currentUser && currentUser.id !== id && (
              <Box>
                {/* Follow/unfollow button will be added later */}
              </Box>
            )}
          </Box>
        </Paper>

        <Typography variant="h4" gutterBottom>
          Watched Races ({reviews.length})
        </Typography>

        {reviews.length === 0 ? (
          <EmptyState
            title="No Reviews"
            message="This user hasn't logged any races yet."
          />
        ) : (
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
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" component="div">
                        {review.race.raceName}
                      </Typography>
                      {review.race.raceName && flagCode && (
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
        )}
      </Box>
    </ProtectedRoute>
  );
}
