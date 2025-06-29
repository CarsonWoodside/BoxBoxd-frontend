'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
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
  const avatarSrc =
    showAvatar && user.avatar
      ? user.avatar.startsWith('http')
        ? user.avatar
        : `${API_URL}${user.avatar}`
      : undefined;

  return (
    <Avatar src={avatarSrc}>
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
          headers: { Authorization: `Bearer ${token}` },
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
      } catch {
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
      } catch {
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
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
      {/* Greeting */}
      <Typography variant="h5" mb={3}>
        {user
          ? hasFollowing
            ? `Welcome back, ${user.username}. Here&rsquo;s what your friends have been saying.`
            : `Welcome back, ${user.username}. Get ready for the next race!`
          : 'Welcome to LetterBoxBox!'}
      </Typography>

      {/* Friends/Following Reviews */}
      {user && hasFollowing && (
        <>
          <Typography variant="h6" mb={1}>
            Friends&rsquo; Recent Reviews
          </Typography>
          {followingLoading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {followingReviews.map((review) => (
                // @ts-expect-error: Review.race may be incomplete if backend changes
                <Grid item xs={12} md={6} key={review._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {review.race.raceName} ({review.race.season})
                      </Typography>
                      <Typography variant="body2" my={1}>
                        &ldquo;{review.text}&rdquo;
                      </Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        {renderAvatar(review.user)}
                        <Typography variant="caption" ml={1}>
                          by {review.user.username}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Divider sx={{ my: 3 }} />
        </>
      )}

      {/* Upcoming Race */}
      <Typography variant="h6" mb={1}>
        Upcoming Grand Prix
      </Typography>
      {raceLoading ? (
        <CircularProgress />
      ) : raceError ? (
        <Alert severity="error">{raceError}</Alert>
      ) : upcomingRace ? (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            {upcomingRace.raceName} &ndash; {new Date(upcomingRace.date).toLocaleDateString()}
          </Typography>
          <Button
            component={Link}
            href={`/races/${upcomingRace.season}`}
            variant="outlined"
            sx={{ mt: 1 }}
          >
            View {upcomingRace.season} Season
          </Button>
        </>
      ) : (
        <Typography>No upcoming race found.</Typography>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Recent Community Reviews */}
      <Typography variant="h6" mb={1}>
        Recent Community Reviews
      </Typography>
      {communityLoading ? (
        <CircularProgress />
      ) : communityError ? (
        <Alert severity="error">{communityError}</Alert>
      ) : communityReviews.length === 0 ? (
        <Typography>No reviews yet. Be the first to review a race!</Typography>
      ) : (
        <Grid container spacing={2}>
          {communityReviews.map((review) => (
            // @ts-expect-error: Review.race may be incomplete if backend changes
            <Grid item xs={12} md={6} key={review._id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {review.race.raceName} ({review.race.season})
                  </Typography>
                  <Typography variant="body2" my={1}>
                    &ldquo;{review.text}&rdquo;
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {renderAvatar(review.user)}
                    <Typography variant="caption" ml={1}>
                      by {review.user.username}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
