'use client';

import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Rating, Divider, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmptyState from './EmptyState';

// --- Type Definitions ---
interface Review {
  _id: string;
  rating: number;
  text: string;
  watchedOn: string;
  tags: string[];
  isRewatch: boolean;
  user: { _id: string; username: string; avatar?: string };
}
interface CurrentUser { id: string; }
interface ReviewListProps {
  reviews: Review[];
  currentUser: CurrentUser | null;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
}

// Get the API URL from env (must start with http/https and NOT have a trailing slash)
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

// Helper for robust avatar rendering
function renderAvatar(user: { username: string; avatar?: string }) {
  const showAvatar = user.avatar && user.avatar !== 'default-avatar-url';
  const avatarSrc = showAvatar
    ? user.avatar?.startsWith('http')
      ? user.avatar
      : `${API_URL}${user.avatar ?? ''}`
    : undefined;
  return (
    <Avatar alt={user.username} src={avatarSrc}>
      {!showAvatar && user.username[0]?.toUpperCase()}
    </Avatar>
  );
}

export default function ReviewList({ reviews, currentUser, onEdit, onDelete }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No Reviews Yet"
        message="Be the first to share your thoughts on this race!"
      />
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {reviews.map((review, index) => (
        <Box key={review._id}>
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              currentUser && currentUser.id === review.user._id && (
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => onEdit(review)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(review._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )
            }
          >
            <ListItemAvatar>
              {renderAvatar(review.user)}
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography component="span" variant="body1" color="text.primary">
                    {review.user.username}
                  </Typography>
                  <Rating value={review.rating} readOnly precision={0.5} />
                  {review.isRewatch && <Chip label="Rewatched" size="small" variant="outlined" />}
                </Box>
              }
              secondaryTypographyProps={{ component: 'div' }}
              secondary={
                <>
                  <Typography component="p" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {review.text}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {review.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Watched on {new Date(review.watchedOn).toLocaleDateString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
          {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
        </Box>
      ))}
    </List>
  );
}
