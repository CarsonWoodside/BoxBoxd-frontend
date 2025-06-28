import { Box, Typography, Link as MuiLink, Stack } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        py: 3,
        px: 2,
        background: 'rgba(0,0,0,0.03)',
        borderTop: '1px solid #eee',
        textAlign: 'center',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 1 }}
      >
      </Stack>
      <Typography variant="body2" color="text.secondary">
        &copy; {new Date().getFullYear()} BoxBoxd &mdash; Built by Carson Woodside
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Powered by Jolpica F1 API
      </Typography>
    </Box>
  );
}
