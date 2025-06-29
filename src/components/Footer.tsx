import { Box, Typography, Stack } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 4, py: 2 }}>
      <Stack spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} BoxBoxd — Built by Carson Woodside
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Powered by Jolpica F1 API
        </Typography>
      </Stack>
    </Box>
  );
}
