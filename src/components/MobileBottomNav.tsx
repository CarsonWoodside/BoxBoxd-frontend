'use client';

import { BottomNavigation, BottomNavigationAction, Paper, Box, InputBase, IconButton, Fade } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

export default function MobileBottomNav() {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchActive(false);
      setSearch('');
      router.push(`/searchResults?query=${encodeURIComponent(search)}`);
    }
  };

  // Focus input when search is activated
  const handleSearchClick = () => {
    setSearchActive(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Only show on mobile
  return (
    <Box sx={{
      display: { xs: 'block', md: 'none' },
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 1202,
    }}>
      <Fade in={!searchActive}>
        <Paper elevation={8} sx={{ borderRadius: 0 }}>
          <BottomNavigation
            showLabels={false}
            value={value}
            onChange={(_, newValue) => {
              setValue(newValue);
              if (newValue === 0) router.push('/');
              if (newValue === 1) handleSearchClick();
              if (newValue === 2) router.push('/races');
              if (newValue === 3) router.push('/profile');
            }}
          >
            <BottomNavigationAction icon={<HomeIcon />} />
            <BottomNavigationAction icon={<SearchIcon />} />
            <BottomNavigationAction icon={<SportsMotorsportsIcon />} />
            <BottomNavigationAction icon={<AccountCircleIcon />} />
          </BottomNavigation>
        </Paper>
      </Fade>
      <Fade in={searchActive}>
        <Paper elevation={8} sx={{
          borderRadius: 0,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          bgcolor: 'background.paper'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <InputBase
              inputRef={inputRef}
              placeholder="Search users…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ flex: 1, ml: 1 }}
              inputProps={{ 'aria-label': 'search users' }}
            />
            <IconButton type="submit" color="primary">
              <SearchIcon />
            </IconButton>
            <IconButton onClick={() => setSearchActive(false)}>
              <CloseIcon />
            </IconButton>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}
