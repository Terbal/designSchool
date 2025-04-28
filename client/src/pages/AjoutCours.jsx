// src/pages/AjouterCours.jsx
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Pour récupérer le user connecté

const AjouterCours = () => {
  const { user } = useAuth();

  const [formateurs, setFormateurs] = useState([]);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    formateur_id: "", // On va le remplir automatiquement si c'est un formateur
  });

  const fetchFormateurs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/formateurs");
      setFormateurs(res.data);
    } catch (error) {
      console.error("Erreur chargement formateurs:", error);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchFormateurs();
    } else if (user?.role === "formateur") {
      setFormData((prev) => ({ ...prev, formateur_id: user.id }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/cours", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Cours ajouté avec succès !");
      setFormData({
        titre: "",
        description: "",
        formateur_id: user?.role === "formateur" ? user.id : "",
      });
    } catch (error) {
      console.error(
        "Erreur ajout cours :",
        error.response?.data || error.message
      );
      alert("Erreur lors de l'ajout du cours.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Ajouter un nouveau cours
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Titre"
            value={formData.titre}
            onChange={(e) =>
              setFormData({ ...formData, titre: e.target.value })
            }
            required
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          {user?.role === "admin" && (
            <TextField
              select
              label="Formateur"
              value={formData.formateur_id}
              onChange={(e) =>
                setFormData({ ...formData, formateur_id: e.target.value })
              }
              required
            >
              {formateurs.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.nom}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button variant="contained" color="primary" type="submit">
            Ajouter le cours
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default AjouterCours;
