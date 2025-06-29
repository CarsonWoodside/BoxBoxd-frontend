'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Paper,
} from '@mui/material';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

interface User {
  _id: string;
  username: string;
  avatar?: string;
  favoriteTeam?: string;
}

function InnerSearchResultsPage() {
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
    axios
      .get<User[]>(`${API_URL}/api/users/search?query=${encodeURIComponent(query)}`)
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" mb={3}>
        Search Results for &quot;{query}&quot;
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <List>
            {users.map((user) => (
              // @ts-expect-error: WEird
              <ListItem
                key={user._id}
                component={Link}
                href={`/users/${user._id}`}
                button
              >
                <ListItemAvatar>
                  <Avatar>
                    {!user.avatar || user.avatar === 'default-avatar-url'
                      ? user.username.charAt(0).toUpperCase()
                      : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar}
                          alt={user.username}
                          style={{ width: '100%', height: '100%' }}
                        />
                      )
                    }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
          {users.length === 0 && query.length > 0 && !loading && (
            <Typography align="center" sx={{ p: 2 }}>
              No users found.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InnerSearchResultsPage />
    </Suspense>
  );
}
