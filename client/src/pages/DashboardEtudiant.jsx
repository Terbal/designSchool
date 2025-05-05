import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { School, Book, Assignment } from "@mui/icons-material";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Chip,
  useTheme,
} from "@mui/material";
import Footer from "../components/Footer";

export default function DashboardEtudiant() {
  const theme = useTheme();
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [available, setAvailable] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchAll = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          axios.get("http://localhost:5000/api/cours", config),
          axios.get("http://localhost:5000/api/inscription/mes-cours", config),
        ]);
        setAvailable(allRes.data);
        setEnrolled(myRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  const truncate = (text, max) =>
    text.length > max ? text.substring(0, max) + "..." : text;

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 4,
            pt: 5,
            "& .MuiTabs-indicator": {
              height: 4,
              borderRadius: 2,
            },
          }}
        >
          <Tab label="Cours disponibles" icon={<Book />} iconPosition="start" />
          <Tab label="Mes cours" icon={<Assignment />} iconPosition="start" />
        </Tabs>

        <Box sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Bienvenue, {user.nom}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {tab === 0
              ? "Explorez notre catalogue de cours"
              : "Vos cours en cours"}
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {(tab === 0 ? available : enrolled).map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                  maxWidth: 360,
                  width: "100%",
                  mx: "auto",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <School sx={{ mr: 1.5, color: "primary.main" }} />
                    <Typography variant="h6" component="div">
                      {c.titre}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {truncate(c.description, 100)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  {tab === 0 ? (
                    <>
                      {enrolled.some((e) => e.id === c.id) ? (
                        <Chip
                          label="Déjà inscrit"
                          color="success"
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/inscription/${c.id}`)}
                          sx={{ borderRadius: 1 }}
                        >
                          S'inscrire
                        </Button>
                      )}
                      <Button
                        size="small"
                        onClick={() => navigate(`/cours/${c.id}`)}
                        sx={{ color: "primary.main" }}
                      >
                        Voir détails
                      </Button>
                    </>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<School />}
                      onClick={() => navigate(`/cours/${c.id}/contenu`)}
                      sx={{ borderRadius: 1 }}
                    >
                      Accéder au cours
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {tab === 0 && available.length === 0 && (
          <Box sx={{ textAlign: "center", p: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Aucun cours disponible pour le moment
            </Typography>
          </Box>
        )}

        {tab === 1 && enrolled.length === 0 && (
          <Box sx={{ textAlign: "center", p: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Vous n'êtes inscrit à aucun cours
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setTab(0)}>
              Parcourir les cours
            </Button>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
}
