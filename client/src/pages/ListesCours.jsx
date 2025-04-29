// src/pages/ListeCours.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function ListeCours() {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]); // tous les cours
  const [enrolled, setEnrolled] = useState([]); // mes cours
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Prépare toujours le header pour les appels privés
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        if (user.role === "etudiant") {
          // 2 appels : tous les cours + mes cours, tous deux autorisés
          const [allRes, myRes] = await Promise.all([
            axios.get("http://localhost:5000/api/cours", config),
            axios.get(
              "http://localhost:5000/api/inscription/mes-cours",
              config
            ),
          ]);
          setAvailable(allRes.data);
          setEnrolled(myRes.data);
        } else if (user.role === "formateur") {
          const res = await axios.get(
            "http://localhost:5000/api/formateurs/mes-modules",
            config
          );
          setAvailable(res.data);
        } else if (user.role === "admin") {
          const res = await axios.get(
            "http://localhost:5000/api/cours",
            config
          );
          setAvailable(res.data);
        }
      } catch (err) {
        console.error("Erreur chargement des cours :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {user.role === "etudiant" && "Cours disponibles"}
        {user.role === "formateur" && "Mes modules"}
        {user.role === "admin" && "Tous les cours"}
      </Typography>

      <Grid container spacing={2}>
        {/* Étudiant → on affiche tous les cours disponibles, en excluant ceux déjà inscrits */}
        {user.role === "etudiant" &&
          available
            .filter((c) => !enrolled.some((e) => e.id === c.id))
            .map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{c.titre}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {c.description}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          (window.location.href = `/cours/${c.id}`)
                        }
                      >
                        Voir
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={
                          () => (window.location.href = `/cours/${c.id}`) // remplacé par le formulaire d’inscription plus tard
                        }
                      >
                        S’inscrire
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}

        {/* Formateur / Admin → affichage de available (tous ou mes modules) */}
        {(user.role === "formateur" || user.role === "admin") &&
          available.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{c.titre}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {c.description}
                  </Typography>
                  {/* Pour l’admin, on pourra ajouter des boutons Modifier/Supprimer ici */}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Section "Mes cours" pour l'étudiant seulement */}
      {user.role === "etudiant" && enrolled.length > 0 && (
        <>
          <Typography variant="h4" gutterBottom sx={{ mt: 5 }}>
            Mes cours
          </Typography>

          <Grid container spacing={2}>
            {enrolled.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <Card>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6">{c.titre}</Typography>
                      {/* Indicateur d’état ; on pourra le changer selon la progression */}
                      <Chip label="Inscrit" size="small" color="success" />
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {c.description}
                    </Typography>
                    <Button
                      size="small"
                      sx={{ mt: 2 }}
                      variant="contained"
                      onClick={() => (window.location.href = `/cours/${c.id}`)}
                    >
                      Accéder
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
