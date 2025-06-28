'use client';

import { useState, useEffect, use, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { Box, Typography, Paper, CircularProgress, Alert, Chip, Divider, Tooltip, Card, CardContent, Stack } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import PlaceIcon from '@mui/icons-material/Place';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';

// Country name to ISO code mapping (expand as needed)
const countryNameToCode: Record<string, string> = {
  Belgium: "BE",
  Italy: "IT",
  "United Kingdom": "GB",
  France: "FR",
  Germany: "DE",
  Spain: "ES",
  Monaco: "MC",
  Australia: "AU",
  Canada: "CA",
  Austria: "AT",
  Hungary: "HU",
  Netherlands: "NL",
  Singapore: "SG",
  Japan: "JP",
  USA: "US",
  "United States": "US",
  Mexico: "MX",
  Brazil: "BR",
  Qatar: "QA",
  "Saudi Arabia": "SA",
  Bahrain: "BH",
  Azerbaijan: "AZ",
  China: "CN",
  Russia: "RU",
  Turkey: "TR",
  Portugal: "PT",
  "United Arab Emirates": "AE",
  UAE: "AE", // Abu Dhabi GP
  "South Africa": "ZA",
  "Argentina": "AR",
  // ...add more as needed
};

function getCountryCode(country: string | undefined): string | undefined {
  if (!country) return undefined;
  // Defensive: trim and match as-is
  const trimmed = country.trim();
  return countryNameToCode[trimmed] || undefined;
}

interface User { id: string; username: string; }
interface ReviewUser { _id: string; username: string; avatar?: string; }
interface Race {
  _id: string;
  season: number;
  round: number;
  raceName: string;
  circuit: string;
  date: string;
  winningDriverName?: string;
  winningConstructor?: string;
  country?: string;
}
interface Review { _id: string; rating: number; text: string; watchedOn: string; tags: string[]; isRewatch: boolean; user: ReviewUser; }
interface RaceDetailPageProps { params: Promise<{ id: string; }>; }

export default function RaceDetailPage({ params }: RaceDetailPageProps) {
  const { id } = use(params);
  const { user, token } = useAuth();
  const { showNotification } = useNotification();
  const [race, setRace] = useState<Race | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [winnerRevealed, setWinnerRevealed] = useState(false);

  const fetchRaceData = useCallback(async () => {
    if (!id) return;
    try {
      const raceApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/races/${id}`;
      const reviewsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/race/${id}`;
      const [raceResponse, reviewsResponse] = await Promise.all([
        axios.get(raceApiUrl),
        axios.get(reviewsApiUrl),
      ]);
      setRace(raceResponse.data);
      setReviews(reviewsResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch page data.');
      console.error('Error fetching page data:', err);
    }
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    fetchRaceData().finally(() => setIsLoading(false));
  }, [id, fetchRaceData]);

  const refreshData = () => {
    fetchRaceData();
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}`;
      await axios.delete(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
      showNotification('Review deleted successfully!', 'success');
      refreshData();
    } catch (err) {
      const errorMessage = 'Error: Could not delete review.';
      console.error('Failed to delete review', err);
      showNotification(errorMessage, 'error');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;
  if (!race) return null;

  // Get flag URL
  const countryCode = getCountryCode(race.country);
  const flagUrl = countryCode
    ? `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`
    : undefined;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '900px', margin: 'auto' }}>
      {/* Race Header with blurred flag background and dark overlay */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          // Strong dark overlay for readability
          background: flagUrl
            ? `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${flagUrl}) center/cover no-repeat`
            : 'linear-gradient(90deg, #e53935 0%, #e35d5b 100%)',
          minHeight: 220,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {race.raceName}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
            <Chip
              color="default"
              icon={<CalendarMonthIcon sx={{ color: 'white !important' }} />}
              label={`Season: ${race.season}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 500 }}
            />
            <Chip
              color="default"
              icon={<FlagIcon sx={{ color: 'white !important' }} />}
              label={`Round: ${race.round}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 500 }}
            />
            <Chip
              color="default"
              icon={<PlaceIcon sx={{ color: 'white !important' }} />}
              label={race.circuit}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 500 }}
            />
            <Chip
              color="default"
              icon={<SportsMotorsportsIcon sx={{ color: 'white !important' }} />}
              label={new Date(race.date).toLocaleDateString()}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 500 }}
            />
          </Stack>
          {/* Winner Reveal */}
          <Box sx={{ mt: 2 }}>
            <Tooltip title="Hover to reveal winner" arrow>
              <Chip
                color="default"
                icon={<EmojiEventsIcon sx={{ color: 'white !important' }} />}
                label={
                  race.winningDriverName
                    ? `${race.winningDriverName}${race.winningConstructor ? ` (${race.winningConstructor})` : ''}`
                    : `This race hasn't taken place yet!`
                }
                sx={{
                  bgcolor: 'rgba(255,255,255,0.25)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 18,
                  px: 2,
                  py: 1,
                  filter: winnerRevealed ? 'none' : 'blur(8px)',
                  transition: 'filter 0.3s',
                  cursor: race.winningDriverName ? 'pointer' : 'default',
                  userSelect: 'none',
                  '&:hover': {
                    filter: 'none',
                  },
                }}
                onMouseEnter={() => setWinnerRevealed(true)}
                onMouseLeave={() => setWinnerRevealed(false)}
                onTouchStart={() => setWinnerRevealed(true)}
                onTouchEnd={() => setWinnerRevealed(false)}
              />
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {user && (
        <Card elevation={2} sx={{ mb: 4 }}>
          <CardContent>
            <ReviewForm
              raceId={id}
              onReviewSubmit={refreshData}
              editingReview={editingReview}
              setEditingReview={setEditingReview}
            />
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Community Reviews</Typography>
        <Divider sx={{ mb: 2 }} />
        <ReviewList
          reviews={reviews}
          currentUser={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>
    </Box>
  );
}
