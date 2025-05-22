// src/components/HeroCarousel.jsx
import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { keyframes } from "@emotion/react";
import learnImg from "../../assets/learn.png";
import speakImg from "../../assets/speak.png";
import speak2Img from "../../assets/speak2.png";
import { Link } from "react-router-dom";

const items = [
  {
    title: "Formations modernes",
    desc: "Des parcours interactifs pour développer vos compétences",
    image: speak2Img,
  },
];

// Animation "pulse"
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const HeroCarousel = () => {
  return (
    <Box sx={{ mt: 0 }}>
      {items.map((item, i) => (
        <Box
          key={i}
          sx={{
            position: "relative",
            height: { xs: "100vh", md: "95vh" },
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))",
              zIndex: 1,
            },
          }}
        >
          <Container
            sx={{
              zIndex: 2,
              position: "relative",
              px: 2,
              maxWidth: "lg",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: { xs: "2rem", md: "3.5rem" },
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Roboto",
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.5rem" },
                mb: 4,
                lineHeight: 1.5,
              }}
            >
              {item.desc}
            </Typography>
            <Button
              component={Link}
              to="/dashboard-etudiant" // ← CHEMIN de ta page de formations
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#1976D2",
                fontFamily: "Poppins",
                fontWeight: 600,
                animation: `${pulse} 2s infinite`,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: "30px",
                "&:hover": {
                  backgroundColor: "#1565C0",
                },
              }}
            >
              Découvrir nos formations
            </Button>
          </Container>
        </Box>
      ))}
    </Box>
  );
};

export default HeroCarousel;
