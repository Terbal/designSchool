import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  useTheme,
} from "@mui/material";

const Footer = () => {
  const theme = useTheme(); // 🔥 accès au thème

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main, // couleur du thème
        color: theme.palette.common.white,
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" fontWeight={600}>
              designSchool
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Des formations innovantes pour apprendre à s’exprimer avec
              confiance et impact.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" fontWeight={600}>
              Liens utiles
            </Typography>
            <Box sx={{ mt: 1 }}>
              <MuiLink
                href="/login"
                color="inherit"
                underline="hover"
                sx={{ display: "block", mt: 0.5 }}
              >
                Connexion
              </MuiLink>
              <MuiLink
                href="/signup"
                color="inherit"
                underline="hover"
                sx={{ display: "block", mt: 0.5 }}
              >
                Inscription
              </MuiLink>
              <MuiLink
                href="/dashboard"
                color="inherit"
                underline="hover"
                sx={{ display: "block", mt: 0.5 }}
              >
                Dashboard
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            © {new Date().getFullYear()} designSchool. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
