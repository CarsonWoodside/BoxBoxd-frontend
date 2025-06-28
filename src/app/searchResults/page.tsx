'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Paper } from '@mui/material';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

interface User {
  _id: string;
  username: string;
  avatar?: string;
  favoriteTeam?: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }
    setLoading(true);
    axios.get(`${API_URL}/api/users/search?query=${encodeURIComponent(query)}`)
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <Box sx={{ p: 4, maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Search Results for "{query}"
      </Typography>
      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {users.map(user => (
              <ListItem
                key={user._id}
                component={Link}
                href={`/users/${user._id}`}
                sx={{ cursor: 'pointer' }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar && user.avatar !== 'default-avatar-url'
                    ? user.avatar.startsWith('http')
                      ? user.avatar
                      : `${API_URL}${user.avatar}`
                    : undefined
                  }>
                    {!user.avatar || user.avatar === 'default-avatar-url'
                      ? user.username.charAt(0).toUpperCase()
                      : null}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={user.favoriteTeam ? `Favorite Team: ${user.favoriteTeam}` : undefined}
                />
              </ListItem>
            ))}
            {users.length === 0 && query.length > 0 && !loading && (
              <Typography sx={{ p: 2 }} color="text.secondary">No users found.</Typography>
            )}
          </List>
        )}
      </Paper>
    </Box>
  );
}
