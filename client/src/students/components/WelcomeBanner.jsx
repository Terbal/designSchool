import { Typography, Box } from "@mui/material";

export default function WelcomeBanner({ user, tab }) {
  return (
    <Box sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Bienvenue, {user.nom}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {tab === 0 ? "Explorez notre catalogue de cours" : "Vos cours en cours"}
      </Typography>
    </Box>
  );
}
