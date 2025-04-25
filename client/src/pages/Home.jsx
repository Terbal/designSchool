// src/pages/Home.jsx
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import Presentation from "../components/Presentation";
import Testimonials from "../components/Testimonials";
import StatsSection from "../components/StatsSection";
import PromoSection from "../components/PromoSection";
import Footer from "../components/Footer";

const Home = () => (
  <Box
    sx={{
      // Tu peux supprimer le dégradé “hard-codé” pour laisser le background par défaut
      // background: "linear-gradient(to bottom, #f9fafe, #ffffff)",
      minHeight: "100vh",
      // Utilise directement le background par défaut du thème :
      bgcolor: "background.default",
      color: "text.primary",
    }}
  >
    <Navbar />
    <HeroCarousel />
    <Presentation />
    <Testimonials />
    <StatsSection />
    <PromoSection />
    <Footer />
  </Box>
);

export default Home;
