'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Paper } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

interface User {
  _id: string;
  username: string;
  avatar?: string;
  favoriteTeam?: string;
}

export default function UserSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Keep query in sync with URL param if it changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (query.length === 0) {
      setUsers([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/search?query=${encodeURIComponent(query)}`);
        setUsers(res.data);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <Box sx={{ p: 4, maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Search Users
      </Typography>
      <TextField
        label="Search by username"
        variant="outlined"
        fullWidth
        value={query}
        onChange={e => setQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
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
