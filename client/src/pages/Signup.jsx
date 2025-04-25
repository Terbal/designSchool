import { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ⬅️ Ajouter ça en haut

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/signup",
        formData
      );
      setMessage(res.data.message);

      // 🔁 Redirection après succès :
      setTimeout(() => {
        navigate("/login");
      }, 1500); // attends 1.5s pour montrer le message
    } catch (error) {
      setMessage(error.response?.data?.error || "Erreur lors de l’inscription");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inscription
      </Typography>
      {message && <Alert severity="info">{message}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Nom"
          name="nom"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mot de passe"
          type="password"
          name="mot_de_passe"
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" type="submit">
          S'inscrire
        </Button>

        <Typography>
          Déjà inscrit ? <Link to="/login">Connecte-toi</Link>
        </Typography>
      </form>
    </Container>
  );
}
