import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

const ListeCours = () => {
  const { user } = useAuth();
  const [cours, setCours] = useState([]);
  const [mesCours, setMesCours] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editingCours, setEditingCours] = useState(null);
  const [formateurs, setFormateurs] = useState([]);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    formateur_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let resCours;
        if (user?.role === "formateur") {
          resCours = await axios.get("http://localhost:5000/api/mes-modules", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        } else if (user?.role === "etudiant") {
          resCours = await axios.get("http://localhost:5000/api/mes-cours", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        } else {
          resCours = await axios.get("http://localhost:5000/api/cours");
        }

        const resFormateurs = await axios.get(
          "http://localhost:5000/api/formateurs"
        );
        setCours(resCours.data);
        setFormateurs(resFormateurs.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement des données :", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleEdit = (cours) => {
    setEditingCours(cours.id);
    setFormData({
      titre: cours.titre,
      description: cours.description,
      formateur_id: cours.formateur_id || "",
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/cours/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updatedList = cours.map((c) =>
        c.id === id ? { ...c, ...formData } : c
      );
      setCours(updatedList);
      setEditingCours(null);
    } catch (err) {
      console.error("Erreur modification :", err);
    }
  };

  const handleInscription = async (coursId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/inscription/cours/${coursId}/inscrire`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Inscription réussie !");
    } catch (err) {
      console.error(
        "Erreur lors de l'inscription :",
        err.response?.data || err.message
      );
      alert("Erreur lors de l'inscription.");
    }
  };

  const handleVoirEtudiants = (coursId) => {
    window.location.href = `/modules/${coursId}/etudiants`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce cours ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/cours/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCours(cours.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  return (
    <Container>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Liste des Cours</Typography>

        {(user?.role === "admin" || user?.role === "formateur") && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/ajout-cours"
          >
            Ajouter un cours
          </Button>
        )}
      </Stack>
      {/* <Typography variant="h4" gutterBottom>
        Liste des cours
      </Typography> */}
      <Grid container spacing={2}>
        {cours.map((c) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
            <Card>
              <CardContent>
                {editingCours === c.id ? (
                  <>
                    <TextField
                      fullWidth
                      label="Titre"
                      value={formData.titre}
                      onChange={(e) =>
                        setFormData({ ...formData, titre: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      select
                      label="Formateur"
                      value={formData.formateur_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          formateur_id: e.target.value,
                        })
                      }
                      margin="normal"
                    >
                      {formateurs.map((f) => (
                        <MenuItem key={f.id} value={f.id}>
                          {f.nom}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleSave(c.id)}
                      >
                        Sauvegarder
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setEditingCours(null)}
                      >
                        Annuler
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      component="a"
                      href={`/cours/${c.id}`}
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                        cursor: "pointer",
                      }}
                    >
                      {c.titre}
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                      {c.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Formateur :{" "}
                      {formateurs.find((f) => f.id === c.formateur_id)?.nom ||
                        "Inconnu"}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      {user?.role === "admin" && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(c.id)}
                        >
                          Supprimer
                        </Button>
                      )}
                      {["admin", "formateur"].includes(user?.role) && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(c)}
                        >
                          Modifier
                        </Button>
                      )}

                      {user?.role === "etudiant" && (
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => handleInscription(c.id)}
                        >
                          S'inscrire
                        </Button>
                      )}

                      {user?.role === "formateur" && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleVoirEtudiants(c.id)}
                        >
                          Voir les étudiants
                        </Button>
                      )}
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListeCours;
