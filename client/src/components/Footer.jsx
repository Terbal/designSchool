import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  Divider,
  useTheme,
} from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
        pt: 6,
        pb: 4,
        mt: 10,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Branding */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              designSchool
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 400 }}>
              Développez votre potentiel créatif grâce à des formations
              pratiques, inspirantes et accessibles. Une pédagogie moderne pour
              une nouvelle génération de créateurs.
            </Typography>
          </Grid>

          {/* Liens utiles */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Liens utiles
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Connexion", href: "/login" },
                { label: "Inscription", href: "/signup" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((link, i) => (
                <MuiLink
                  key={i}
                  href={link.href}
                  color="inherit"
                  underline="hover"
                  sx={{
                    mt: 0.8,
                    fontWeight: 400,
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      pl: 1,
                      color: theme.palette.secondary.main,
                    },
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: "rgba(255,255,255,0.1)" }} />

        <Box textAlign="center">
          <Typography
            variant="body2"
            sx={{ fontSize: "0.85rem", opacity: 0.7 }}
          >
            © {new Date().getFullYear()} designSchool. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
