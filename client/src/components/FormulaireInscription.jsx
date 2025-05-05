import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Divider,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Email,
  Schedule,
  School,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const formatCreneau = (dateStr, heureStr, places) => {
  if (!dateStr || !heureStr || places === undefined) return "Créneau invalide";
  const jours = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const mois = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj)) return "Date invalide";
  const jourSemaine = jours[dateObj.getUTCDay()];
  const jour = dateObj.getUTCDate();
  const moisNom = mois[dateObj.getUTCMonth()];
  const annee = dateObj.getUTCFullYear();
  const [heure, minute] = heureStr.split(":");
  return `${jourSemaine} ${jour} ${moisNom} ${annee} à ${heure}h${minute} (${places} places disponibles)`;
};

export default function FormulaireInscription() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [cours, setCours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedCreneauId, setSelectedCreneauId] = useState("");
  const [etudiantNom, setEtudiantNom] = useState(user?.name || "");
  const [etudiantEmail, setEtudiantEmail] = useState(user?.email || "");

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/cours/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCours(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCours();
  }, [id]);

  const handleInscription = async (e) => {
    e.preventDefault();
    if (!etudiantNom || !etudiantEmail || !selectedCreneauId) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/inscriptions",
        {
          cours_id: id,
          creneau_id: selectedCreneauId,
          etudiant_nom: etudiantNom,
          etudiant_email: etudiantEmail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dashboard-etudiant");
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      setMessage("Erreur lors de l'inscription.");
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Bouton retour */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          to="/dashboard-etudiant"
          startIcon={<ArrowBack />}
          sx={{
            textTransform: "none",
            color: theme.palette.text.secondary,
            fontWeight: 500,
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          Retour au dashboard
        </Button>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            overflow: "visible",
          }}
        >
          {/* En-tête */}
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 4,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
              },
            }}
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "white",
                    color: "primary.main",
                  }}
                >
                  <School sx={{ fontSize: 32 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  Inscription au cours
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {cours?.titre}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Corps du formulaire */}
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Colonne de gauche - Formulaire */}
              <Grid item xs={12} md={7}>
                <form onSubmit={handleInscription}>
                  <TextField
                    fullWidth
                    label="Nom complet"
                    variant="outlined"
                    value={etudiantNom}
                    onChange={(e) => setEtudiantNom(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Adresse email"
                    variant="outlined"
                    value={etudiantEmail}
                    onChange={(e) => setEtudiantEmail(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 },
                    }}
                  />

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="creneau-label">Choix du créneau</InputLabel>
                    <Select
                      labelId="creneau-label"
                      value={selectedCreneauId}
                      label="Choix du créneau"
                      onChange={(e) => setSelectedCreneauId(e.target.value)}
                      sx={{ borderRadius: 2 }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: 2,
                            mt: 1,
                          },
                        },
                      }}
                    >
                      {cours?.creneaux.map((creneau) => (
                        <MenuItem
                          key={creneau.id}
                          value={creneau.id}
                          sx={{ py: 1.5 }}
                        >
                          <Box sx={{ width: "100%" }}>
                            <Typography variant="subtitle1" fontWeight={500}>
                              {formatCreneau(
                                creneau.date,
                                creneau.heure,
                                creneau.places_disponibles
                              )}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 1,
                              }}
                            >
                              <Chip
                                label={`${creneau.places_disponibles} places`}
                                size="small"
                                color={
                                  creneau.places_disponibles > 2
                                    ? "success"
                                    : "error"
                                }
                                sx={{ fontWeight: 600 }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Heure : {creneau.heure}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {message && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        alignItems: "center",
                      }}
                    >
                      {message}
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    size="large"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "primary.dark",
                        transform: "translateY(-1px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    Valider l'inscription
                  </Button>
                </form>
              </Grid>

              {/* Colonne de droite - Détails */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    bgcolor: "background.default",
                    borderRadius: 3,
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Détails du cours
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {cours?.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip
                      icon={<Schedule />}
                      label={`${cours?.creneaux.length} créneaux disponibles`}
                      color="info"
                    />
                    <Chip
                      label={`Formateur : ${
                        cours?.formateur || "Non spécifié"
                      }`}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
}
