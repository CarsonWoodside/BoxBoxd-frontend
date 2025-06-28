// src/components/ProtectedRoute.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

// Define the props for the component, which will include the page content
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the authentication check is complete and there's no user, redirect
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [isLoading, user, router]);

  // While loading, show a spinner to prevent a "flash" of the protected content
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If a user is authenticated, render the children (the actual page content)
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading (i.e., during the brief moment before redirect), render nothing.
  return null;
};

export default ProtectedRoute;
