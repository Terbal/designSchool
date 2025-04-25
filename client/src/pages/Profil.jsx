import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import Navbar from "../components/Navbar";

const Profil = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ nom: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData({ nom: res.data.nom, email: res.data.email });
      } catch (err) {
        console.error("Erreur chargement profil :", err);
      }
    };

    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("✅ Profil mis à jour !");
      setError("");
    } catch (err) {
      setMessage("");
      setError("❌ Erreur lors de la mise à jour");
    }
  };

  const handleChangePassword = async () => {
    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setError("❌ Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/update-password`,
        {
          ancienMotDePasse,
          nouveauMotDePasse,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(res.data.message);
      setError("");
      setAncienMotDePasse("");
      setNouveauMotDePasse("");
      setConfirmationMotDePasse("");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.error || "❌ Erreur inconnue");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Mon Profil
        </Typography>

        <TextField
          fullWidth
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />

        <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
          Sauvegarder
        </Button>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6">🔒 Changer de mot de passe</Typography>

        <TextField
          fullWidth
          label="Ancien mot de passe"
          type="password"
          value={ancienMotDePasse}
          onChange={(e) => setAncienMotDePasse(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Nouveau mot de passe"
          type="password"
          value={nouveauMotDePasse}
          onChange={(e) => setNouveauMotDePasse(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Confirmer le nouveau mot de passe"
          type="password"
          value={confirmationMotDePasse}
          onChange={(e) => setConfirmationMotDePasse(e.target.value)}
          margin="normal"
        />

        <Button
          variant="contained"
          color="warning"
          onClick={handleChangePassword}
          sx={{ mt: 2 }}
        >
          Mettre à jour le mot de passe
        </Button>

        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </>
  );
};

export default Profil;
