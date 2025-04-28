// src/components/PrivateRoute.jsx
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} color="primary" />
      </Box>
    );

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
