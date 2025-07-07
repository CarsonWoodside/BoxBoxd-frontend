import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SettingsProvider } from "@/context/SettingsContext";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import ThemeRegistry from "@/components/ThemeRegistry";
import Footer from "@/components/Footer";
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export const metadata: Metadata = {
  title: "BoxBoxd",
  description: "Log, rate, and review F1 races.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          margin: 0,
          height: "100%",
        }}
      >
        <AuthProvider>
          <NotificationProvider>
            <SettingsProvider>
              <ThemeRegistry>
                {/* Desktop Header */}
                <Header />
                {/* Mobile Top Bar */}
                <AppBar position="static" sx={{ display: { xs: 'block', md: 'none' }, borderRadius: 0 }}>
                  <Toolbar sx={{ justifyContent: 'center', minHeight: 48 }}>
                    <Typography variant="h6" sx={{ color: 'inherit', textAlign: 'center', flex: 1 }}>
                      BoxBoxd
                    </Typography>
                  </Toolbar>
                </AppBar>
                <main style={{ flex: 1 }}>{children}</main>
                {/* Hide footer on mobile */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Footer />
                </Box>
                {/* Mobile Bottom Navigation */}
                <MobileBottomNav />
              </ThemeRegistry>
            </SettingsProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
