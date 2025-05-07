// src/pages/Home.jsx
import { Box, ThemeProvider } from "@mui/material";
import { motion } from "framer-motion"; // <== AJOUT
import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import Presentation from "../components/Presentation";
import Testimonials from "../components/Testimonials";
import StatsSection from "../components/StatsSection";
import PromoSection from "../components/PromoSection";
import Footer from "../components/Footer";
import getDesignSchoolTheme from "../theme";

// --- Animation par défaut pour les sections ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const lightTheme = getDesignSchoolTheme("light");

const Home = () => (
  <>
    <Navbar />
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <HeroCarousel />

        {/* Chaque section "pop" en entrant dans la vue */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Presentation />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Testimonials />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatsSection />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <PromoSection />
        </motion.div>

        <Footer />
      </Box>
    </ThemeProvider>
  </>
);

export default Home;
