'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Avatar, Divider, CircularProgress, Alert } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface Review {
  _id: string;
  rating: number;
  text: string;
  user: { username: string; avatar?: string };
  race: { _id: string; raceName: string; season: number };
}
interface Race {
  _id: string;
  raceName: string;
  season: number;
  date: string;
}

// Get the API URL from env (must start with http/https and NOT have a trailing slash)
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

function renderAvatar(user: { username: string; avatar?: string }) {
  const showAvatar = user.avatar && user.avatar !== 'default-avatar-url';
  const avatarSrc = showAvatar
    ? user.avatar?.startsWith('http')
      ? user.avatar
      : `${API_URL}${user.avatar ?? ''}`
    : undefined;
  return (
    <Avatar
      alt={user.username}
      src={avatarSrc}
      sx={{ width: 24, height: 24 }}
    >
      {!showAvatar && user.username[0]?.toUpperCase()}
    </Avatar>
  );
}


export default function HomePage() {
  const { user, token } = useAuth();

  // Friends' reviews
  const [followingReviews, setFollowingReviews] = useState<Review[]>([]);
  const [hasFollowing, setHasFollowing] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(true);

  // Upcoming race
  const [upcomingRace, setUpcomingRace] = useState<Race | null>(null);
  const [raceLoading, setRaceLoading] = useState(true);
  const [raceError, setRaceError] = useState<string | null>(null);

  // Community reviews
  const [communityReviews, setCommunityReviews] = useState<Review[]>([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch reviews from followed users
    const fetchFollowingReviews = async () => {
      setFollowingLoading(true);
      if (!user || !token) {
        setHasFollowing(false);
        setFollowingReviews([]);
        setFollowingLoading(false);
        return;
      }
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/following-reviews`;
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowingReviews(response.data);
        setHasFollowing(response.data.length > 0);
      } catch {
        setHasFollowing(false);
        setFollowingReviews([]);
      } finally {
        setFollowingLoading(false);
      }
    };

    // Fetch upcoming race
    const fetchUpcomingRace = async () => {
      setRaceLoading(true);
      setRaceError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/races/upcoming`;
        const response = await axios.get(apiUrl);
        setUpcomingRace(response.data);
      } catch (err: any) {
        setRaceError('Could not load upcoming race.');
      } finally {
        setRaceLoading(false);
      }
    };

    // Fetch recent community reviews
    const fetchCommunityReviews = async () => {
      setCommunityLoading(true);
      setCommunityError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/latest`;
        const response = await axios.get(apiUrl);
        setCommunityReviews(response.data.slice(0, 4)); // show up to 4
      } catch (err: any) {
        setCommunityError('Could not load recent community reviews.');
      } finally {
        setCommunityLoading(false);
      }
    };

    fetchFollowingReviews();
    fetchUpcomingRace();
    fetchCommunityReviews();
  }, [user, token]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1100px', margin: 'auto' }}>
      {/* Greeting */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        {user
          ? hasFollowing
            ? `Welcome back, ${user.username}. Here’s what your friends have been saying.`
            : `Welcome back, ${user.username}. Get ready for the next race!`
          : 'Welcome to LetterBoxBox!'}
      </Typography>

      {/* Friends/Following Reviews */}
      {user && hasFollowing && (
        <>
          {followingLoading ? (
            <CircularProgress sx={{ mb: 3 }} />
          ) : (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {followingReviews.map((review) => (
                // @ts-ignore
                <Grid item xs={12} md={6} lg={4} key={review._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        {review.race.raceName} ({review.race.season})
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>"{review.text}"</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {renderAvatar(review.user)}
                        <Typography variant="caption">by {review.user.username}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Upcoming Race */}
      <Card sx={{ mb: 4, background: 'rgba(0,0,0,0.03)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Upcoming Grand Prix</Typography>
          {raceLoading ? (
            <CircularProgress size={24} />
          ) : raceError ? (
            <Alert severity="error">{raceError}</Alert>
          ) : upcomingRace ? (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {upcomingRace.raceName} – {new Date(upcomingRace.date).toLocaleDateString()}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                component={Link}
                href={`/races/${upcomingRace.season}`}
                sx={{ mt: 1 }}
              >
                View {upcomingRace.season} Season
              </Button>
            </>
          ) : (
            <Typography variant="body2">No upcoming race found.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Recent Community Reviews */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Recent Community Reviews</Typography>
      {communityLoading ? (
        <CircularProgress />
      ) : communityError ? (
        <Alert severity="error">{communityError}</Alert>
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {communityReviews.length === 0 ? (
            <Typography variant="body2" sx={{ ml: 2 }}>No reviews yet. Be the first to review a race!</Typography>
          ) : (
            communityReviews.map((review) => (
              // @ts-ignore
              <Grid item xs={12} md={6} lg={3} key={review._id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {review.race.raceName} ({review.race.season})
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>"{review.text}"</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {renderAvatar(review.user)}
                      <Typography variant="caption">by {review.user.username}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
}
