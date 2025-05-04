import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Chip,
  Skeleton,
  Button,
  useTheme,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import {
  PlayCircle,
  Description,
  Download,
  VideoLibrary,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContenuCours = () => {
  const { id } = useParams();
  const [contenu, setContenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const transformYouTubeUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?rel=0&showinfo=0`
      : url;
  };

  useEffect(() => {
    const fetchContenu = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/cours/${id}/contenu`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setContenu(res.data);
      } catch (error) {
        console.error("Erreur chargement contenu :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContenu();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );

  if (!contenu)
    return (
      <Typography variant="h5" sx={{ textAlign: "center", mt: 4 }}>
        Contenu non disponible
      </Typography>
    );

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 6, pt: 6 }}>
        {/* Hero Section */}

        <Box
          sx={{
            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            mb: 6,
            borderBottomLeftRadius: 56,
            borderBottomRightRadius: 56,
            overflow: "hidden",
            boxShadow: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        >
          <CardMedia
            component="img"
            height="400"
            image={
              contenu?.imageUrl ||
              "https://www.polytechnique-insights.com/wp-content/uploads/2023/11/adobestock_659268131-1-scaled-e1701274864426.jpeg"
            }
            alt={contenu?.titre}
            sx={{
              opacity: 0.4,
              objectFit: "cover",
              width: "100%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              p: 3,
            }}
          >
            <Container maxWidth="xl">
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: "common.white",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                {contenu?.titre}
              </Typography>
              <Chip
                label={`${contenu?.videos?.length || 0} vidéos • ${
                  contenu?.documents?.length || 0
                } ressources`}
                sx={{
                  mt: 3,
                  bgcolor: "rgba(255,255,255,0.9)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  px: 2,
                  py: 1,
                }}
              />
            </Container>
          </Box>
        </Box>

        {/* Vidéos Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}
          >
            <VideoLibrary fontSize="large" color="primary" />
            Contenu vidéo
          </Typography>

          <Grid container spacing={4}>
            {contenu.videos?.map((video, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <Box
                    sx={{
                      position: "relative",
                      paddingTop: "56.25%", // 16:9 aspect ratio
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      component="iframe"
                      src={transformYouTubeUrl(video.url)}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: "16px 16px 0 0",
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                  <CardContent sx={{ bgcolor: "background.paper" }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      <PlayCircle
                        color="primary"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      />
                      {video.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {video.description || "Description non disponible"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Documents Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}
          >
            <Description fontSize="large" color="primary" />
            Ressources pédagogiques
          </Typography>

          <Grid container spacing={3}>
            {contenu.documents?.map((doc, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <motion.div whileHover={{ y: -5 }}>
                  <Card sx={{ borderRadius: 3, height: "100%", boxShadow: 3 }}>
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Description color="action" sx={{ fontSize: 40 }} />
                      <Typography variant="h6">{doc.nom}</Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ flexGrow: 1 }}
                      >
                        {doc.description || "Document complémentaire"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<Download />}
                          href={doc.url}
                          target="_blank"
                          fullWidth
                        >
                          Télécharger
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6, borderWidth: 2, borderRadius: 2 }} />
      </Container>

      <Footer />
    </>
  );
};

export default ContenuCours;
