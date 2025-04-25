// src/components/PromoSection.jsx
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const PromoSection = () => {
  return (
    <Box
      sx={{ py: 8, background: "linear-gradient(to right, #e3f2fd, #ffffff)" }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: "Poppins", fontWeight: 600 }}
        >
          Découvrez designSchool en vidéo
        </Typography>
        <Box
          sx={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            mt: 4,
            mb: 6,
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Vidéo promotionnelle"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/signup"
          sx={{
            fontWeight: 600,
            borderRadius: 8,
            fontSize: "1.1rem",
            px: 4,
            py: 1.5,
            textTransform: "none",
          }}
        >
          Inscrivez-vous maintenant
        </Button>
      </Container>
    </Box>
  );
};

export default PromoSection;
