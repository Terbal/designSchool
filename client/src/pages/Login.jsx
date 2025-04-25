import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom"; // ✅ groupé ici
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  const navigate = useNavigate(); // ✅ Hook déplacé ici, correct

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(false);

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        mot_de_passe: motDePasse,
      });

      // ✅ Appeler login() du contexte Auth
      login(res.data.user, res.data.token);

      navigate("/dashboard"); // ✅ redirection
    } catch (err) {
      console.error("Erreur complète :", err);
      console.log("Détails axios :", err.response?.data);
      setMessage(
        err.response?.data?.error || "Erreur lors de la tentative de connexion"
      );
      setError(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            name="mot_de_passe"
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            type="submit"
          >
            Se connecter
          </Button>

          <Typography>
            Pas encore inscrit ? <Link to="/signup">Crée un compte</Link>
          </Typography>
        </form>
        {message && (
          <Alert severity={error ? "error" : "success"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}
