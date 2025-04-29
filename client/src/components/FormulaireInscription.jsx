import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@mui/material";
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

  const dateObj = new Date(dateStr); // Pas de concaténation ici

  if (isNaN(dateObj)) return "Date invalide";

  const jourSemaine = jours[dateObj.getUTCDay()];
  const jour = dateObj.getUTCDate();
  const moisNom = mois[dateObj.getUTCMonth()];
  const annee = dateObj.getUTCFullYear();

  // On extrait l'heure séparément, elle est déjà fournie correctement
  const [heure, minute] = heureStr.split(":");

  return `${jourSemaine} ${jour} ${moisNom} ${annee} à ${heure}h${minute} (${places} places disponibles)`;
};

export default function FormulaireInscription() {
  const { id } = useParams();
  const { user } = useAuth(); // user.name et user.email ?
  const navigate = useNavigate();

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/");
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inscription au cours
      </Typography>

      {cours && (
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">{cours.titre}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {cours.description}
          </Typography>
        </Box>
      )}

      <form onSubmit={handleInscription}>
        <TextField
          label="Nom de l'étudiant"
          fullWidth
          sx={{ mb: 2 }}
          value={etudiantNom}
          onChange={(e) => setEtudiantNom(e.target.value)}
        />
        <TextField
          label="Email de l'étudiant"
          fullWidth
          sx={{ mb: 2 }}
          value={etudiantEmail}
          onChange={(e) => setEtudiantEmail(e.target.value)}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="creneau-label">Créneau</InputLabel>
          <Select
            labelId="creneau-label"
            id="creneau-select"
            value={selectedCreneauId}
            label="Créneau"
            onChange={(e) => setSelectedCreneauId(e.target.value)}
          >
            {cours.creneaux.map((creneau) => {
              console.log(creneau); // TEMPORAIRE
              return (
                <MenuItem key={creneau.id} value={creneau.id}>
                  {formatCreneau(
                    creneau.date,
                    creneau.heure,
                    creneau.places_disponibles
                  )}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {message && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Button variant="contained" type="submit" fullWidth>
          Confirmer l’inscription
        </Button>
      </form>
    </Container>
  );
}
