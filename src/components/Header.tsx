'use client';

import { AppBar, Toolbar, Typography, Button, Box, InputBase, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Popper, ClickAwayListener } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

interface User {
  _id: string;
  username: string;
  avatar?: string;
  favoriteTeam?: string;
}

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // --- Search State ---
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Live search effect ---
  useEffect(() => {
    if (search.length === 0) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/search?query=${encodeURIComponent(search)}`);
        setResults(res.data.slice(0, 5)); // Show top 5
        setOpen(res.data.length > 0);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [search]);

  // --- Handle Enter key: go to /searchResults with query ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      e.preventDefault();
      setOpen(false);
      router.replace(`/searchResults?query=${encodeURIComponent(search)}`);
    }
  };

  // --- Click away closes dropdown ---
  const handleClickAway = () => setOpen(false);

  // --- Handle submit (icon or form submit) ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setOpen(false);
      router.replace(`/searchResults?query=${encodeURIComponent(search)}`);
    }
  };

  return (
    <AppBar position="static" sx={{ mb: 4, display: { xs: 'none', md: 'block' } }}>
      <Toolbar>
        {/* Site Title */}
        <Typography 
          variant="h6" 
          component={Link} 
          href="/" 
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          BoxBoxd
        </Typography>

        {/* Search Bar */}
        <Box ref={anchorRef} sx={{ position: 'relative', mr: 2, width: 240 }}>
          <Paper
            component="form"
            sx={{ display: 'flex', alignItems: 'center', width: '100%', pl: 1, pr: 1, py: 0.5, boxShadow: 0, bgcolor: 'rgba(255,255,255,0.1)' }}
            onSubmit={handleSubmit}
          >
            <SearchIcon sx={{ color: 'inherit', mr: 1 }} />
            <InputBase
              placeholder="Search users…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => { if (results.length > 0) setOpen(true); }}
              onKeyDown={handleKeyDown}
              sx={{ color: 'inherit', flex: 1 }}
              inputProps={{ 'aria-label': 'search users' }}
            />
          </Paper>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            style={{
              zIndex: 1201,
              width: anchorRef.current?.offsetWidth || 100, // Match search bar width
            }}
          >
            <ClickAwayListener onClickAway={handleClickAway}>
              <Paper sx={{ mt: 1, width: '100%' }}>
                <List dense>
                  {results.map(u => (
                    <ListItem
                      key={u._id}
                      component={Link}
                      href={`/users/${u._id}`}
                      onClick={() => { setOpen(false); setSearch(''); }}
                      sx={{
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={u.avatar && u.avatar !== 'default-avatar-url'
                          ? u.avatar.startsWith('http')
                            ? u.avatar
                            : `${API_URL}${u.avatar}`
                          : undefined
                        }>
                          {!u.avatar || u.avatar === 'default-avatar-url'
                            ? u.username.charAt(0).toUpperCase()
                            : null}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={u.username}
                        secondary={u.favoriteTeam ? `Favorite Team: ${u.favoriteTeam}` : undefined}
                      />
                    </ListItem>
                  ))}
                  {loading && (
                    <ListItem>
                      <ListItemText primary="Searching..." />
                    </ListItem>
                  )}
                  {!loading && results.length === 0 && search.length > 0 && (
                    <ListItem>
                      <ListItemText primary="No users found." />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Box>

        {user ? (
          <Box>
            <Button color="inherit" onClick={() => router.push('/races')}>
              Races
            </Button>
            <Button color="inherit" onClick={() => router.push('/profile')}>
              Profile
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => router.push('/auth')}>
            Login / Register
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
