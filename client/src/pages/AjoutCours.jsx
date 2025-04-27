import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const AjoutCours = () => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    formateur_id: "",
  });
  const [formateurs, setFormateurs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFormateurs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/formateurs");
        setFormateurs(res.data);
      } catch (err) {
        console.error("Erreur récupération formateurs", err);
      }
    };

    fetchFormateurs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cours",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("✅ Cours ajouté avec succès !");
      setFormData({ titre: "", description: "", formateur_id: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de l'ajout du cours");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Ajouter un cours
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Titre"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          select
          label="Formateur"
          name="formateur_id"
          value={formData.formateur_id}
          onChange={handleChange}
          margin="normal"
        >
          {formateurs.map((f) => (
            <MenuItem key={f.id} value={f.id}>
              {f.nom}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Ajouter
        </Button>
        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </form>
    </Container>
  );
};

export default AjoutCours;
